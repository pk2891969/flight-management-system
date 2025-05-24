import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FlightModule } from './flight/flight.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UserModule, FlightModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
