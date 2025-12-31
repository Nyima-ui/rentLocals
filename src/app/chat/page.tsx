import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { SearchBox } from "../page";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send } from "lucide-react";

export function BookingInfo() {
  return (
    <Card className=" bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Bookign ID: 245634346</CardTitle>
        <CardDescription>Status: Requested</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">
          <Link href="/listing/asdf23452" className="leading-tight">
            XLR cables (long or short) one price
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 mt-7">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-12 rounded-[100px]"
            />
          </Avatar>
          <Button
            asChild
            variant="outline"
            className="border-none bg-none hover:bg-transparent"
          >
            <Link href="#">Artur S</Link>
          </Button>
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

export function Chat() {
  return (
    <div className="grow px-3 h-120  relative border rounded-md min-w-109.25 pt-3">
      <div className="h-105 overflow-y-scroll no-scrollbar pb-10">
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
            quam!
          </div>
        </div>
        <div className="flex gap-3 mt-5 justify-end">
          <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tl-lg mt-7">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
            quam!
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

        <div className="flex gap-3 mt-5">
          <div>
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="size-12 rounded-[100px]"
              />
            </Avatar>
          </div>
          <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tr-lg mt-7">
            Lorem, ipsum.
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <div>
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="size-12 rounded-[100px]"
              />
            </Avatar>
          </div>
          <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tr-lg mt-7">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut
            aspernatur, maxime excepturi saepe dignissimos dolorem. Fugiat iusto
            assumenda distinctio voluptatibus.
          </div>
        </div>
        <div className="flex gap-3 mt-5 justify-end">
          <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tl-lg mt-7">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
            quam!
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
        <div className="flex gap-3 mt-5 justify-end">
          <div className="text-sm bg-gray-600 text-white max-w-70 rounded-b-lg px-2 py-1 rounded-tl-lg mt-7">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
            quam!
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
      </div>
      <div className="flex items-center justify-between absolute w-[90%] bottom-0.5">
        <input
          type="text"
          placeholder="Message to Artur S"
          className="grow px-3 py-2 rounded-4xl border text-wrap"
        />
        <button className="cursor-pointer p-3 rounded-[100px] bg-transparent hover:bg-gray-300">
          <Send />
        </button>
      </div>
    </div>
  );
}

const ChatPage = () => {
  return (
    <section className="max-w-6xl mx-auto max-xl:px-5">
      <SearchBox />
      <div className="mt-17 flex justify-between max-md:flex-col gap-5">
        <BookingInfo />
        <Chat />
      </div>
    </section>
  );
};

export default ChatPage;
