import { createClient } from "@/lib/supabase/client";
import { IncomingBooking, OutgoingMessageProps } from "./types";
import { SystemMessageProps } from "@/app/globalTypes";


export async function getBookingDetails(
  id: string
): Promise<IncomingBooking | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, listings (title), owner:profiles!bookings_owner_id_fkey1 (avatar, first_name, last_name), renter:profiles!bookings_renter_id_fkey1 (avatar, first_name, last_name)"
    )
    .eq("booking_id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function confirmPickUp(bookingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "in_use" })
    .eq("booking_id", bookingId);

  if (error) throw error;
}

export async function confirmReturned(bookingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "returned" })
    .eq("booking_id", bookingId);

  if (error) throw error;
}

export async function declineRequest(bookingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "declined" })
    .eq("booking_id", bookingId);

  if (error) throw error;
}

export async function cancelRequest(bookingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("booking_id", bookingId);

  if (error) throw error;
}

export async function sendMessage(messageDetails: OutgoingMessageProps) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chats")
    .insert(messageDetails)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(bookingId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}


//insert approve message 
export async function insertApprovedMessage(message: SystemMessageProps) {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").insert(message);
  if (error) throw error;
}

//insert picked up request 
export async function insertPickedUpMessage(message: SystemMessageProps) {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").insert(message);
  if (error) throw error;
}

//insert returned message 
export async function insertReturnedMessage(message: SystemMessageProps) {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").insert(message);
  if (error) throw error;
}

//insert request declined message
export async function insertDeclineMessage(message: SystemMessageProps) {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").insert(message);
  if (error) throw error;
}