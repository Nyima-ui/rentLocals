import { createClient } from "@/lib/supabase/client";
import { Listing, IncomingPrices, OwnerProfile } from "./types";

const supabase = createClient();

export async function fetchListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select()
    .eq("listing_id", id)
    .single();

  if (error) throw error;
  return data;
}

