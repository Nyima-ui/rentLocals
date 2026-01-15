import { createClient } from "@/lib/supabase/client";
import { GetRenterBookingsProps } from "./types";

//better function name here
export async function getRenterBookings(
  renterId: string
): Promise<GetRenterBookingsProps[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "booking_id, status, listing:listings!bookings_listing_id_fkey (title, images), price:prices!bookings_listing_id_fkey1 (price_day)"
    )
    .eq("renter_id", renterId)
    .in("status", [
      "requested",
      "booked",
      "declined",
      "cancelled",
      "returned",
      "picked",
    ]);

  if (error) throw error;
  return data as unknown as GetRenterBookingsProps[];
}
