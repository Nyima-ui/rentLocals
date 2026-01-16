import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { capitalaize } from "@/lib/utils";
import { RenterBookingInfoProps } from "./types";
import BookingSummary from "./BookingSummary";
import PickupAddress from "./PickupAddress";
import {
  cancelRequest,
  confirmPickUp,
  insertPickedUpMessage,
  insertCancelledMessage,
} from "./hooks";
import { useState } from "react";

export function RenterBookingInfo({
  booking,
  address,
}: RenterBookingInfoProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handlePickUp(bookingId: string): Promise<void> {
    try {
      setIsLoading(true);
      await confirmPickUp(bookingId);
      await insertPickedUpMessage({
        sender_id: booking.renter_id,
        receiver_id: booking.owner_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        type: "system",
        system_action: "in_use",
      });
    } catch (err) {
      console.error(`Error confirming pick up: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelRequest(bookingId: string): Promise<void> {
    try {
      setIsLoading(true);
      await cancelRequest(bookingId);
      await insertCancelledMessage({
        sender_id: booking.renter_id,
        receiver_id: booking.owner_id,
        listing_id: booking.listing_id,
        booking_id: booking.booking_id,
        type: "system",
        system_action: "cancelled",
      });
    } catch (err) {
      console.error(`Error cancelling your request: ${err}`);
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
        <CardTitle className="text-2xl mt-2">
          <Link
            href={`/listing/${booking.listing_id}`}
            className="leading-tight"
          >
            {booking.listings.title}
          </Link>
        </CardTitle>
        {/* pick up address  */}
        {(booking.status === "booked" || booking.status === "in_use") && (
          <>
            <CardDescription className="text-black text-base mt-3 border-b-2 border-red-300 font-medium pb-1">
              <span className="cursor-pointer text-sky-500">
                {booking.owner.first_name}
              </span>{" "}
              accepted your request to rent{" "}
              <span className="text-blue-500">{booking.listings.title}</span>
            </CardDescription>
            <CardDescription className="text-black text-base mt-2">
              Below is the pick up location.
            </CardDescription>
          </>
        )}
        {booking.status === "requested" && (
          <CardDescription>
            <p className="text-[15px] text-black mt-3">
              Your request to rent{" "}
              <span className="text-blue-600">{booking.listings.title}</span>{" "}
              has been sent to{" "}
              <span className="cursor-pointer underline">
                {booking.owner.first_name}
              </span>
            </p>
          </CardDescription>
        )}
        {booking.status === "returned" && (
          <CardDescription className="font-medium text-base text-black mt-2 border-b-2 border-red-300">
            You have returned your rental.
          </CardDescription>
        )}
        {booking.status === "declined" && (
          <CardDescription className="font-medium text-base text-black mt-2 border-b-2 border-red-300">
            <span>{booking.owner.first_name} declined your request.</span>
          </CardDescription>
        )}
        {booking.status === "cancelled" && (
          <CardDescription className="font-medium text-base text-black mt-2 border-b-2 border-red-300">
            You have cancelled your request.
          </CardDescription>
        )}
        <PickupAddress address={address} />
        <div className="flex items-center gap-2 mt-7">
          <Avatar className="size-13! rounded-full overflow-hidden">
            <AvatarImage src={booking.owner.avatar} className="object-cover" />
          </Avatar>
          <CardDescription className="text-black text-lg">
            {booking.owner.first_name} {booking.owner.last_name}
          </CardDescription>
        </div>
        {/* rental period */}
        <BookingSummary booking={booking} />
      </CardContent>
      <CardFooter className="mt-5">
        <CardAction className="mx-auto">
          {booking.status === "booked" && (
            <Button
              className="px-3 py-5 cursor-pointer mr-5"
              onClick={() => handlePickUp(booking.booking_id)}
              disabled={isLoading}
            >
              {isLoading ? "Confirming..." : "Picked up"}
            </Button>
          )}
          {(booking.status === "requested" || booking.status === "booked") && (
            <Button
              variant="outline"
              className="px-3 py-5 cursor-pointer"
              disabled={isLoading}
              onClick={() => handleCancelRequest(booking.booking_id)}
            >
              {isLoading ? "Cancelling request..." : "Cancel Request"}
            </Button>
          )}
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export default RenterBookingInfo;
