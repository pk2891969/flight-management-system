import { BadRequestException, ConflictException, forwardRef, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddFlightDto, SeatClassesDto } from './dto/add-flight.dto';
import { v4 as uuid } from 'uuid';
import { UpdateFlightStatusDto } from './dto/update-flight.dto';
import { SeatClassEnum } from './enum/flight.enum';
import { SeatAvailabilityDto } from './dto/seat-availability.dto';
import { FareService } from 'src/fare/fare.service';
import { FlightFilterDto } from './dto/flight-fliter.dto';
import { Flight, SeatClass } from 'src/common/interfaces';
import { MAX_SEATS } from 'src/common/constants/flight.constants';



@Injectable()
export class FlightService {
    private flights = new Map<string, Flight>()

    constructor(
        @Inject(forwardRef(() => FareService))
        private readonly fareService: FareService
    ) { }

    addFlight(addFlightDto: AddFlightDto) {
        const { to, seatClasses } = addFlightDto

        const id = uuid()
        let flightNo: string

        do {
            flightNo = `IA-${to}-${Math.floor(1000 + Math.random() * 9000)}`;
        } while (this.isFlightNoExists(flightNo));

        const transformedSeatClasses: {
            economy: SeatClass;
            business: SeatClass;
            first: SeatClass;
        } = {} as any;
        for (const seatClass of Object.keys(seatClasses)) {
            const totalSeats = seatClasses[seatClass];
            if (totalSeats > MAX_SEATS[seatClass]) {
                throw new BadRequestException(`${seatClass} class cannot exceed ${MAX_SEATS[seatClass]} seats`);
            }
            const availableSeats = this.generateSeatNumbers(totalSeats, 4);

            transformedSeatClasses[seatClass] = {
                totalSeats,
                bookedSeats: [],
                availableSeats,
            };
        }

        const newFlight = {
            id,
            flightNo,
            ...addFlightDto,
            seatClasses: transformedSeatClasses,
        };
        this.flights.set(id, newFlight);

        return {
            type: 'success',
            message: 'Flight added successfully',
            id: id
        }

    }

    private isFlightNoExists(flightNo: string): boolean {
        for (const flight of this.flights.values()) {
            if (flight.flightNo === flightNo) return true;
        }
        return false;
    }

    getAllFlights(filterDto: FlightFilterDto) {
        try {
            const { from, to, status,date } = filterDto
            const allFlights = Array.from(this.flights.values());
            if (allFlights.length < 1) {
                return []
            }
            let flightsWithFares = this.mapFlightAndFare(allFlights)

            if (from) {
                flightsWithFares = flightsWithFares.filter(flight => flight.from === from);
            }

            if (to) {
                flightsWithFares = flightsWithFares.filter(flight => flight.to === to);
            }

            if (status) {
                flightsWithFares = flightsWithFares.filter(flight => flight.status === status);
            }

            if(date){
                flightsWithFares = flightsWithFares.filter(flight=> flight.date === date)
            }

            return flightsWithFares;

        } catch (e) {
            throw new InternalServerErrorException(e)

        }

    }

    // updateFlight(id: string, updateFlightDto: UpdateFlightDto) {

    //     let { flightNo, seatClasses } = updateFlightDto
    //     const flight = this.flights.get(id);

    //     if (!flight) {
    //         throw new NotFoundException(`Flight with ID ${id} not found`);
    //     }

    //     if (this.isFlightNoExists(flightNo)) {
    //         throw new ConflictException(`Flight number ${flightNo} already exists.`);
    //     }

    //     if (seatClasses) {
    //         for (const seatClassKey of ['economy', 'business', 'first'] as const) {
    //             if (seatClasses[seatClassKey]) {
    //                 const newTotalSeats = seatClasses[seatClassKey].totalSeats;
    //                 const newBookedSeats = seatClasses[seatClassKey].bookedSeats;

    //                 if (typeof newBookedSeats !== 'undefined') {
    //                     throw new BadRequestException(`Booked seats cannot be updated directly for ${seatClassKey} class.`);
    //                 }

    //                 if (typeof newTotalSeats !== 'undefined' && newTotalSeats < flight.seatClasses[seatClassKey].bookedSeats) {
    //                     throw new BadRequestException(
    //                         `Total seats for ${seatClassKey} class cannot be less than booked seats (${flight.seatClasses[seatClassKey].bookedSeats}).`
    //                     );
    //                 }
    //             }
    //         }
    //     }

