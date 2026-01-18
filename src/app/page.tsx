"use client";

import { useEffect, useState } from "react";
import { getListingsForHome } from "./action";
import { Listing } from "./globalTypes";
import Searchbar from "@/components/own/Searchbar";
import HomeListingCard from "@/components/own/HomeListingCard";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadListings() {
      try {
        setIsLoading(true);
        const data = await getListingsForHome();
        setListings(data);
      } catch (error) {
        console.error(
          `Error loading listings at "/": ${(error as Error).message}`,
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadListings();
  }, []);

  if (isLoading)
    return <p className="max-w-6xl mx-auto mb-15 max-xl:px-5">Loading...</p>;
  return (
    <section className="max-w-6xl mx-auto mb-15">
      <Searchbar />
      <ul className="grid mt-10 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {listings.map((listing) => (
          <HomeListingCard key={listing.listing_id} listing={listing} />
        ))}
      </ul>
    </section>
  );
}
