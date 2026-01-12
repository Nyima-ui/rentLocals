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

export function RenterBookingInfo({
  booking,
  address,
}: RenterBookingInfoProps) {
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
        {booking.status === "booked" && (
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
              <span className="cursor-pointer underline">{booking.owner.first_name}</span>
            </p>
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
          <Button variant="outline" className="cursor-pointer py-6">
            Cancel Request
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export default RenterBookingInfo;
