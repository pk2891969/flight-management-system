import { forwardRef, Module } from '@nestjs/common';
import { FareController } from './fare.controller';
import { FareService } from './fare.service';
import { FlightService } from 'src/flight/flight.service';
import { FlightModule } from 'src/flight/flight.module';

@Module({
  imports:[forwardRef(() =>FlightModule)],
  controllers: [FareController],
  providers: [FareService],
  exports:[FareService]
})
export class FareModule {}
