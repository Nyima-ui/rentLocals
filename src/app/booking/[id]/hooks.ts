import { createClient } from "@/lib/supabase/client";
import { IncomingBooking } from "./types";

export async function getBookingDetails(
  id: string
): Promise<IncomingBooking | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, listings (title), owner:profiles!bookings_owner_id_fkey1 (avatar, first_name, last_name), renter:profiles!bookings_renter_id_fkey1 (avatar, first_name, last_name)"
    )
    .eq("booking_id", id)
    .single();

  if (error) throw error;
  return data;
}


