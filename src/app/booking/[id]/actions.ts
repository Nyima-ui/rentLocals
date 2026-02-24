"use server";
import { createClient } from "@/lib/supabase/server";
import { notify } from "@/app/notifications";
import { ApproveRequestProps } from "./types";
import { bookingAcceptedEmail } from "@/app/emails/bookingAccepted";

export async function approveRequest({
  id,
  listingId,
  title,
  start,
  end,
  pricePerDay,
}: ApproveRequestProps): Promise<string | null> {
  const supabase = await createClient();
  //toggle update -> "booked"
  const { data: booking, error: updateError } = await supabase
    .from("bookings")
    .update({ status: "booked" })
    .eq("booking_id", id)
    .select("renter_id")
    .single();

  if (updateError) throw updateError;

  const renterId = booking.renter_id;

  //fetch email of renter
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", renterId)
    .single();

  if (fetchError) throw fetchError;

  //send email
  if (profile.email) {
    await notify({
      to: "ntenzin492@gmail.com",
      subject: "Your booking request has been accepted.",
      html: bookingAcceptedEmail({ id, title, start, end, pricePerDay }),
    });
  }

  // fetch and return pickup address
  const pickupLocation = await getPickupLocation(listingId);
  return pickupLocation;
}

export async function getPickupLocation(
  listingId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("pickup_location")
    .eq("listing_id", listingId)
    .single();

  if (error) throw error;
  // console.log(address);
  return data.pickup_location;
}
