import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FlightModule } from './flight/flight.module';
import { BookingModule } from './booking/booking.module';
import { FareModule } from './fare/fare.module';

@Module({
  imports: [UserModule, FlightModule, BookingModule, FareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
