import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { FlightModule } from 'src/flight/flight.module';
import { UserModule } from 'src/user/user.module';
import { FareModule } from 'src/fare/fare.module';

@Module({
  imports:[FlightModule,UserModule,FareModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
