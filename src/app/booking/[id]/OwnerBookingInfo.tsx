"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { OwnerBookingInfoProps } from "./types";
import { capitalaize } from "@/lib/utils";
import BookingSummary from "./BookingSummary";
import { approveRequest } from "./actions";
import { useState } from "react";
import PickupAddress from "./PickupAddress";
import {
  declineRequest,
  insertApprovedMessage,
  insertDeclineMessage,
  insertReturnedMessage,
} from "./hooks";
import { confirmReturned } from "./hooks";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  CardHeader,
} from "@/components/ui/card";

export function OwnerBookingInfo({
  booking,
  address,
  setAddress,
  updateBookingStatus,
}: OwnerBookingInfoProps) {
  const [isLoading, setIsLoading] = useState(false);

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
      await insertApprovedMessage({
        sender_id: booking.renter_id,
        receiver_id: booking.owner_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        type: "system",
        system_action: "booked",
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

  async function handleConfirmReturned(bookingId: string): Promise<void> {
    try {
      setIsLoading(true);
      await confirmReturned(bookingId);
      await insertReturnedMessage({
        sender_id: booking.owner_id,
        receiver_id: booking.renter_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        type: "system",
        system_action: "returned",
      });
    } catch (error) {
      console.error(`Error cofirming return: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDecline(bookingId: string): Promise<void> {
    try {
      setIsLoading(true);
      await declineRequest(bookingId);
      await insertDeclineMessage({
        sender_id: booking.owner_id,
        receiver_id: booking.renter_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        type: "system",
        system_action: "declined",
      });
    } catch (err) {
      console.error(`Error declining request to rent: ${err}`);
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
        <div className="border-b-2 border-red-300 pb-1.5 mt-3 max-w-md">
          {booking.status === "requested" && (
            <p>
              <Link href="#" className="text-blue-600">
                {booking.renter.first_name} {booking.renter.last_name}
              </Link>{" "}
              has requested to rent your listing.
            </p>
          )}
          {(booking.status === "booked" || booking.status === "in_use") && (
            <p className="font-medium">
              You accepted{" "}
              <Link href="#" className="text-blue-600">
                {booking.renter.first_name} {booking.renter.last_name}
              </Link>{" "}
              requests to rent your listing.
            </p>
          )}
          {booking.status === "returned" && (
            <p className="font-medium">You listing has been returned to you.</p>
          )}
          {booking.status === "declined" && (
            <p className="font-medium">
              You declined <span>{booking.renter.first_name}&apos;s</span>{" "}
              request.
            </p>
          )}
          {booking.status === "cancelled" && (
            <p className="font-medium">
              <span>{booking.renter.first_name}</span> has cancelled the
              request.
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
          {(booking.status === "booked" || booking.status === "requested") && (
            <Button
              variant={"outline"}
              className="cursor-pointer py-6 mr-5"
              disabled={isLoading}
              onClick={() => handleDecline(booking.booking_id)}
            >
              {isLoading ? "Declining..." : "Decline request"}
            </Button>
          )}
          {booking.status === "requested" && (
            <Button className="cursor-pointer py-6" onClick={handleApprove}>
              {isLoading ? "Approving" : "Approve Request"}
            </Button>
          )}
          {booking.status === "in_use" && (
            <Button
              className="px-3 py-5 cursor-pointer"
              disabled={isLoading}
              onClick={() => {
                handleConfirmReturned(booking.booking_id);
              }}
            >
              {isLoading ? "Confirming..." : "Item returned"}
            </Button>
          )}
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export default OwnerBookingInfo;
