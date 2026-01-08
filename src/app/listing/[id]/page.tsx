"use client";
import { SearchBox } from "@/app/page";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

interface ListingSectionProps {
  listing: Listing;
  prices?: IncomingPrices | null;
}

export function ListingImage({ listing }: ListingSectionProps) {
  const [imageDisplayed, setImageDisplayed] = useState<string>(
    listing?.images[0]
  );
  const { images } = listing;
  return (
    <div className="w-[60%] max-md:w-full">
      <div className="bg-gray-400 h-100 w-full relative">
        <Image
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, 60vw"
          alt={listing?.title}
          src={imageDisplayed}
          className="object-cover"
        />
      </div>
      <ul className="flex mt-2 gap-2 justify-end">
        {images.map((img, idx) => (
          <li key={idx} className="size-12.5 relative">
            <Image
              fill
              src={img}
              loading="eager"
              alt="thumbnail"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              onClick={() => setImageDisplayed(img)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Booking {
  listing_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: "requested" | "booked" | "declined" | "cancelled";
  price_per_day: number;
  total_price: number;
}

export function ListingInfo({ listing, prices }: ListingSectionProps) {
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  const isOwnerOfTheListing = listing.user_id === user?.id;

  function calculateTotalPrice(
    startDate: string,
    endDate: string,
    pricePerDay: number
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const days = diffMs / MS_PER_DAY + 1;

    return days * pricePerDay;
  }

  async function requestBooking(e: React.FormEvent<HTMLFormElement>) {
    try {
      if (!user) throw new Error("User not authenticated");
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      //below two dates are calculating the prices
      const startDateStr = formData.get("start-date") as string;
      const endDateStr = formData.get("end-date") as string;
      const listing_id = listing.listing_id;
      const owner_id = listing.user_id;
      const renter_id = user.id;
      const status = "requested";
      const price_per_day = prices?.price_day || 0;
      const total_price = calculateTotalPrice(
        startDateStr,
        endDateStr,
        price_per_day
      );
      //below two dates are what we are storing in db
      const startDate = new Date(
        formData.get("start-date") as string
      ).toISOString();
      const endDate = new Date(
        formData.get("end-date") as string
      ).toISOString();

      const bookingDetails: Booking = {
        listing_id,
        owner_id,
        renter_id,
        start_date: startDate,
        end_date: endDate,
        status,
        price_per_day,
        total_price,
      };
      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingDetails)
        .select()
        .single();

      if (error) {
        console.log(
          `Supabase error inserting booking details: ${error.message}`
        );
        return;
      }
      router.push(`/booking/${data.booking_id}`);
    } catch (error) {
      console.error(`Request booking failed: ${error}`);
    }
  }
  return (
    <div className="grow space-y-3 w-1/2 max-md:w-full">
      <h1 className="text-4xl font-medium leading-tighter">{listing?.title}</h1>
      <form onSubmit={requestBooking}>
        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="start-date" className="text-nowrap">
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
            <FieldLabel htmlFor="end-date" className="text-nowrap">
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
          <FieldTitle className="text-2xl">{`$${prices?.price_day}`}</FieldTitle>
          <FieldDescription className="text-gray-500">
            Price for 1 day
          </FieldDescription>
        </div>
        <Button
          className="mt-5 cursor-pointer"
          type="submit"
          disabled={isOwnerOfTheListing}
        >
          Request Booking
        </Button>
      </form>
      <div className="mt-10">
        <p className="text-lg">Price for all periods</p>
        <div className="flex gap-5 mt-3">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">{`$${prices?.price_day}`}</p>
            <p className="text-gray-500">/day</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_week ? `$${prices.price_week}` : `Not set`}
            </p>
            <p className="text-gray-500">/week</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">
              {prices?.price_month ? `$${prices.price_month}` : `Not set`}
            </p>
            <p className="text-gray-500">/month</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserData {
  avatar: string;
  first_name: string;
  last_name: string;
}

export function OwnerInfo({ listing }: ListingSectionProps) {
  const [ownerData, setOwnerData] = useState<UserData | null>(null);
  const ownerId = listing.user_id;
  const supabase = createClient();

  useEffect(() => {
    async function fetchOwner() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar, first_name, last_name")
        .eq("user_id", ownerId)
        .single();

      if (error) {
        console.error(`Error fetching owner data: ${error.message}`);
        return;
      }
      setOwnerData(data);
    }
    fetchOwner();
  }, [ownerId, supabase]);

  const ownerName = ownerData
    ? `${ownerData?.first_name ?? ""} ${ownerData?.last_name ?? ""}`
    : "Unknown";

  return (
    <Card className="flex flex-row items-start max-lg:flex-col mt-10 justify-between bg-transparent border-none shadow-none">
      <div className="flex items-start max-md:flex-col max-md:gap-5">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={ownerData?.avatar}
              alt="@shadcn"
              className="size-15 rounded-[100px] object-cover"
            />
          </Avatar>
          <CardContent>
            <CardTitle className="text-lg">Owned by {ownerName}</CardTitle>
            <CardAction className="mt-3">
              <Button>Message</Button>
            </CardAction>
          </CardContent>
        </div>
        <div className="">
          <p className="mb-3 font-medium">Approximate location:</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472086.7749927582!2d-80.61774836557551!3d43.893756423188556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2a1d7471156d%3A0x4ecad8e272e4c2a2!2sGreater%20Toronto%20Area%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sin!4v1767149734066!5m2!1sen!2sin"
            width="400"
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <p className="max-w-md max-xl:max-w-sm">
        <span className="text-base block font-semibold">About the item:</span>
        {listing?.description}
      </p>
    </Card>
  );
}

interface Listing {
  category: string[];
  created_at: string;
  description: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  listing_id: string;
  pickup_location: string;
  title: string;
  updated_at: string;
  user_id: string;
}
interface IncomingPrices {
  listing_id: string;
  price_day: number;
  price_week: number | null;
  price_month: number | null;
}

const Listing = () => {
  const [listingData, setListingData] = useState<Listing | null>(null);
  const [listingPrices, setListingPrices] = useState<IncomingPrices | null>(
    null
  );
  const { id } = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function fetchListing() {
      const { data, error } = await supabase
        .from("listings")
        .select()
        .eq("listing_id", id)
        .single();

      if (error) {
        console.error(`Error fetching a listing: ${error.message}`);
        return;
      }

      if (data) setListingData(data);
    }
    fetchListing();

    async function fetchPrices() {
      const { data, error: fetchPriceError } = await supabase
        .from("prices")
        .select()
        .eq("listing_id", id)
        .single();

      if (fetchPriceError) {
        console.error(
          `Error fetching price of a listing: ${fetchPriceError.message}`
        );
        return;
      }
      if (data) setListingPrices(data);
    }
    fetchPrices();
  }, [id, supabase]);

  if (!listingData)
    return (
      <p className="max-w-6xl mx-auto my-10 max-xl:px-5 text-2xl">Loading...</p>
    );

  return (
    <section>
      <SearchBox />
      <section className="max-w-6xl mx-auto my-10  max-xl:px-5">
        <div className="flex gap-5 max-md:flex-col justify-between">
          <ListingImage listing={listingData} />
          <ListingInfo listing={listingData} prices={listingPrices} />
        </div>
        <OwnerInfo listing={listingData} />
      </section>
    </section>
  );
};

export default Listing;
