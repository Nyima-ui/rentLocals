export interface GetOwnerRentalsProps {
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