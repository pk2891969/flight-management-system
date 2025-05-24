import { SeatClassEnum } from "src/flight/enum/flight.enum";

export interface SeatClass {
    id: number;
    totalSeats: number;
    bookedSeats: number;
}
