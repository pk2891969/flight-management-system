import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Booking } from 'src/common/interfaces';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FlightService } from 'src/flight/flight.service';
import { v4 as uuid } from 'uuid';
import { UserService } from 'src/user/user.service';
import { FareService } from 'src/fare/fare.service';
import { BookingStatusEnum } from './enum/booking.enum';
import { Mutex } from 'async-mutex';
import { resolve } from 'path';

@Injectable()
export class BookingService {
    private bookings = new Map<string, Booking>();
    private flightMutexes = new Map<string, Mutex>();
    private seatClassMutexes = new Map<string,Mutex>() // we can use seat mutexes if we want to lock the seat 

    constructor(
        private readonly flightService: FlightService,
        private readonly userService: UserService,
        private readonly fareService: FareService
    ) { }

    private getMutexForFlight(flightId: string): Mutex {
        if (!this.flightMutexes.has(flightId)) {
            this.flightMutexes.set(flightId, new Mutex());
        }
        return this.flightMutexes.get(flightId)!;
    }

    async createBooking(createBookingDto: CreateBookingDto):Promise<any> {
        const { flightId, seatClass, seatNumbers, userId } = createBookingDto;
        const mutex = this.getMutexForFlight(createBookingDto.flightId);


        return mutex.runExclusive(async () => {
            try {
                const flight = this.flightService.getFlightById(flightId);
                const user = this.userService.getUserById(userId);
                if (!user) throw new NotFoundException('User not found!');
                if (!flight) throw new NotFoundException('Flight not found');

                const seatInfo = flight.seatClasses[seatClass];
                if (!seatInfo) throw new BadRequestException('Invalid seat class');

                await new Promise(res => setTimeout(res, Math.random() * 50));
                const unavailableSeats = seatNumbers.filter(
                    seat => !seatInfo.availableSeats.includes(seat)
                );
                if (unavailableSeats.length > 0) {
                    throw new BadRequestException(
                        `The following seats are not available in ${seatClass}: ${unavailableSeats.join(', ')}`
                    );
                }

                const totalFare = this.fareService.calculateFare(flightId, seatClass, seatNumbers.length);
                await new Promise(res => setTimeout(res, Math.random() * 100));

                seatInfo.availableSeats = seatInfo.availableSeats.filter(
                    seat => !seatNumbers.includes(seat)
                );

                await new Promise(res => setTimeout(res, Math.random() * 200));
                seatInfo.bookedSeats.push(...seatNumbers);

                const bookingId = uuid();
                const booking: Booking = {
                    id: bookingId,
                    flightId,
                    seatClass,
                    seatNumbers,
                    userId,
                    price: totalFare,
                    status: BookingStatusEnum.CONFIRMED,
                };

                this.bookings.set(bookingId, booking);

                return {
                    type: 'success',
                    message: 'Booking successful',
                    booking: {
                        flightNo: flight.flightNo,
                        userName: user.name,
                        departure: flight.departureTime,
                        from: flight.from,
                        to: flight.to,
                        ...booking,
                    },
                };
            } catch (e) {
                if (e instanceof HttpException) {
                    throw e;
                }
                throw new InternalServerErrorException(e);
            }
        });
    }

    getBookingsByUser(userId: string) {
        return Array.from(this.bookings.values()).filter(
            booking => booking.userId === userId,
        );
    }
    getAllBookings() {
        const bookingsWithDetails = Array.from(this.bookings.values()).map(booking => {
            const flight = this.flightService.getFlightById(booking.flightId);
            const user = this.userService.getUserById(booking.userId);

            return {
                flightNo: flight?.flightNo || 'Unknown',
                userName: user?.name || 'Unknown',
                seatClass: booking.seatClass,
                seatNumbers: booking.seatNumbers,
                price: booking.price,
                status: booking.status
            };
        });

        return bookingsWithDetails
    }

    cancelBooking(id: string) {
        const booking = this.bookings.get(id);
        if (!booking) throw new NotFoundException('Booking not found');

        const flight = this.flightService.getFlightById(booking.flightId);
        if (flight) {
            const seatInfo = flight.seatClasses[booking.seatClass];
            seatInfo.bookedSeats = seatInfo.bookedSeats.filter(
                seat => !booking.seatNumbers.includes(seat),
            );
            seatInfo.availableSeats.push(...booking.seatNumbers);
        }
        const updatedBooking = {
            ...booking,
            status: BookingStatusEnum.CANCELLED
        }

        this.bookings.set(id, updatedBooking);
        return { message: 'Booking cancelled successfully' };
    }

    async simulateConcurrentBookings( bookingDtos) {
        const bookingPromises = bookingDtos.map(dto => this.createBooking(dto));

        const results = await Promise.allSettled(bookingPromises);

        results.forEach((result, i) => {
            if (result.status === 'fulfilled') {
                console.log(`Booking ${i + 1} succeeded:`, result.value);
            } else {
                console.log(`Booking ${i + 1} failed:`, result.reason.message);
            }
        });
    } // checking concurrent users trying to book at the same time


}
