"use client";
import { SearchBox } from "@/app/page";
import { useState, useEffect } from "react";
import { Listing as ListingType, IncomingPrices } from "./types";
import ListingImage from "./ListingImage";
import ListingInfo from "./ListingInfo";
import OwnerInfo from "./OwnerInfo";
import { getListing, getPrices } from "./hooks";
import { useParams } from "next/navigation";

const Listing = () => {
  const [listing, setListing] = useState<ListingType | null>(null);
  const [prices, setPrices] = useState<IncomingPrices | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getListing(id as string).then(setListing);
    getPrices(id as string).then(setPrices);
  }, [id]);

  if (!listing)
    return (
      <p className="max-w-6xl mx-auto my-10 max-xl:px-5 text-2xl">Loading...</p>
    );

  return (
    <section>
      <SearchBox />
      <section className="max-w-6xl mx-auto my-10  max-xl:px-5">
        <div className="flex gap-5 max-md:flex-col justify-between">
          <ListingImage listing={listing} />
          <ListingInfo listing={listing} prices={prices} />
        </div>
        <OwnerInfo listing={listing} />
      </section>
    </section>
  );
};

export default Listing;
