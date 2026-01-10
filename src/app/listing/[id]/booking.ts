import { SupabaseClient } from "@supabase/supabase-js";


export function calculateTotalPrice(
  startDate: string,
  endDate: string,
  pricePerDay: number
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const days = diffMs / MS_PER_DAY + 1;

  return days * pricePerDay;
}

export async function preventDoubleBooking(
  supabase: SupabaseClient,
  listingId: string,
  renterId: string,
  ownerId: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select()
    .eq("listing_id", listingId)
    .eq("renter_id", renterId)
    .eq("owner_id", ownerId)
    .in("status", ["requested", "booked"])
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
