"use client";
import { useEffect, useState } from "react";
import { getRenterSideBookings } from "./action";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { RentalBooking } from "./types";
import IncomingBookingsCard from "./IncomingBookings";

const MyBookings = () => {
  const [myBookings, setMyBookings] = useState<RentalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user.id;
    async function load() {
      try {
        setIsLoading(true);
        const myBookings = await getRenterSideBookings(userId);
        setMyBookings(myBookings);
      } catch (error) {
        console.error("Failed to fetch renter bookings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user, router]);
  return (
    <div className="max-w-6xl mx-auto max-xl:px-5">
      <h1 className="text-3xl">Your current bookings</h1>
      {isLoading ? (
        <p className="mt-3 text-lg font-medium">Loading...</p>
      ) : myBookings.length === 0 ? (
        <p className="text-lg mt-4 font-medium">
          You have not rented any items yet.
        </p>
      ) : (
        <ul className="grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
          {myBookings.map((booking) => (
            <IncomingBookingsCard key={booking.booking_id} booking={booking} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
