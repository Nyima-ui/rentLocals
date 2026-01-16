export interface NotifyProps {
  to: string;
  subject: string;
  html: string;
}

export interface SystemMessageProps {
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  booking_id: string;
  type: string;
  system_action:
    | "requested"
    | "booked"
    | "in_use"
    | "returned"
    | "cancelled"
    | "declined"
    | null;
}

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
