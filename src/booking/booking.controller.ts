import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) { }

    @Post()
    createBooking(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.createBooking(createBookingDto)
    }

    @Get('user/:userId')
    getBookingsByUser(@Param('userId') userId: string) {
        return this.bookingService.getBookingsByUser(userId);
    }

    @Get()
    getAllBookings() {
        return this.bookingService.getAllBookings()
    }

    @Delete(':id')
    cancel(@Param('id') id: string) {
        return this.bookingService.cancelBooking(id);
    }


}
