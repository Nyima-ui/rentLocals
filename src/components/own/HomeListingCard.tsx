import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Listing } from "@/app/globalTypes";

interface ListingCardProps {
  listing: Listing;
}
const HomeListingCard = ({ listing }: ListingCardProps) => {
  return (
    <li>
      <Link href={`/listing/${listing.listing_id}`}>
        <Card className="p-0 overflow-hidden gap-2 pb-3">
          <CardHeader className="p-0 ">
            <div className="bg-gray-400 h-43.75 relative">
              <Image
                src={listing?.images?.[0] || ""}
                alt={listing?.title}
                fill
                loading="eager"
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CardFooter className="flex flex-col items-start px-1.5">
              <p className="truncate w-full">{listing.title}</p>
              <p className="font-medium">{`$${listing.prices.price_day}/day`}</p>
            </CardFooter>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
};

export default HomeListingCard;
