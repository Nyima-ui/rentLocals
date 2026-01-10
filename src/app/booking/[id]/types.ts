export interface Booking {
  listing_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: "requested" | "booked" | "declined" | "cancelled";
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

export interface ChatProps {
  booking: IncomingBooking;
}

export interface RenterBookingInfoProps {
  booking: IncomingBooking;
}

export interface SystemMessageProps {
  date: string;
}
