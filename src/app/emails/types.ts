export interface BookingAcceptedEmailProps {
  id: string;
  title: string;
  start: string;
  end: string;
  pricePerDay: number;
}

export interface BookingRequestEmailProps {
  renter: string;
  title: string;
  start: string;
  end: string;
  bookingId: string;
  pricePerDay: number;
}
