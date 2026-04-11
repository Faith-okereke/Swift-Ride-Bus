import type { BookingProps } from "../store/bookingStore";

export type SeatStatus = "available" | "taken" | "selected";

export type Bus = {
  name: string;
  departure: string;
  price: number;
  capacity: number;
  seatsTaken: number[];
  image:string;
};



export type SeatProps = {
  number: number;
  status: SeatStatus;
  driverSeat: number;
  onClick?: () => void;
};

export type BookingSummaryProps = {
  bus: Bus;
  booking: BookingProps;
};
