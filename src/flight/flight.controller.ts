import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FlightService } from './flight.service';
import { AddFlightDto } from './dto/add-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightStatusEnum } from './enum/flight.enum';
import { SeatAvailabilityDto } from './dto/seat-availability.dto';

@Controller('flight')
export class FlightController {
    constructor(
        private flightService: FlightService
    ){}

    @Post('add-flight')
    addFlight(@Body() addFlightDto:AddFlightDto){
        return this.flightService.addFlight(addFlightDto)

    }


    @Get('all-flights')
    getAllFlights(){
        return this.flightService.getAllFlights()
    }

    // @Patch('/:id')
    // updateFlight(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto){
    //     return this.flightService.updateFlight(id, updateFlightDto)
    // }

    @Patch(':id/status')
    updateFlightStatus(@Param('id') id:string, @Body() updateFlightDto:UpdateFlightDto){
        return this.flightService.updateFlightStatus(id,updateFlightDto)
    }

    @Patch(':id/seats')
    updateSeatAvailability(@Param('id') id: string, @Body() seatAvailabilityDto: SeatAvailabilityDto ){
        return this.flightService.updateSeatAvailability(id,seatAvailabilityDto)

    }

}


