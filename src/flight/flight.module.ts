import { forwardRef, Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { FareModule } from 'src/fare/fare.module';

@Module({
  imports:[forwardRef(() =>FareModule)],
  controllers: [FlightController],
  providers: [FlightService],
  exports:[FlightService]
})
export class FlightModule {}
