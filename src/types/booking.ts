import type { BookingProps } from "../store/bookingStore";

export type SeatStatus = "available" | "taken" | "selected";

export type Bus = {
  id: string;
  name: string;
  shortName: string;
  image: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  capacity: number;
  seatsTaken: number[];
  ac: boolean;
  wifi: boolean;
  terminal: string;
  tag: string;
  tagColor: "green" | "amber" | "blue" | "red";
  amenities: string[];
  hire: boolean;
  hirePrice: number;
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
