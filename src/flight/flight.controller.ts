import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FlightService } from './flight.service';
import { AddFlightDto } from './dto/add-flight.dto';
import { UpdateFlightStatusDto } from './dto/update-flight.dto';
import { SeatAvailabilityDto } from './dto/seat-availability.dto';
import { FlightFilterDto } from './dto/flight-fliter.dto';

@Controller('flight')
export class FlightController {
    constructor(
        private readonly flightService: FlightService
    ){}

    @Post('add-flight')
    addFlight(@Body() addFlightDto:AddFlightDto){
        return this.flightService.addFlight(addFlightDto)

    }


    @Get('all-flights')
    getAllFlights(
        @Query() filterDto:FlightFilterDto
    ){
        return this.flightService.getAllFlights(filterDto)
    }

    // @Patch('/:id')
    // updateFlight(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto){
    //     return this.flightService.updateFlight(id, updateFlightDto)
    // }

    @Patch(':id/status')
    updateFlightStatus(@Param('id') id:string, @Body() updateFlightDto:UpdateFlightStatusDto){
        return this.flightService.updateFlightStatus(id,updateFlightDto)
    }

    @Patch(':id/seats')
    updateSeatAvailability(@Param('id') id: string, @Body() seatAvailabilityDto: SeatAvailabilityDto ){
        return this.flightService.updateSeatAvailability(id,seatAvailabilityDto)

    }

}


