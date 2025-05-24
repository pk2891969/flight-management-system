import { FlightStatusEnum } from "src/flight/enum/flight.enum";
import { SeatClass } from "./seat-class.interface";

export interface Flight {
  id: string;
  flightNo: string;
  from: string;
  to: string;
  departureTime: Date;
  status: FlightStatusEnum
  seats: SeatClass[]
}
