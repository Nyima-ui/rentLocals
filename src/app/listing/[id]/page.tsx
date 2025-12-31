"use client";
import { SearchBox } from "@/app/page";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export function ListingImage() {
  const [imageDisplayed, setImageDisplayed] = useState<string>("/file.svg");
  return (
    <div className="w-full max-md:w-full">
      <div className="bg-gray-400 h-100 w-full">
        <Image height={50} width={50} alt="some svg" src={imageDisplayed} />
      </div>
      <ul className="flex mt-2 gap-2 justify-end">
        <li className="bg-gray-400 size-15">
          <Image
            height={50}
            width={50}
            alt="some svg"
            src={"/file.svg"}
            onClick={() => setImageDisplayed("/file.svg")}
          />
        </li>
        <li className="bg-gray-400 size-15">
          <Image
            height={50}
            width={50}
            alt="some svg"
            src={"/globe.svg"}
            onClick={() => setImageDisplayed("/globe.svg")}
          />
        </li>
        <li
          className="bg-gray-400 size-15"
          onClick={() => setImageDisplayed("/next.svg")}
        >
          <Image height={50} width={50} alt="some svg" src={"/next.svg"} />
        </li>
      </ul>
    </div>
  );
}

export function ListingInfo() {
  return (
    <div className="grow space-y-3">
      <h1 className="text-4xl font-medium leading-12">
        Xp-pen innovator display 16 drawing tablet (15.6)
      </h1>
      <div className="flex items-center justify-between max-w-xs mt-10">
        <label htmlFor="start-date" className="text-nowrap">
          Start date:
        </label>
        <Input type="date" id="start-date" className="max-w-50" />
      </div>
      <div className="flex items-center justify-between max-w-xs">
        <label htmlFor="end-date" className="text-nowrap">
          End date:
        </label>
        <Input type="date" id="end-date" className="max-w-50" />
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-medium opacity-80">$27.50</h2>
        <p className="text-gray-500">Price for 1 day</p>
      </div>
      <Button className="mt-5" asChild>
         <Link href="/chat">Request Booking</Link>
      </Button>
      <div className="mt-10">
        <p className="text-lg">Price for all periods:</p>
        <div className="flex gap-5 mt-3">
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$27</p>
            <p className="text-gray-500">/day</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$72</p>
            <p className="text-gray-500">/week</p>
          </div>
          <div className="border grow text-center rounded-md py-1.5">
            <p className="text-xl font-medium">$365</p>
            <p className="text-gray-500">/month</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OwnerInfo() {
  return (
    <Card className="flex flex-row items-start max-lg:flex-col mt-10 justify-between bg-transparent border-none shadow-none">
      <div className="flex items-start max-md:flex-col max-md:gap-5">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="size-15 rounded-[100px]"
            />
          </Avatar>
          <CardContent>
            <CardTitle className="text-lg">Owned by Shan R</CardTitle>
            <CardAction className="mt-3">
              <Button>Message</Button>
            </CardAction>
          </CardContent>
        </div>
        <div className="">
          <p className="mb-3 font-medium">Approximate location:</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472086.7749927582!2d-80.61774836557551!3d43.893756423188556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2a1d7471156d%3A0x4ecad8e272e4c2a2!2sGreater%20Toronto%20Area%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sin!4v1767149734066!5m2!1sen!2sin"
            width="400"
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <p className="max-w-md max-xl:max-w-sm">
        <span className="text-base block font-semibold">About the item:</span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
        consectetur nostrum adipisci molestias eligendi facilis ratione tenetur
        doloribus iusto deleniti?
      </p>
    </Card>
  );
}

const Listing = () => {
  return (
    <section>
      <SearchBox />
      <section className="max-w-6xl mx-auto my-10  max-xl:px-5">
        <div className="flex gap-5 max-md:flex-col justify-between">
          <ListingImage />
          <ListingInfo />
        </div>
        <OwnerInfo />
      </section>
    </section>
  );
};

export default Listing;
