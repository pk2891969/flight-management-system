import { BookingStatusEnum } from "src/booking/enum/booking.enum";
import { SeatClassEnum } from "src/flight/enum/flight.enum";

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seatClass: SeatClassEnum
  seatNumbers: string[];
  price: number;
  status: BookingStatusEnum
}
