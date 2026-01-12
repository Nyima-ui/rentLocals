import { Dispatch, SetStateAction } from "react";

export interface Booking {
  listing_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status:
    | "requested"
    | "booked"
    | "in_use"
    | "returned"
    | "completed"
    | "cancelled"
    | "declined";
  price_per_day: number;
  total_price: number;
}

export interface IncomingBooking extends Booking {
  booking_id: string;
  created_at: string;
  listings: {
    title: string;
  };
  owner: {
    avatar: string;
    first_name: string;
    last_name: string;
  };
  renter: {
    avatar: string;
    first_name: string;
    last_name: string;
  };
}

export interface ApproveRequestProps {
  id: string;
  listingId: string;
  title: string;
  start: string;
  end: string;
  pricePerDay: number;
}

export interface OwnerBookingInfoProps {
  booking: IncomingBooking;
  address: string | null;
  setAddress: Dispatch<SetStateAction<string | null>>;
  updateBookingStatus: (status: IncomingBooking["status"]) => void;
}

export interface RenterBookingInfoProps {
  booking: IncomingBooking;
  address: string | null;
}
