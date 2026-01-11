"use server";
import { createClient } from "@/lib/supabase/server";
import { calculateTotalPrice, preventDoubleBooking } from "./booking";
import { notify } from "../../notifications";
import { SupabaseClient } from "@supabase/supabase-js";
import { bookingRequestEmail } from "@/app/emails/bookinRequest";
import { RequestBookingActionProps } from "./types";

async function getBookingDetails(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `renter:profiles!bookings_renter_id_fkey1 (first_name, last_name), listing:listings!bookings_listing_id_fkey (title)`
    )
    .eq("booking_id", id)
    .single();

  if (error) throw error;

  const bookingDetails = {
    renter: Array.isArray(data.renter) ? data.renter[0] : data.renter,
    listing: Array.isArray(data.listing) ? data.listing[0] : data.listing,
  };
  return bookingDetails;
}

export async function requestBookingAction({
  listingId,
  ownerId,
  renterId,
  start,
  end,
  pricePerDay,
}: RequestBookingActionProps) {
  const supabase = await createClient();
  const existingBooking = await preventDoubleBooking(
    supabase,
    listingId,
    renterId,
    ownerId
  );

  if (existingBooking) {
    return { bookingId: existingBooking.booking_id };
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      listing_id: listingId,
      owner_id: ownerId,
      renter_id: renterId,
      start_date: new Date(start).toISOString(),
      end_date: new Date(end).toISOString(),
      status: "requested",
      price_per_day: pricePerDay,
      total_price: calculateTotalPrice(start, end, pricePerDay),
    })
    .select()
    .single();

  if (error) throw error;

  const bookingDetails = await getBookingDetails(supabase, booking.booking_id);

  const { data: owner } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", ownerId)
    .single();

  if (owner?.email) {
    await notify({
      to: owner.email,
      subject: "New booking request",
      html: bookingRequestEmail({
        renter: bookingDetails.renter.first_name,
        title: bookingDetails.listing.title,
        start,
        end,
        bookingId: booking.booking_id,
        pricePerDay,
      }),
    });
  }

  return { bookingId: booking.booking_id };
}
