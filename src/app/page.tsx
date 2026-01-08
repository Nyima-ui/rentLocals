"use client";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export function Navbar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <header className="max-w-6xl mx-auto max-xl:px-5">
      <nav className="flex justify-between items-center py-4">
        <Link href="/">LOGO</Link>
        <ul className="flex items-center gap-3 relative">
          <li>
            {user ? (
              <DropdownMenu
                open={isDropDownOpen}
                onOpenChange={setIsDropDownOpen}
              >
                <DropdownMenuTrigger>
                  <Avatar className="size-11! overflow-hidden flex items-center justify-center rounded-[100px] cursor-pointer">
                    <AvatarImage
                      src={user?.user_metadata?.avatar}
                      className="object-cover"
                    ></AvatarImage>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-300 rounded-md px-3 py-2 z-10">
                  <DropdownMenuLabel className="font-medium">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setIsDropDownOpen(false)}
                    asChild
                  >
                    <Link href={`/listings/${user?.id}`}>Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={async () => {
                      await supabase.auth.signOut();
                      setIsDropDownOpen(false);
                      router.push("/");
                    }}
                    asChild
                    className="cursor-pointer block"
                  >
                    <button>Log out</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-up">Sign in</Link>
            )}
          </li>
          <li>
            <Button asChild>
              <Link href="/create-listing">Create listing</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function SearchBox() {
  return (
    <div className="max-w-lg mx-auto px-5">
      <InputGroup>
        <InputGroupInput placeholder="Search listing..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <li>
      <Link href={`/listing/${listing.listing_id}`}>
        <Card className="p-0 overflow-hidden gap-2 pb-3">
          <CardHeader className="p-0 ">
            <div className="bg-gray-400 h-43.75 relative">
              <Image
                src={listing?.images?.[0]}
                alt={listing?.title}
                fill
                loading="eager"
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CardFooter className="flex flex-col items-start px-1.5">
              <p className="truncate w-full">{listing.title}</p>
              <p className="font-medium">{`$${listing.prices.price_day}/day`}</p>
            </CardFooter>
          </CardContent>
        </Card>
      </Link>
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
  prices: {
    price_day: number;
    price_week: number | null;
    price_month: number | null;
  };
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListingsForHome() {
      const { data, error } = await supabase
        .from("listings")
        .select("*, prices (price_day)");

      if (error) {
        console.error(`Error fetching listing at /: ${error.message}`);
        return;
      }
      setListings(data);
    }
    fetchListingsForHome();
  }, [supabase]);
  return (
    <section className="max-w-6xl mx-auto mb-15">
      <SearchBox />
      <ul className="grid mt-10 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {listings.map((listing, index) => (
          <ListingCard key={index} listing={listing} />
        ))}
      </ul>
    </section>
  );
}
