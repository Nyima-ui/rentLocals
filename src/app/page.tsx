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

export function Navbar() {
  return (
    <header className="max-w-6xl mx-auto max-xl:px-5">
      <nav className="flex justify-between items-center py-4">
        <Link href="/">LOGO</Link>
        <ul className="flex items-center gap-3">
          <li>
            {/* <Link href="/sign-up">Sign in</Link> */}
            <Link href="/listings/23432413">
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="size-11 rounded-[100px]"
                ></AvatarImage>
              </Avatar>
            </Link>
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
