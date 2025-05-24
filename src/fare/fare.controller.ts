import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FareService } from './fare.service';
import { SetFareDto } from './dto/set-fare.dto';
import { UpdateFareDto } from './dto/update-fare.dto';
import { SeatClassEnum } from 'src/flight/enum/flight.enum';

@Controller('fare')
export class FareController {

    constructor(
        private readonly fareService:FareService
    ){}

    @Post(':flightId')
    setFare(@Param('flightId') flightId, @Body() setFareDto: SetFareDto){
        return this.fareService.setFare(flightId,setFareDto)
    }

    @Patch(':flightId/fares')
    updateFare(@Param('flightId') flightId, @Body() updateFareDto: UpdateFareDto){
        return this.fareService.updateFare(flightId,updateFareDto)
    }

    @Get('breakdown/:flightId')
    getFareBreakdown(@Param('flightId') flightId ,@Query('class') seatClass: SeatClassEnum,@Query('count') seatCount: number ){
        return this.fareService.getFareBreakdown(flightId,seatClass,seatCount)

    }


}
