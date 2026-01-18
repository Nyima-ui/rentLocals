"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { capitalaize } from "@/lib/utils";
import { RentalBooking } from "@/app/globalTypes";

const IncomingBookingsCard = ({ booking }: { booking: RentalBooking }) => {
  return (
    <li className="max-w-55">
      <Link href={`/booking/${booking.booking_id}`}>
        <Card className="p-0 overflow-hidden gap-2 pb-3 relative">
          <CardHeader className="p-0">
            <div className="bg-gray-400 h-43.75 relative">
              <Image
                src={booking.listing.images[0]}
                alt={"change later"}
                fill
                sizes="30"
                loading="eager"
              />
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <p className="truncate w-full">{booking.listing.title}</p>
            <p className="font-semibold mt-2 text-lg">
              ${booking.price.price_day}/day
            </p>
          </CardContent>
          <CardFooter className="px-2 flex-col gap-3 mt-3">
            <div className="flex w-full gap-3">
              <Button className="grow cursor-pointer">
                View booking
              </Button>
            </div>
          </CardFooter>
          <span className="absolute text-white bg-accent right-2 top-2 p-1 rounded-md">
            {capitalaize(booking.status)}
          </span>
        </Card>
      </Link>
    </li>
  );
};

export default IncomingBookingsCard;
