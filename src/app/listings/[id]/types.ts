export interface IncomingListing {
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
