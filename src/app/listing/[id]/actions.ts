"use server";
import { createClient } from "@/lib/supabase/server";
import { calculateTotalPrice, preventDoubleBooking } from "./booking";
import { notifyOwner } from "./notifications";
import { SupabaseClient } from "@supabase/supabase-js";

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
}: {
  listingId: string;
  ownerId: string;
  renterId: string;
  start: string;
  end: string;
  pricePerDay: number;
}) {
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
    await notifyOwner({
      to: owner.email,
      subject: "New booking request",
      html: `<div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New booking request</h2>

        <p>
          <strong>${
            bookingDetails.renter.first_name ?? "A renter"
          }</strong> has requested to book your listing:
        </p>

        <p>
          <strong>${bookingDetails.listing.title}</strong>
        </p>

        <p>
          📅 <strong>Dates:</strong>
          ${new Date(start).toDateString()} → ${new Date(end).toDateString()}
        </p>

        <p>
          💰 <strong>Total price:</strong> ₹${calculateTotalPrice(
            start,
            end,
            pricePerDay
          )}
        </p>

        <p>
          <a
            href="http://localhost:3000//booking/${booking.booking_id}"
            style="
              display: inline-block;
              padding: 10px 16px;
              background: #111;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Review request
          </a>
        </p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          This email was sent by <strong>RentLocals</strong>.
        </p>
      </div>`,
    });
  }

  return { bookingId: booking.booking_id };
}
