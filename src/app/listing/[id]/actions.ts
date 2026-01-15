"use server";
import { createClient } from "@/lib/supabase/server";
import { calculateTotalPrice, preventDoubleBooking } from "./booking";
import { notify } from "../../notifications";
import { SupabaseClient } from "@supabase/supabase-js";
import { bookingRequestEmail } from "@/app/emails/bookinRequest";
import { RequestBookingActionProps } from "./types";
import { SystemMessageProps } from "@/app/globalTypes";


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


export async function insertRequestMessage(message: SystemMessageProps) {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").insert(message);
  if (error) throw error;
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

  //check for existing bookings
  const existingBooking = await preventDoubleBooking(
    supabase,
    listingId,
    renterId,
    ownerId
  );

  if (existingBooking) {
    return { bookingId: existingBooking.booking_id };
  }

  //insert a new booking
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

  //get more details about the booking
  const bookingDetails = await getBookingDetails(supabase, booking.booking_id);

  //get the user email
  const { data: owner } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", ownerId)
    .single();

  //send the email
  if (owner?.email) {
    await notify({
      to: "ntenzin492@gmail.com",
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

  //insert request message
  await insertRequestMessage({
    sender_id: renterId,
    receiver_id: ownerId,
    listing_id: listingId,
    booking_id: booking.booking_id,
    type: "system",
    system_action: "requested",
  });

  return { bookingId: booking.booking_id };
}
