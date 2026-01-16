import Image from "next/image";
import { IncomingListing } from "./types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

interface MyListingCardProps {
  listing: IncomingListing;
  onDelete: (listingId: string) => Promise<void>;
}

export function MyListingCard({ listing, onDelete }: MyListingCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <li className="max-w-55">
      <Card className="p-0 overflow-hidden gap-2 pb-3">
        <CardHeader className="p-0 ">
          <div className="bg-gray-400 h-43.75 relative">
            <Image
              src={listing.images[0] ?? ""}
              alt={listing.title}
              fill
              sizes="30"
              loading="eager"
            />
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <p className="truncate w-full">{listing.title}</p>
          <p className="font-semibold mt-2 text-lg">{`$${listing?.prices?.price_day}/day`}</p>
        </CardContent>
        <CardFooter className="px-2 flex-col gap-3">
          <div className="flex w-full gap-3">
            <Button variant={"outline"} className="grow" asChild>
              <Link href={`/edit-listing/${listing.listing_id}`}>Edit</Link>
            </Button>
            <Button variant={"outline"} className="grow" asChild>
              <Link href={`/listing/${listing.listing_id}`}>Preview</Link>
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600/95 hover:bg-red-500 w-full cursor-pointer">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this listing?</DialogTitle>
                <DialogDescription>
                  If you delete this listing, it will be permanently removed and
                  cannot be recovered.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600/95 hover:bg-red-500 cursor-pointer"
                  onClick={async () => {
                    await onDelete(listing.listing_id);
                    setOpen(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </li>
  );
}
