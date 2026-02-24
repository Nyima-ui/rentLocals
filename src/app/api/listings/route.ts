import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchListing, getRandomUserId } from "./action";

export async function GET(request: NextRequest) {
  try {
    const secret = request.headers.get("x-cron-secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createClient();

    const [{ user_id }, listing] = await Promise.all([
      getRandomUserId(),
      fetchListing(),
    ]);

    if (!listing) {
      return NextResponse.json(
        { message: "Failed to fetch listing from Hygglo" },
        { status: 502 },
      );
    }

    const { title, description, category, pickup_location, prices, images } =
      listing;

    const { data: newListing, error: listingError } = await supabase
      .from("listings")
      .insert({
        user_id,
        title,
        description,
        category: [category],
        pickup_location,
        images,
      })
      .select()
      .single();

    if (listingError) throw listingError;

    const { error: pricesError } = await supabase.from("prices").insert({
      listing_id: newListing.listing_id,
      price_day: prices.day,
      price_week: prices.week,
    });

    if (pricesError) throw pricesError;

    return NextResponse.json({ message: "Listing created successfully" });
  } catch (error) {
    console.error("Error creating scraped listing", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
