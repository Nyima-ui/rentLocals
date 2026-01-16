import { SupabaseClient } from "@supabase/supabase-js";
import { Prices } from "./types";

export async function insertListingPrices(
  supabase: SupabaseClient,
  listingId: string,
  prices: Prices
) {
  const { error } = await supabase.from("prices").insert({
    listing_id: listingId,
    price_day: prices.priceDay,
    price_week: prices.priceWeek,
    price_month: prices.priceMonth,
  });

  if (error) throw error;
}

export async function uploadListingImages(
  supabase: SupabaseClient,
  userId: string,
  listingId: string,
  images: (File | null)[]
) {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const imageFile = images[i];
    if (!imageFile) continue;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${i}-${Date.now()}.${fileExt}`;

    const filePath = `${userId}/${listingId}/${fileName}`;

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }
  return uploadedUrls;
}
