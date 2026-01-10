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
import { IncomingBooking } from "./types";
import BookingSummary from "./BookingSummary";

export function RenterBookingInfo({ booking }: { booking: IncomingBooking }) {
  return (
    <Card className="bg-transparent shadow-none min-w-1/2">
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
        <div className="max-w-xs border-b-2 pb-1.5">
          <p className="text-base text-gray-700 leading-tight">
            Pickup address will be shown after approval.
          </p>
        </div>
        <CardTitle className="text-2xl mt-5">
          <Link
            href={`/listing/${booking.listing_id}`}
            className="leading-tight"
          >
            {booking.listings.title}
          </Link>
        </CardTitle>
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
      <CardFooter>
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
