import { createClient } from "@/lib/supabase/client";
import { Listing, IncomingPrices, OwnerProfile } from "./types";

const supabase = createClient();

export async function getListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select()
    .eq("listing_id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getPrices(id: string): Promise<IncomingPrices | null> {
  const { data } = await supabase
    .from("prices")
    .select()
    .eq("listing_id", id)
    .single();

  return data ?? null;
}

export async function getOwnerProfile(
  ownerId: string
): Promise<OwnerProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("avatar, first_name, last_name")
    .eq("user_id", ownerId)
    .single();

  return data ?? null;
}

export interface CheckIfBookedByTheSameRenterProps {
  renterId: string;
  ownerId: string;
  listingId: string;
}
//better function name?
export async function checkIfBookedByTheSameRenter({
  renterId,
  ownerId,
  listingId,
}: CheckIfBookedByTheSameRenterProps): Promise<"requested" | "booked" | null> {
  const { data: booking, error } = await supabase
    .from("bookings")
    .select()
    .eq("renter_id", renterId)
    .eq("owner_id", ownerId)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (error) throw error;
  if (!booking) return null;

  if (booking.status === "requested") {
    return "requested";
  }

  if (booking.status === "booked") {
    return "booked";
  }
  return null;
}
