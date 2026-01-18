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

export interface Listing {
  category: string[];
  created_at: string;
  description: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  listing_id: string;
  pickup_location: string;
  title: string;
  updated_at: string;
  user_id: string;
  prices: {
    price_day: number;
    price_week: number | null;
    price_month: number | null;
  };
}