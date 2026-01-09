"use client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { SearchBox } from "../../page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function OwnerBookingInfo() {
  return (
    <Card className="bg-transparent shadow-none gap-0">
      <CardHeader>
        <CardTitle>Bookign ID: 245634346</CardTitle>
        <CardDescription>Status: Requested</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl mt-5">
          <Link href="/listing/asdf23452" className="leading-tight">
            XLR cables (long or short) one price
          </Link>
        </CardTitle>
        <div className="border-b-2 border-red-300 pb-1.5 mt-3 max-w-xs">
          <p>
            <Link href="#" className="text-blue-600">
              Martha P
            </Link>{" "}
            has requested to rent your listing.
          </p>
        </div>
        <div className="max-w-xs border-b-2 pb-1.5 mt-2">
          <p className="text-base text-gray-700 leading-tight">
            Pick up address is shown here after you approve the request.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-12 rounded-[100px]"
            />
          </Avatar>

          <Link href="#">Martha P.</Link>
        </div>
        {/* rental period */}
        <div className="mt-3">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">2 Jan - 27 Jan</p>
            <CardDescription className="text-gray-500">
              Rental period
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-10 mt-5">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$27</p>
            <CardDescription className="text-gray-500">
              Price per day
            </CardDescription>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$270</p>
            <CardDescription className="text-gray-500">
              Total amount
            </CardDescription>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-5">
        <CardAction className="mx-auto">
          <Button className="cursor-pointer py-6">Approve Request</Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

export function IncomingMessage() {
  return (
    <div className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="size-12 rounded-[100px]"
          />
        </Avatar>
      </div>
      <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tr-lg mt-7">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, quam!
      </div>
    </div>
  );
}

export function OutgoingMessage() {
  return (
    <div className="flex gap-3 mt-5 justify-end">
      <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tl-lg mt-7">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, quam!
      </div>
      <div>
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="size-12 rounded-[100px]"
          />
        </Avatar>
      </div>
    </div>
  );
}

interface SystemMessageProps {
  date: string;
}

export function SystemMessage({ date }: SystemMessageProps) {
  return (
    <div className="bg-cyan-100 max-w-60 ml-3 my-5 px-2 py-1.5 border-l-2 border-cyan-300 text-sm">
      <p>{date}</p>
      <p>You request has been sent.</p>
    </div>
  );
}

interface Booking {
  listing_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: "requested" | "booked" | "declined" | "cancelled";
  price_per_day: number;
  total_price: number;
}

interface IncomingBooking extends Booking {
  booking_id: string;
  created_at: string;
  listings: {
    title: string;
  };
}

interface ChatProps {
  booking: IncomingBooking;
}

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatSystemDate(isoString: string) {
  const date = new Date(isoString);

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `Date: ${day}${suffix} ${month}, ${year}`;
}

export function Chat({ booking }: ChatProps) {
  const dateForSystemMessage = formatSystemDate(booking.created_at);
  return (
    <div className="grow px-3 h-135 relative border rounded-md pt-3">
      <div className="h-105 overflow-y-scroll no-scrollbar pb-10">
        <SystemMessage date={dateForSystemMessage} />
        <IncomingMessage />
        <OutgoingMessage />
      </div>
      <form className="flex items-center justify-between absolute w-[95%] bottom-0.5">
        <Field className="flex-row">
          <Input
            type="text"
            placeholder="Message to Artur S"
            className="grow px-3 py-2 rounded-4xl border text-wrap"
            name="outgoing-message"
          />
          <Button className="max-w-10 cursor-pointer" type="submit">
            <Send />
          </Button>
        </Field>
      </form>
    </div>
  );
}

interface RenterBookingInfoProps {
  booking: IncomingBooking;
}

function capitalaize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export function RenterBookingInfo({ booking }: RenterBookingInfoProps) {
  return (
    <Card className="bg-transparent shadow-none min-w-1/2">
      <CardHeader>
        <CardTitle>
          Bookign ID:{" "}
          <span className="font-normal text-sm">{booking.booking_id}</span>
        </CardTitle>
        <CardDescription className="font-medium text-base">
          Status: {capitalaize(booking.status)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs border-b-2 pb-1.5">
          <p className="text-base text-gray-700 leading-tight">
            Pickup address will be shown after approval.
          </p>
        </div>
        <CardTitle className="text-2xl mt-5">
          <Link href="/listing/asdf23452" className="leading-tight">
            {booking.listings.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 mt-7">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-12 rounded-[100px]"
            />
          </Avatar>

          <Link href="#">Artur S</Link>
        </div>
        {/* rental period */}
        <div className="mt-7">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">2 Jan - 27 Jan</p>
            <CardDescription className="text-gray-500">
              Rental period
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-10 mt-5">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$27</p>
            <CardDescription className="text-gray-500">
              Price per day
            </CardDescription>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$270</p>
            <CardDescription className="text-gray-500">
              Total amount
            </CardDescription>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <CardAction className="mx-auto">
          <Button variant="outline" className="cursor-pointer py-6">
            Cancel Request
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

const ChatPage = () => {
  const { id } = useParams();
  const supabase = createClient();

  const [currentBooking, setCurrentBooking] = useState<IncomingBooking | null>(
    null
  );

  useEffect(() => {
    async function fetchBookingDetails() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "*, listings (title), owner:profiles!bookings_owner_id_fkey (avatar, first_name, last_name)"
        )
        .eq("booking_id", id)
        .single();

      if (error) {
        console.error(
          `Supabase error while fetching booking details: ${error.message}`
        );
        return;
      }
      setCurrentBooking(data);
      console.log(data);
    }
    fetchBookingDetails();
  }, [id, supabase]);

  if (!currentBooking) {
    return (
      <p className="max-w-6xl mx-auto max-xl:px-5 my-10 text-2xl">Loading...</p>
    );
  }
  return (
    <section className="max-w-6xl mx-auto max-xl:px-5 mb-15">
      <SearchBox />
      <div className="mt-17 flex justify-between max-md:flex-col gap-5">
        <RenterBookingInfo booking={currentBooking} />
        {/* <OwnerBookingInfo /> */}
        <Chat booking={currentBooking} />
      </div>
    </section>
  );
};

export default ChatPage;
