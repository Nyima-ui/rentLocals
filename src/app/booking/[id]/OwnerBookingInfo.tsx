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
import { IncomingBooking } from "./types";
import { capitalaize } from "@/lib/utils";
import BookingSummary from "./BookingSummary";
import { approveRequest } from "./hooks";

export function OwnerBookingInfo({ booking }: { booking: IncomingBooking }) {
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
        <div className="border-b-2 border-red-300 pb-1.5 mt-3 max-w-xs">
          <p>
            <Link href="#" className="text-blue-600">
              {booking.renter.first_name} {booking.renter.last_name}
            </Link>{" "}
            has requested to rent your listing.
          </p>
        </div>
        <div className="max-w-xs border-b-2 pb-1.5 mt-2">
          <p className="text-base text-gray-700 leading-tight">
            Pickup address will be shown after approval.
          </p>
        </div>
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
          <Button
            className="cursor-pointer py-6"
            onClick={() => approveRequest(booking.booking_id)}
          >
            Approve Request
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export default OwnerBookingInfo;
