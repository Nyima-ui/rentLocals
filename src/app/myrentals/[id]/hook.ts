import { createClient } from "@/lib/supabase/client";
import { GetOwnerRentalsProps } from "./types";

export async function getOwnersRentals(
  ownerId: string
): Promise<GetOwnerRentalsProps[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "booking_id, status, listing:listings!bookings_listing_id_fkey (title, images), price:prices!bookings_listing_id_fkey1 (price_day)"
    )
    .eq("owner_id", ownerId)
    .in("status", [
      "requested",
      "booked",
      "declined",
      "cancelled",
      "returned",
      "picked",
    ]);

  if (error) throw error;
  return data as unknown as GetOwnerRentalsProps[];
}
