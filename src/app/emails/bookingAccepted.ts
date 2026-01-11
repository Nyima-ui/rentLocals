import { calculateTotalPrice } from "../listing/[id]/booking";
import { BookingAcceptedEmailProps } from "./types";

export function bookingAcceptedEmail({
  id,
  title,
  start,
  end,
  pricePerDay,
}: BookingAcceptedEmailProps) {
  const total = calculateTotalPrice(start, end, pricePerDay);
  return `<div style="font-family: sans-serif; line-height: 1.6;">
  <h2>Booking request accepted</h2>

  <p>
    Your request to book
    <strong>${title}</strong>
    has been <strong>accepted</strong> by the owner.
  </p>

  <p>
    📅 <strong>Dates:</strong>
    ${new Date(start).toDateString()} → ${new Date(end).toDateString()}
  </p>

  <p>
    💰 <strong>Total price:</strong> ₹${total}
  </p>

  <p>
    You can now view the booking details and pickup information below.
  </p>

  <p>
    <a
      href="http://localhost:3000/booking/${id}"
      style="
        display: inline-block;
        padding: 10px 16px;
        background: #111;
        color: #fff;
        text-decoration: none;
        border-radius: 6px;
      "
    >
      View booking
    </a>
  </p>

  <hr />

  <p style="font-size: 12px; color: #666;">
    This email was sent by <strong>RentLocals</strong>.
    If you have any questions, you can reply directly to this email.
  </p>
</div>`;
}
