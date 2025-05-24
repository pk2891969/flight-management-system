import { SeatClass } from "./seat-class.interface";

export interface Flight {
  id: string;
  from: string;
  to: string;
  departureTime: Date;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  seats: {
    economy: SeatClass;
    business: SeatClass;
    first: SeatClass;
  };
}
