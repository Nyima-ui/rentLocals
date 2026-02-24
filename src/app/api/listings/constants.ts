export const HYGGLO_BASE_URL = "https://api.hygglo.com/api/v2";

export type Country = "GB" | "US" | "CA";

export const COUNTRIES: Country[] = ["GB", "US", "CA"];

export const CATEGORIES = [
  { name: "tablets", categoryId: 2983 },
  { name: "guitar", categoryId: 3951 },
  { name: "laptops", categoryId: 2911 },
  { name: "generator", categoryId: 2215 },
  { name: "phone", categoryId: 2981 },
  { name: "projector screen", categoryId: 8984 },
  { name: "party lights", categoryId: 3312 },
  { name: "drone", categoryId: 297 },
  { name: "memory card", categoryId: 9033 },
  { name: "garden machinery", categoryId: 221 },
];

export interface HyggloPrice {
  days: number;
  label: string;
}

export interface HyggloListing {
  slug: string;
  product: {
    name: string;
    description: string;
    category: { name: string };
    prices: HyggloPrice[];
    images: { fullSizeUrl: string }[];
  };
  location: {
    street?: string;
    label: string;
  };
}
export interface ListingPrices {
  day?: string;
  week?: string;
}

export interface Listing {
  title: string;
  description: string;
  category: string;
  pickup_location: string;
  prices: ListingPrices;
  images: string[];
}
