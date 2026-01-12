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
import { getPickupLocation } from "./actions";
import { createClient } from "@/lib/supabase/client";

const Booking = () => {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<IncomingBooking | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    getBookingDetails(id).then(setBooking);
  }, [id]);

  useEffect(() => {
    if (!booking) return;
    if (booking.status !== "booked") return;
    getPickupLocation(booking.listing_id).then(setAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.status, booking?.listing_id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel("booking-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `booking_id=eq.${id}`,
        },
        () => {
          getBookingDetails(id).then(setBooking);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  function updateBookingStatus(newStatus: IncomingBooking["status"]) {
    if (!booking) return;
    setBooking({ ...booking, status: newStatus });
  }

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
        {role === "renter" && (
          <RenterBookingInfo booking={booking} address={address} />
        )}
        {role === "owner" && (
          <OwnerBookingInfo
            booking={booking}
            address={address}
            setAddress={setAddress}
            updateBookingStatus={updateBookingStatus}
          />
        )}
        <Chat booking={booking} />
      </div>
    </section>
  );
};

export default Booking;