    //     const updatedFlight = {
    //         ...flight,
    //         ...updateFlightDto,
    //     };

    //     this.flights.set(id, updatedFlight);

    //     return {
    //         type: 'success',
    //         message: 'Flight updated successfully',
    //         flight: updatedFlight,
    //     };


    // } // commented this since we have update flight status and update seat availability

    updateFlightStatus(id: string, updateFlightDto: UpdateFlightStatusDto) {
        let { status } = updateFlightDto
        const flight = this.flights.get(id);
        console.log(status)

        if (!flight) {
            throw new NotFoundException(`Flight with ID ${id} not found`);
        }

        if (status == flight.status) {
            return {
                type: 'info',
                message: `Flight status is already '${status}', no update performed.`,
            };

        }

        const updatedStatus = {
            ...flight,
            status
        }

        this.flights.set(id, updatedStatus)

        return {
            type: 'success',
            message: `Flight status updated to ${status} successfully`,
        };

    }

    updateSeatAvailability(
        id: string,
        seatAvailabilityDto: SeatAvailabilityDto
    ) {
        let { seatClass, totalSeats } = seatAvailabilityDto
        const flight = this.flights.get(id);

        if (!flight) {
            throw new NotFoundException(`Flight with ID ${id} not found`);
        }

        if (!Object.values(SeatClassEnum).includes(seatClass)) {
            throw new BadRequestException(`Invalid seat class: ${seatClass}`);
        }

        if (totalSeats < 0) {
            throw new BadRequestException(`Seat count cannot be negative`);
        }
        if (totalSeats > MAX_SEATS[seatClass]) {
            throw new BadRequestException(`${seatClass} class cannot exceed ${MAX_SEATS[seatClass]} seats`);
        }

        const currentSeatClass = flight.seatClasses[seatClass];
        const bookedSeats = currentSeatClass.bookedSeats;
        const isBookingStarted = bookedSeats && bookedSeats.length > 0;
        if (isBookingStarted && totalSeats !== currentSeatClass.totalSeats) {
            throw new BadRequestException(
                `Cannot update total seats for ${seatClass} after bookings have started.`
            );
        }

        // if (newCount < bookedSeats.length) {
        //     throw new BadRequestException(
        //         `Cannot reduce seats below the number of already booked seats (${bookedSeats})` 
        //     );
        // } // I've commented this because, if we allow to update seat availability after 
        // the bookings have started we should regenerate the seats based on the number of total seats

        let updatedSeatClass;

        if (!isBookingStarted && totalSeats !== currentSeatClass.totalSeats) {
            const availableSeats = this.generateSeatNumbers(totalSeats, 4);

            updatedSeatClass = {
                ...currentSeatClass,
                totalSeats,
                availableSeats,
            };
        } else {
            updatedSeatClass = {
                ...currentSeatClass,
                totalSeats,
            };
        }

        const updatedFlight = {
            ...flight,
            seatClasses: {
                ...flight.seatClasses,
                [seatClass]: updatedSeatClass,
            },
        };

        this.flights.set(id, updatedFlight);

        return {
            type: 'success',
            message: `Seat availability for ${seatClass} updated to ${totalSeats}`,
        };
    }

    getFlightById(id: string) {
        return this.flights.get(id);
    }

    private mapFlightAndFare(flights: any[]) {
        let mapped = flights.map(flight => {
            const fares = this.fareService.getFareForFlight(flight.id);

            const seatClassesWithFare = Object.entries(flight.seatClasses).reduce((acc, [className, seatInfo]) => {
                console.log(seatInfo)
                acc[className] = {
                    ...(seatInfo || { totalSeats: 0, bookedSeats: 0 }),
                    fare: fares?.[className] ?? null,
                };
                return acc;
            }, {});

            return {
                ...flight,
                seatClasses: seatClassesWithFare
            };
        });

        return mapped


    }

    generateSeatNumbers(count: number, seatsPerRow: number): string[] {
        const seatLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const seats: string[] = [];

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / seatsPerRow) + 1;
            const seatLetter = seatLetters[i % seatsPerRow];
            seats.push(`${row}${seatLetter}`);
        }

        return seats;
    }






}
