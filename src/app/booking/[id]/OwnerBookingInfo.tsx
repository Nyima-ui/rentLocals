"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { IncomingBooking, OwnerBookingInfoProps } from "./types";
import { capitalaize } from "@/lib/utils";
import BookingSummary from "./BookingSummary";
import { approveRequest } from "./actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PickupAddress from "./PickupAddress";

export function OwnerBookingInfo({
  booking,
  address,
  setAddress,
  updateBookingStatus,
}: OwnerBookingInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  // console.log(booking);
  async function handleApprove() {
    setIsLoading(true);
    try {
      const address = await approveRequest({
        id: booking.booking_id,
        listingId: booking.listing_id,
        title: booking.listings.title,
        start: booking.start_date,
        end: booking.end_date,
        pricePerDay: booking.price_per_day,
      });
      updateBookingStatus("booked");
      if (address) {
        setAddress(address);
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      //optionally show error toast/notification here
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-transparent shadow-none min-w-1/2 gap-0">
      <CardHeader>
        <CardTitle>
          Bookign ID:{" "}
          <span className="font-normal text-sm">{booking.booking_id}</span>
        </CardTitle>
        <CardDescription className="font-medium text-base">
          Status: {capitalaize(booking.status)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl mt-5">
          <Link
            href={`/listing/${booking.listing_id}`}
            className="leading-tight"
          >
            {booking.listings.title}
          </Link>
        </CardTitle>
        <div className="border-b-2 border-red-300 pb-1.5 mt-3 max-w-sm">
          {booking.status === "requested" && (
            <p>
              <Link href="#" className="text-blue-600">
                {booking.renter.first_name} {booking.renter.last_name}
              </Link>{" "}
              has requested to rent your listing.
            </p>
          )}
          {(booking.status === "booked" || booking.status === "in_use") && (
            <p>
              You accepted{" "}
              <Link href="#" className="text-blue-600">
                {booking.renter.first_name} {booking.renter.last_name}
              </Link>{" "}
              requests to rent your listing.
            </p>
          )}
        </div>
        <PickupAddress address={address} />
        <div className="flex items-center gap-2 mt-6">
          <Avatar>
            <AvatarImage
              src={booking.renter.avatar}
              className="size-12 rounded-[100px]"
            />
          </Avatar>
          <CardDescription className="text-black text-[17px]">
            {booking.renter.first_name} {booking.renter.last_name}
          </CardDescription>
        </div>
        <BookingSummary booking={booking} />
      </CardContent>
      <CardFooter className="mt-5">
        <CardAction className="mx-auto">
          {booking.status === "requested" && (
            <Button className="cursor-pointer py-6" onClick={handleApprove}>
              {isLoading ? "Approving" : "Approve Request"}
            </Button>
          )}
          {booking.status === "booked" && (
            <Button variant={"outline"} className="px-3 py-5 cursor-pointer">
              Decline request
            </Button>
          )}
          {booking.status === "in_use" && (
            <Button className="px-3 py-5 cursor-pointer">Item returned</Button>
          )}
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export default OwnerBookingInfo;
