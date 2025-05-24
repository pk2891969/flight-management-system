import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SetFareDto } from './dto/set-fare.dto';
import { FlightService } from 'src/flight/flight.service';
import { UpdateFareDto } from './dto/update-fare.dto';
import { Fare } from 'src/common/interfaces';
import { SeatClassEnum } from 'src/flight/enum/flight.enum';


@Injectable()
export class FareService {
    private fares = new Map<string, Omit<Fare,'flightId'>>()
    constructor(
        @Inject(forwardRef(() => FlightService))
        private readonly flightService: FlightService
    ) { }



    setFare(flightId: string, fareDto: SetFareDto) {


        const { economy, business, first } = fareDto;
        console.log(flightId, economy, business)
        const flight = this.flightService.getFlightById(flightId)

        if (!flight) {
            throw new BadRequestException('Invalid flight Id');
        }

        if ([economy, business, first].some(fare => fare < 0)) {
            throw new BadRequestException('Fare values must be >= 0');
        }

        const updatedFares = { economy, business, first };
        this.validateFareHierarchy(updatedFares)

        this.fares.set(flightId, updatedFares);

        return {
            type: 'success',
            message: `Fares updated successfully for flight ${flight.flightNo}`,
            fares: updatedFares,
        };
    }

    getFareForFlight(flightId: string) {
        return this.fares.get(flightId) || null;
    }

    updateFare(flightId: string, updateFareDto: UpdateFareDto) {
        const { seatClass, fare } = updateFareDto;

        const flight = this.flightService.getFlightById(flightId);
        if (!flight) return null;

        if (fare < 0) {
            throw new BadRequestException('Fare must be >= 0');
        }

        const fares = this.fares.get(flightId) || { economy: 0, business: 0, first: 0 };

        const tempFaresObj:Omit<Fare,'flightId'>= { ...fares, [seatClass]: fare };

        this.validateFareHierarchy(tempFaresObj);

        this.fares.set(flightId, tempFaresObj);

        return {
            type: 'success',
            message: `Fare updated for ${seatClass} on flight ${flightId}`,
            fares,
        };

    }

    private validateFareHierarchy(fares: { economy: number; business: number; first: number }) {
        const { economy, business, first } = fares;

        if (!(economy < business && business < first)) {
            throw new BadRequestException(
                'Fare hierarchy invalid: economy < business < first must be maintained.'
            );
        }
    }

    calculateFare(flightId: string, seatClass: SeatClassEnum, seatCount: number): number {
        const fareDetails = this.getFareForFlight(flightId);

        if (!fareDetails || fareDetails[seatClass] === undefined) {
            throw new BadRequestException(`Fare not set for ${seatClass} on flight ${flightId}`);
        }

        const farePerSeat = fareDetails[seatClass];
        return farePerSeat * seatCount;
    }


    getFareBreakdown(flightId: string, seatClass: SeatClassEnum, seatCount: number) {
        const fareDetails = this.getFareForFlight(flightId);
        const flight = this.flightService.getFlightById(flightId)

        if(!flight) throw new BadRequestException('Invalid flight Id');

        if (!fareDetails || fareDetails[seatClass] === undefined) {
            throw new BadRequestException(`Fare not set for ${seatClass} on flight ${flight.flightNo}`);
        }

        const farePerSeat = fareDetails[seatClass];
        return {
            flightNo: flight.flightNo,
            seatClass,
            seatCount,
            farePerSeat,
            totalFare: farePerSeat * seatCount
        };
    }




}
