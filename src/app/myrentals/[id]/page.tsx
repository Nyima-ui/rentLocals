"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOwnersRentals } from "./hook";
import { useAuth } from "@/context/AuthContext";
import { GetOwnerRentalsProps } from "./types";
import { capitalaize } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function CurrentRentalCard({
  rental,
}: {
  rental: GetOwnerRentalsProps;
}) {
  return (
    <li className="max-w-55">
      <Link href={`/booking/${rental.booking_id}`}>
        <Card className="p-0 overflow-hidden gap-2 pb-3 relative">
          <CardHeader className="p-0 ">
            <div className="bg-gray-400 h-43.75 relative">
              <Image
                src={rental.listing.images[0]}
                alt={"change later"}
                fill
                sizes="30"
                loading="eager"
              />
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <p className="truncate w-full">{rental.listing.title}</p>
            <p className="font-semibold mt-2 text-lg">
              ${rental.price.price_day}/day
            </p>
          </CardContent>
          <CardFooter className="px-2 flex-col gap-3">
            <div className="flex w-full gap-3">
              <Button className="grow bg-sky-500 hover:bg-sky-600 cursor-pointer">
                View booking
              </Button>
            </div>
          </CardFooter>
          <span className="absolute text-white bg-gray-500 right-2 top-2 p-1 rounded-md">
            {capitalaize(rental.status)}
          </span>
        </Card>
      </Link>
    </li>
  );
}

const MyRentals = () => {
  const [rentals, setRentals] = useState<GetOwnerRentalsProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function load() {
      try {
        setLoading(true);
        const rentals = await getOwnersRentals(userId);
        setRentals(rentals);
      } catch (error) {
        console.error("Failed to fetch renter bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <h1 className="text-3xl">Your current rentals</h1>

      {loading ? (
        <p className="text-lg mt-5">Loading...</p>
      ) : rentals.length === 0 ? (
        <p className="text-gray-800 font-medium mt-5 text-lg">
          You do not have any listings rented yet.
        </p>
      ) : (
        <ul className="grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
          {rentals.map((rental, idx) => (
            <CurrentRentalCard key={idx} rental={rental} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRentals;
