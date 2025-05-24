import { SeatClassEnum } from "src/flight/enum/flight.enum";

export interface SeatClass {
    totalSeats: number;
    availableSeats:string[]
    bookedSeats: string[]
}

