import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddFlightDto } from './dto/add-flight.dto';
import { v4 as uuid } from 'uuid';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightClassEnum, FlightStatusEnum } from './enum/flight.enum';
import { SeatAvailabilityDto } from './dto/seat-availability.dto';


@Injectable()
export class FlightService {
    private flights = new Map<string, any>()

    addFlight(addFlightDto: AddFlightDto) {
        const { to, seatClasses } = addFlightDto

        const id = uuid()
        let flightNo: string

        do {
            flightNo = `IA-${to}-${Math.floor(1000 + Math.random() * 9000)}`;
        } while (this.isFlightNoExists(flightNo));

        const newFlight = {
            id,
            flightNo,
            ...addFlightDto
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

    getAllFlights() {
        return Array.from(this.flights.values());
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

    updateFlightStatus(id: string, updateFlightDto: UpdateFlightDto) {
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
        seatAvailabilityDto:SeatAvailabilityDto
    ) {
        let {flightClass,newCount} = seatAvailabilityDto
        const flight = this.flights.get(id);

        if (!flight) {
            throw new NotFoundException(`Flight with ID ${id} not found`);
        }

        if (!Object.values(FlightClassEnum).includes(flightClass)) {
            throw new BadRequestException(`Invalid seat class: ${flightClass}`);
        }

        if (newCount < 0) {
            throw new BadRequestException(`Seat count cannot be negative`);
        }

        const currentSeatClass = flight.seatClasses[flightClass];
        const bookedSeats = currentSeatClass.bookedSeats;

        if (newCount < bookedSeats) {
            throw new BadRequestException(
                `Cannot reduce seats below the number of already booked seats (${bookedSeats})`
            );
        }


        const updatedFlight = {
            ...flight,
            seatClasses: {
                ...flight.seatClasses,
                [flightClass]: {
                    ...currentSeatClass,
                    totalSeats: newCount
                }
            },
        };

        this.flights.set(id, updatedFlight);

        return {
            type: 'success',
            message: `Seat availability for ${flightClass} updated to ${newCount}`,
        };
    }



}
