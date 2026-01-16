"use server";
import { createClient } from "@/lib/supabase/server";
import { RentalBooking } from "@/app/globalTypes";


export async function getRenterSideBookings(
  renterId: string
): Promise<RentalBooking[]> {
  const supabase = await createClient();
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
  return data as unknown as RentalBooking[];
}
