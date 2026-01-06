"use client";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

export function ListingCard() {
  return (
    <li>
      <Link href="/listing/234fsdf">
        <Card className="p-0 overflow-hidden gap-2 pb-3">
          <CardHeader className="p-0 ">
            <div className="bg-gray-400 h-43.75">
              <ImageIcon className="text-gray-200" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CardFooter className="flex flex-col items-start px-1.5">
              <p className="truncate w-full">
                Xp-pen innovator display 16 drawing tablet (15.6)
              </p>
              <p>$12/day</p>
            </CardFooter>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto mb-15">
      <SearchBox />
      <ul className="grid mt-10 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 max-xl:px-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <ListingCard key={index} />
        ))}
      </ul>
    </section>
  );
}
