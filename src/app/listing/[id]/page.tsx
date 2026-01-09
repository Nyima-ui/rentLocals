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



async function preventDoubleBooking(
  listingId: string,
  renterId: string,
  ownerId: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select()
    .eq("listing_id", listingId)
    .eq("renter_id", renterId)
    .eq("owner_id", ownerId)
    .in("status", ["requested", "booked"])
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Error fetching existing bookings.`);
  return data;
}

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
    const endDate = new Date(formData.get("end-date") as string).toISOString();

    const existingBooking = await preventDoubleBooking(
      listing_id,
      renter_id,
      owner_id
    );

    if (existingBooking) {
      router.push(`/booking/${existingBooking.booking_id}`);
      return;
    }

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

    await notifyOwner(owner_id);

    if (error) {
      console.error(
        `Supabase error inserting booking details: ${error.message}`
      );
      return;
    }
    router.push(`/booking/${data.booking_id}`);
  } catch (error) {
    console.error(`Request booking failed: ${error}`);
  }
}

async function notifyOwner(ownerId: string) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: "ntenzin492@gmail.com",
      subject: "Hello, how are you 😉",
      html: "<h1>Good day</h1>",
    }),
  });
  const result = await response.json();
  if (response.ok) {
    console.log(result);
  } else {
    throw new Error(`Error sending email: ${result}`);
  }
}









const Listing = () => {
  const [listingData, setListingData] = useState<Listing | null>(null);
  const [listingPrices, setListingPrices] = useState<IncomingPrices | null>(
    null
  );
  const { id } = useParams();
  const supabase = createClient();

  useEffect(() => {


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
