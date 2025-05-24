import { FlightClassEnum } from "src/flight/enum/flight.enum";

export interface SeatClass {
    id: number;
    type: FlightClassEnum
    total: number;
    booked: number;
}
