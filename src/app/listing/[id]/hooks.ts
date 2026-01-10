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
