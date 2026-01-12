export interface Listing {
  listing_id: string;
  user_id: string;
  title: string;
  description: string;
  images: string[];
  category: string[];
  pickup_location: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface IncomingPrices {
  listing_id: string;
  price_day: number;
  price_week: number | null;
  price_month: number | null;
}

export interface Booking {
  listing_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: "requested" | "booked" | "declined" | "cancelled" | "expired";
  price_per_day: number;
  total_price: number;
}

export interface OwnerProfile {
  avatar: string;
  first_name: string;
  last_name: string;
}

export interface BookingDetails {
  renter: {
    last_name: string;
    first_name: string;
  };
  listing: {
    title: string;
  };
}

export interface RequestBookingActionProps {
  listingId: string;
  ownerId: string;
  renterId: string;
  start: string;
  end: string;
  pricePerDay: number;
}
