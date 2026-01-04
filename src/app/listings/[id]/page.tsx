"use client";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/utils/supabase";

interface DeleteConfirmationModalProps {
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteConfirmationModal({
  setIsDeleteModalOpen,
}: DeleteConfirmationModalProps) {
  return (
    <div
      id="dialog"
      className="fixed top-0 left-0 h-screen w-screen bg-black/70 flex justify-center items-center"
      onClick={() => setIsDeleteModalOpen(false)}
    >
      <div
        className="bg-white max-w-sm rounded-md px-5 py-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl">Delete this listing?</h2>
        <p className="leading-tight">
          If you delete this listing, it will be permanently removed and cannot
          be recovered.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="grow cursor-pointer"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="grow cursor-pointer bg-red-500/95 hover:bg-red-500"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MyListingCard({
  setIsDeleteModalOpen,
}: DeleteConfirmationModalProps) {
  return (
    <li className="max-w-55">
      <Card className="p-0 overflow-hidden gap-2 pb-3">
        <CardHeader className="p-0 ">
          <div className="bg-gray-400 h-43.75">
            <ImageIcon className="text-gray-200" />
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <p className="truncate w-full">
            Xp-pen innovator display 16 drawing tablet (15.6)
          </p>
          <p className="font-semibold mt-2">$12/day</p>
        </CardContent>
        <CardFooter className="px-2 flex-col gap-3">
          <div className="flex w-full gap-3">
            <Button variant={"outline"} className="grow" asChild>
              <Link href="/edit-listing/2343Sfs">Edit</Link>
            </Button>
            <Button variant={"outline"} className="grow" asChild>
              <Link href="/listing/234fsdf">Preview</Link>
            </Button>
          </div>
          <Button
            className="bg-red-600/95 hover:bg-red-500 w-full cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

const Listings = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  return (
    <section className="max-w-6xl mx-auto  mb-15">
      <h1 className="text-3xl max-xl:px-5">Your listings</h1>
      <ul className="grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <MyListingCard
            key={index}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        ))}
      </ul>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal setIsDeleteModalOpen={setIsDeleteModalOpen} />
      )}
    </section>
  );
};

export default Listings;
