import { CardDescription } from "@/components/ui/card";
import { formatStartEndDate } from "@/lib/utils";
import { IncomingBooking } from "./types";

const BookingSummary = ({ booking }: { booking: IncomingBooking }) => {
  return (
    <div>
      <div className="mt-7">
        <div className="border grow text-center rounded-md py-1.5">
          <p className="text-xl font-medium">
            {formatStartEndDate(booking.start_date)}-
            {formatStartEndDate(booking.end_date)} /{" "}
            {new Date(booking.end_date).getFullYear()}
          </p>
          <CardDescription className="text-card-foreground mt-1">
            Rental period{" "}
            {booking.status === "returned" && <span>(Expired)</span>}
          </CardDescription>
        </div>
      </div>
      <div className="flex gap-10 mt-5">
        <div className="border grow text-center rounded-md py-1.5">
          <p className="text-xl font-medium">${booking.price_per_day}</p>
          <CardDescription className="text-card-foreground mt-1">
            Price per day
          </CardDescription>
        </div>
        <div className="border grow text-center rounded-md py-1.5">
          <p className="text-xl font-medium">${booking.total_price}</p>
          <CardDescription className="text-card-foreground mt-1">
            Total amount
          </CardDescription>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
