"use client";
import Image from "next/image";
import { useState } from "react";
import { Listing } from "./types";

export function ListingImage({ listing }: { listing: Listing }) {
  const [image, setImage] = useState(listing?.images[0]);

  return (
    <div className="w-[60%] max-md:w-full">
      <div className="bg-gray-400 h-100 w-full relative overflow-hidden rounded-md">
        <Image
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, 60vw"
          alt={listing?.title}
          src={image}
          className="object-cover hover:scale-102 transition-all duration-100 ease-in"
        />
      </div>
      <ul className="flex mt-2 gap-2 justify-end">
        {listing.images.map((img, idx) => (
          <li
            key={idx}
            className="size-12.5 relative cursor-pointer rounded-md"
          >
            <Image
              fill
              src={img}
              loading="eager"
              alt="thumbnail"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              onClick={() => setImage(img)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ListingImage;
