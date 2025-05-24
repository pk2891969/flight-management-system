import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from 'src/common/interfaces';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FlightService } from 'src/flight/flight.service';
import { v4 as uuid } from 'uuid';
import { UserService } from 'src/user/user.service';
import { FareService } from 'src/fare/fare.service';
import { BookingStatusEnum } from './enum/booking.enum';

@Injectable()
export class BookingService {
    private bookings = new Map<string, Booking>();
    constructor(
        private readonly flightService: FlightService,
        private readonly userService: UserService,
        private readonly fareService: FareService
    ) { }

    createBooking(createBookingDto: CreateBookingDto) {
        const { flightId, seatClass, seatNumbers, userId } = createBookingDto;

        const flight = this.flightService.getFlightById(flightId);
        const user = this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found!');

        if (!flight) throw new NotFoundException('Flight not found');

        const seatInfo = flight.seatClasses[seatClass];
        if (!seatInfo) throw new BadRequestException('Invalid seat class');

        const unavailableSeats = seatNumbers.filter(
            seat => !seatInfo.availableSeats.includes(seat)
        );
        if (unavailableSeats.length > 0) {
            throw new BadRequestException(
                `The following seats are not available in ${seatClass}: ${unavailableSeats.join(', ')}`
            );
        }

        const totalFare = this.fareService.calculateFare(flightId, seatClass, seatNumbers.length);

        seatInfo.availableSeats = seatInfo.availableSeats.filter(
            seat => !seatNumbers.includes(seat)
        );
        seatInfo.bookedSeats.push(...seatNumbers);

        const bookingId = uuid();
        const booking: Booking = {
            id: bookingId,
            flightId,
            seatClass,
            seatNumbers,
            userId,
            price: totalFare,
            status: BookingStatusEnum.CONFIRMED
        };

        this.bookings.set(bookingId, booking);

        return {
            type: 'success',
            message: `Booking successful`,
            booking: {
                flightNo: flight.flightNo,
                userName: user.name,
                departure: flight.departureTime,
                from:flight.from,
                to:flight.to,
                ...booking,
                
            },
        };
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
            status:BookingStatusEnum.CANCELLED
        }

        this.bookings.set(id,updatedBooking);
        return { message: 'Booking cancelled successfully' };
    }

}
