"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MyListingCard } from "./MyListingCard";
import { IncomingListing } from "./types";
import { deleteListing, getListings } from "./action";

const Listings = () => {
  const [listings, setListings] = useState<IncomingListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserListings() {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await getListings(user?.id);
        setListings(data);
      } catch (err) {
        console.error(`Error fetching listings: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserListings();
  }, [user]);

  async function handleDeleteListing(listingId: string) {
    await deleteListing(listingId);
    setListings((prev) =>
      prev.filter((listing) => listing.listing_id !== listingId)
    );
  }

  if (isLoading) return <p className="max-w-6xl mx-auto mt-5 max-xl:px-5 text-2xl">Loading...</p>;
  if (listings.length === 0)
    return (
      <div className="max-w-6xl mx-auto mb-15 max-xl:px-5">
        <h1 className="text-lg mt-7">No listings yet</h1>
        <Button asChild className="mt-3">
          <Link href="/create-listing">Create listing</Link>
        </Button>
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto  mb-15">
      <h1 className="text-3xl max-xl:px-5">Your listings</h1>
      <ul className="flex gap-5 mt-10 flex-wrap">
        {listings.map((item) => (
          <MyListingCard
            key={item.listing_id}
            listing={item}
            onDelete={handleDeleteListing}
          />
        ))}
      </ul>
    </section>
  );
};

export default Listings;
// grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5