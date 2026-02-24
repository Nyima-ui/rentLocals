import { calculateTotalPrice } from "../listing/[id]/booking";
import { BookingRequestEmailProps } from "./types";

export function bookingRequestEmail({
  renter,
  title,
  start,
  end,
  bookingId,
  pricePerDay,
}: BookingRequestEmailProps) {
  const total = calculateTotalPrice(start, end, parseInt(pricePerDay, 10));
  return `<div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New booking request</h2>

        <p>
          <strong>${
            renter ?? "A renter"
          }</strong> has requested to book your listing:
        </p>

        <p>
          <strong>${title}</strong>
        </p>

        <p>
          📅 <strong>Dates:</strong>
          ${new Date(start).toDateString()} → ${new Date(end).toDateString()}
        </p>

        <p>
          💰 <strong>Total price:</strong> ₹${total}
        </p>

        <p>
          <a
            href="http://localhost:3000//booking/${bookingId}"
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
      </div>`;
}
