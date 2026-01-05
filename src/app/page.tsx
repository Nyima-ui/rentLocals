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

export function Navbar() {
  const [isSubMenuOpened, setisSubMenuOpened] = useState<boolean>(false);
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
              <Avatar
                className="size-11! overflow-hidden flex items-center justify-center rounded-[100px] cursor-pointer"
                onClick={() => setisSubMenuOpened((prev) => !prev)}
              >
                <AvatarImage
                  src={user?.user_metadata?.avatar}
                  className="object-cover"
                ></AvatarImage>
              </Avatar>
            ) : (
              <Link href="/sign-up">Sign in</Link>
            )}
            {isSubMenuOpened && (
              <ul className="absolute top-[110%] -left-2 bg-gray-300 py-1 px-3 rounded-sm z-10">
                <li className="hover:opacity-65">
                  <Link
                    href={`listings/${user?.id}`}
                    onClick={() => setisSubMenuOpened(false)}
                  >
                    Listings
                  </Link>
                </li>
                <li className="hover:opacity-65">
                  <button
                    className="size-full"
                    onClick={() => {
                      supabase.auth.signOut();
                      setisSubMenuOpened(false);
                      router.push("/");
                    }}
                  >
                    Log out
                  </button>
                </li>
              </ul>
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
