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
import { useEffect, useState } from "react";
import { getRenterBookings } from "./hooks";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { GetRenterBookingsProps } from "./types";
import { capitalaize } from "@/lib/utils";

export function CurrentBookingsCard({
  booking,
}: {
  booking: GetRenterBookingsProps;
}) {
  return (
    <li className="max-w-55">
      <Link href={`/booking/${booking.booking_id}`}>
        <Card className="p-0 overflow-hidden gap-2 pb-3 relative">
          <CardHeader className="p-0 ">
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
          <CardFooter className="px-2 flex-col gap-3">
            <div className="flex w-full gap-3">
              <Button className="grow bg-sky-500 hover:bg-sky-600 cursor-pointer">View booking</Button>
            </div>
          </CardFooter>
          <span className="absolute text-white bg-gray-500 right-2 top-2 p-1 rounded-md">
            {capitalaize(booking.status)}
          </span>
        </Card>
      </Link>
    </li>
  );
}

const MyBookings = () => {
  const [currentBookings, setCurrentBookings] = useState<
    GetRenterBookingsProps[]
  >([]);
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user.id;
    async function load() {
      try {
        const currentBookings = await getRenterBookings(userId);
        setCurrentBookings(currentBookings);
        console.log(currentBookings);
      } catch (error) {
        console.error("Failed to fetch renter bookings:", error);
      }
    }
    load();
  }, [user, router]);
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <h1 className="text-3xl">Your current bookings</h1>
      <ul className="grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {currentBookings.map((booking, idx) => (
          <CurrentBookingsCard key={idx} booking={booking} />
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;
