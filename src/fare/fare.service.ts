import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { SetFareDto } from './dto/set-fare.dto';
import { FlightService } from 'src/flight/flight.service';
import { UpdateFareDto } from './dto/update-fare.dto';

type FareData = {
    economy: number;
    business: number;
    first: number;
};
@Injectable()
export class FareService {
    private fares = new Map<string, FareData>()
    constructor(
        @Inject(forwardRef(() => FlightService))
        private flightService: FlightService
    ) { }



    setFareForFlight(flightId: string, fareDto: SetFareDto) {


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
            message: `Fares updated successfully for flight ${flightId}`,
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

        const tempFaresObj: FareData = { ...fares, [seatClass]: fare };

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

    calculateFare(){
        
    }



}
