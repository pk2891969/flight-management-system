import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { FareService } from './fare.service';
import { SetFareDto } from './dto/set-fare.dto';
import { UpdateFareDto } from './dto/update-fare.dto';

@Controller('fare')
export class FareController {

    constructor(
        private fareService:FareService
    ){}

    @Post(':flightId')
    setFareForFlight(@Param('flightId') flightId, @Body() setFareDto: SetFareDto){
        return this.fareService.setFareForFlight(flightId,setFareDto)
    }

    @Patch(':flightId/fares')
    updateFareForFlight(@Param('flightId') flightId, @Body() updateFareDto: UpdateFareDto){
        return this.fareService.updateFare(flightId,updateFareDto)
    }


}
