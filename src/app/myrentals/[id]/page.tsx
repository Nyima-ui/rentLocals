"use client";
import { useEffect, useState } from "react";
import { getOwnersRentals } from "./hook";
import { useAuth } from "@/context/AuthContext";
import { RentalBooking } from "@/app/globalTypes";
import RentalCard from "./RentalCard";

const MyRentals = () => {
  const [rentals, setRentals] = useState<RentalBooking[]>([]);
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
        <p className="font-medium mt-5 text-lg">
          You do not have any listings rented yet.
        </p>
      ) : (
        <ul className="flex gap-5 mt-10 flex-wrap">
          {rentals.map((rental) => (
            <RentalCard key={rental.booking_id} rental={rental} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRentals;
// grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5