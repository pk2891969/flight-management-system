export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seatClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  quantity: number;
}
