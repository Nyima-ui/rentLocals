import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field";
import { Listing, IncomingPrices } from "./types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { requestBookingAction } from "./actions";
import { useEffect, useState } from "react";
import { checkIfBookedByTheSameRenter } from "./hooks";

export function ListingInfo({
  listing,
  prices,
}: {
  listing: Listing;
  prices: IncomingPrices | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [listingStatus, setListingStatus] = useState<
    "requested" | "booked" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const isOwnerOfTheListing = listing.user_id === user?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !prices) return;
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);

      const result = await requestBookingAction({
        listingId: listing.listing_id,
        ownerId: listing.user_id,
        renterId: user.id,
        start: formData.get("start-date") as string,
        end: formData.get("end-date") as string,
        pricePerDay: prices.price_day,
      });

      router.push(`/booking/${result.bookingId}`);
    } catch (err) {
      console.error(`Error requesting a rental: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function checkIsBookedOrRequested() {
      if (!user?.id) return;

      const isBookedOrRequested = await checkIfBookedByTheSameRenter({
        renterId: user?.id,
        ownerId: listing.user_id,
        listingId: listing.listing_id,
      });
      setListingStatus(isBookedOrRequested);
    }
    checkIsBookedOrRequested();
  }, [listing.listing_id, user?.id, listing.user_id]);

  return (
    <div className="grow space-y-3 w-1/2 max-md:w-full">
      <h1 className="text-4xl font-medium leading-tighter">{listing?.title}</h1>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="flex-row mt-4">
          <Field>
            <FieldLabel htmlFor="start-date" className="text-nowrap text-base">
              Start date:
            </FieldLabel>
            <Input
              type="date"
              id="start-date"
              name="start-date"
              required
              className="max-w-50 cursor-pointer"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="end-date" className="text-nowrap text-base">
              End date:
            </FieldLabel>
            <Input
              type="date"
              id="end-date"
              name="end-date"
              required
              className="max-w-50 cursor-pointer"
            />
          </Field>
        </FieldGroup>
        <div className="mt-10">
          <FieldTitle className="text-3xl">{`$${prices?.price_day}`}</FieldTitle>
          <FieldDescription>Price for 1 day</FieldDescription>
        </div>
        {!user && (
          <Button
            className="mt-5 cursor-pointer"
            onClick={() => router.push("/sign-up")}
          >
            Sign up to book
          </Button>
        )}
        {user && !listingStatus && (
          <Button
            className="mt-5 cursor-pointer"
            type="submit"
            disabled={isOwnerOfTheListing || isLoading}
          >
            {isLoading ? "Requesting..." : "Request Booking"}
          </Button>
        )}
        {isOwnerOfTheListing && (
          <p className="text-white mt-2 text-sm">
            Owners cannot book their own listing.
          </p>
        )}
        {listingStatus === "requested" && (
          <Button className="mt-5 cursor-pointer" type="submit" disabled={true}>
            Requested
          </Button>
        )}
        {listingStatus === "booked" && (
          <Button className="mt-5 cursor-pointer" type="submit" disabled={true}>
            Booked
          </Button>
        )}
      </form>
      <div className="mt-10">
        <p className="text-lg">Price for all periods</p>
        <div className="flex gap-5 mt-3">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">{`$${prices?.price_day}`}</p>
            <p className="opacity-80">/day</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_week ? `$${prices.price_week}` : `Not set`}
            </p>
            <p className="opacity-80">/week</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_month ? `$${prices.price_month}` : `Not set`}
            </p>
            <p className="opacity-80">/month</p>
          </div>
        </div>
      </div>
      <p className="max-w-md max-xl:max-w-sm mt-8">
        <span className="text-base block font-semibold">About the item:</span>
        {listing?.description}
      </p>
    </div>
  );
}

export default ListingInfo;
