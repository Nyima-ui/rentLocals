"use server";
import { IncomingListing } from "./types";
import { createClient } from "@/lib/supabase/server";
import { getStoragePathFromPublicUrl } from "@/lib/utils";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getListings(userId: string): Promise<IncomingListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `*, prices (
            price_day, 
            price_week, 
            price_month
          )`
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function deleteImages(
  imageUrls: string[],
  supabase: SupabaseClient
) {
  const storagePathsToDelete: string[] = (imageUrls ?? [])
    .map(getStoragePathFromPublicUrl)
    .filter((path: string | null): path is string => path !== null);

  const { error } = await supabase.storage
    .from("listing-images")
    .remove(storagePathsToDelete);

  if (error) throw error;
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("listing_id", listingId)
    .select("images")
    .single();

  if (error) throw error;
  await deleteImages(data.images, supabase);
}
