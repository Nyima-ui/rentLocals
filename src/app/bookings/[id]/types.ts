export interface GetRenterBookingsProps {
  booking_id: string;
  status: "requested" | "booked";
  listing: {
    images: string[];
    title: string;
  };
  price: {
    price_day: number;
  };
}