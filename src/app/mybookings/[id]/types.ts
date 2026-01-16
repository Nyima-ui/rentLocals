export type BookingStatus =
  | "requested"
  | "booked"
  | "declined"
  | "cancelled"
  | "returned"
  | "picked";

export interface RentalBooking {
  booking_id: string;
  status: BookingStatus;
  listing: {
    images: string[];
    title: string;
  };
  price: {
    price_day: number;
  };
}
