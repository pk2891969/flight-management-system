import { FlightStatusEnum } from "src/flight/enum/flight.enum";
import { SeatClass } from "./seat-class.interface";

export interface Flight {
  id: string;
  flightNo: string;
  from: string;
  to: string;
  departureTime: string;
  status: FlightStatusEnum
  seatClasses: {
    economy:SeatClass;
    business:SeatClass;
    first: SeatClass;
  }
}

