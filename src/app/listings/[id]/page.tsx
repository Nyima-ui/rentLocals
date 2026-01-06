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
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface MyListingCardProps {
  listing: Listing;
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <li className="max-w-55">
      <Card className="p-0 overflow-hidden gap-2 pb-3">
        <CardHeader className="p-0 ">
          <div className="bg-gray-400 h-43.75 relative">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="30"
              loading="eager"
            />
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <p className="truncate w-full">{listing.title}</p>
          <p className="font-semibold mt-2">$12/day</p>
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
                <Button variant={"outline"} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600/95 hover:bg-red-500">
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

interface Listing {
  category: string[];
  created_at: string;
  description: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  listing_id: string;
  pickup_location: string;
  title: string;
  updated_at: string;
  user_id: string;
}

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserListings() {
      if (!user) return;
      const { data, error } = await supabase
        .from("listings")
        .select()
        .eq("user_id", user?.id);

      if (error) {
        console.error(`Error fetching user listigs: ${error.message}`);
      }

      if (data) {
        setListings(data);
      }
    }

    fetchUserListings();
  }, [user, supabase]);
  return (
    <section className="max-w-6xl mx-auto  mb-15">
      <h1 className="text-3xl max-xl:px-5">Your listings</h1>
      <ul className="grid mt-7 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {listings.map((item, index) => (
          <MyListingCard key={index} listing={item} />
        ))}
      </ul>
    </section>
  );
};

export default Listings;
