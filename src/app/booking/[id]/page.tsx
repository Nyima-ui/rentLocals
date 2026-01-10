"use client";
import Chat from "./Chat";
import { SearchBox } from "../../page";
import { IncomingBooking } from "./types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookingDetails } from "./hooks";
import OwnerBookingInfo from "./OwnerBookingInfo";
import RenterBookingInfo from "./RenterBookinInfo";
import { useAuth } from "@/context/AuthContext";

const Booking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<IncomingBooking | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id && typeof id === "string") {
      getBookingDetails(id).then(setBooking);
    }
  }, [id]);

  useEffect(() => {
    console.log(booking);
  }, [booking]);

  if (!booking) {
    return (
      <p className="max-w-6xl mx-auto max-xl:px-5 my-10 text-2xl">Loading...</p>
    );
  }

  const role =
    user?.id === booking.owner_id
      ? "owner"
      : user?.id === booking.renter_id
      ? "renter"
      : null;
  return (
    <section className="max-w-6xl mx-auto max-xl:px-5 mb-15">
      <SearchBox />
      <div className="mt-17 flex justify-between max-md:flex-col gap-5">
        {role === "renter" && <RenterBookingInfo booking={booking} />}
        {role === "owner" && <OwnerBookingInfo booking={booking} />}
        <Chat booking={booking} />
      </div>
    </section>
  );
};

export default Booking;
