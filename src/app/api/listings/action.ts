import { createAdminClient } from "@/lib/supabase/admin";
import {
  HYGGLO_BASE_URL,
  COUNTRIES,
  CATEGORIES,
  type Country,
  type HyggloListing,
  type Listing,
} from "./constants";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseHyggloListing(listing: HyggloListing): Listing {
  return {
    title: listing.product.name,
    description: listing.product.description,
    category: listing.product.category.name,
    pickup_location: listing.location.street || listing.location.label,
    prices: {
      day: listing.product.prices.find((p) => p.days === 1)?.label,
      week: listing.product.prices.find((p) => p.days === 7)?.label,
    },
    images: listing.product.images.map((img) => img?.fullSizeUrl),
  };
}

async function fetchFullListing(slug: string, country: Country) {
  const url = `${HYGGLO_BASE_URL}/product-listings/${slug}?${new URLSearchParams({ country })}`;
  const response = await fetch(url);
  return response.json();
}

export async function fetchRandomListingFromCategory(
  categoryId: number,
  country: Country,
) {
  const searchUrl = `${HYGGLO_BASE_URL}/product-listings/search`;

  const firstPage = await fetch(
    `${searchUrl}?${new URLSearchParams({ country, categoryIds: String(categoryId), pageSize: "24", pageIndex: "0" })}`,
  ).then((r) => r.json());

  const totalPages = firstPage.totalPages ?? 1;
  const randomPage = Math.floor(Math.random() * totalPages);

  const page: { productListings: HyggloListing[] } =
    randomPage === 0
      ? firstPage
      : await fetch(
          `${searchUrl}?${new URLSearchParams({ country, categoryIds: String(categoryId), pageSize: "24", pageIndex: String(randomPage) })}`,
        ).then((r) => r.json());

  const listings = page.productListings;
  if (!listings?.length) return null;

  return pickRandom(listings);
}

export async function fetchListing(): Promise<Listing | null> {
  const cateogry = pickRandom(CATEGORIES);
  const country = pickRandom(COUNTRIES);

  const randomListing = await fetchRandomListingFromCategory(
    cateogry.categoryId,
    country,
  );
  if (!randomListing) return null;

  const fullListing = await fetchFullListing(randomListing.slug, country);
  return parseHyggloListing(fullListing);
}

export async function getRandomUserId() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("profiles").select("user_id");
  if (error) throw error;
  return pickRandom(data);
}
