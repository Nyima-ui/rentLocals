'use server'
import { createClient } from "@/lib/supabase/server";
import { IncomingListing, UpdatedListing, FinalPrice } from "./types";
import { ImageSlot } from "./types";
import { getStoragePathFromPublicUrl } from "./utils";

export async function getListing(id: string): Promise<IncomingListing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `*, prices (
        price_day, 
        price_week, 
        price_month)`
    )
    .eq("listing_id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function uploadNewImages(
  imageSlots: ImageSlot[],
  userId: string,
  listingId: string
) {
  const supabase = await createClient();
  const uploadedUrls: { [key: number]: string } = {};
  const newImages = imageSlots
    .map((slot, idx) => ({ slot, idx }))
    .filter(({ slot }) => slot.type === "new" && slot.file);

  for (const { slot, idx } of newImages) {
    if (!slot.file) continue;

    const fileExt = slot.file.name.split(".").pop();
    const fileName = `${idx}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${listingId}/${fileName}`;

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(filePath, slot.file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(filePath);

    uploadedUrls[idx] = publicUrl;
  }

  const finalImages = imageSlots
    .map((slot, idx) => {
      if (uploadedUrls[idx]) return uploadedUrls[idx];
      if (slot.type === "existing" && slot.url) return slot.url;
      return null;
    })
    .filter(Boolean) as string[];

  return finalImages;
}

export async function getOldImageUrls(listingId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("images")
    .eq("listing_id", listingId)
    .single();

  if (error) throw error;
  return data?.images ?? [];
}

export async function removeOldImageUrls(
  oldUrls: string[],
  finalUrls: string[]
) {
  const supabase = await createClient();
  const unusedUrls = oldUrls.filter((url) => !finalUrls.includes(url));

  if (unusedUrls.length === 0) return;

  const pathsToDelete = unusedUrls
    .map(getStoragePathFromPublicUrl)
    .filter(Boolean) as string[];

  if (pathsToDelete.length === 0) return;

  const { error } = await supabase.storage
    .from("listing-images")
    .remove(pathsToDelete);

  if (error) throw new Error(`Error deleting unused images: ${error.message}`);
}

export async function updateListing(
  listing: UpdatedListing,
  listingId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update(listing)
    .eq("listing_id", listingId);

  if (error) throw error;
}

export async function updateListingPrices(
  finalPrice: FinalPrice,
  listingId: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prices")
    .update(finalPrice)
    .eq("listing_id", listingId);

  if (error) throw error;
}
