"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  const { user } = useAuth();
  return (
    // <Navar2 />
    <header className="max-w-6xl mx-auto max-xl:px-5">
      <nav className="flex justify-between items-center py-4">
        <Link href="/">LOGO</Link>
        <ul className="flex items-center gap-3 relative">
          <li>
            {user ? (
              <DropdownMenu
                open={open}
                onOpenChange={setOpen}
              >
                <DropdownMenuTrigger>
                  <Avatar className="size-11! overflow-hidden flex items-center justify-center rounded-[100px] cursor-pointer">
                    <AvatarImage
                      src={user?.user_metadata?.avatar}
                      className="object-cover"
                    ></AvatarImage>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black rounded-md px-3 py-2 z-10">
                  <DropdownMenuLabel className="font-medium">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setOpen(false)}
                    asChild
                  >
                    <Link
                      href={`/listings/${user?.id}`}
                      className="hover:opacity-50 transition-all duration-150 ease-in"
                    >
                       My listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setOpen(false)}
                    asChild
                  >
                    <Link
                      href={`/mybookings/${user?.id}`}
                      className="block hover:opacity-50 transition-all duration-150 ease-in"
                    >
                      My bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setOpen(false)}
                    asChild
                  >
                    <Link
                      href={`/myrentals/${user?.id}`}
                      className="block hover:opacity-50 transition-all duration-150 ease-in"
                    >
                      My rentals  
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={async () => {
                      await supabase.auth.signOut();
                      setOpen(false);
                      router.push("/");
                    }}
                    asChild
                    className="cursor-pointer block hover:opacity-50 transition-all duration-150 ease-in"
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
};

export default Navbar;

// function Navar2() {
//   const [open, setOpen] = useState<boolean>(false);
//   const supabase = createClient();
//   const router = useRouter();
//   const { user } = useAuth();
//   return (
//     <header className="max-w-6xl mx-auto max-xl:px-5">
//       <nav className="flex justify-between py-4 items-center border">
//         <Link href="/">
//           <Image src={"/logo.svg"} alt="home page" height={0} width={110} />
//         </Link>
//         <div className="flex items-center gap-3 sm:hidden">
//           {user ? (
//             <DropdownMenu open={open} onOpenChange={setOpen}>
//               <DropdownMenuTrigger className="rounded-full">
//                 <Avatar className="size-11! overflow-hidden flex items-center justify-center rounded-[100px] cursor-pointer">
//                   <AvatarImage
//                     src={user?.user_metadata?.avatar}
//                     className="object-cover"
//                   ></AvatarImage>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="bg-card rounded-md px-3 py-2 z-10 -translate-x-10">
//                 <DropdownMenuLabel className="font-medium">
//                   My Account
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onSelect={() => setOpen(false)} asChild>
//                   <Link
//                     href={`/listings/${user?.id}`}
//                     className="hover:opacity-50 transition-all duration-150 ease-in"
//                   >
//                     My listings
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onSelect={() => setOpen(false)} asChild>
//                   <Link
//                     href={`/mybookings/${user?.id}`}
//                     className="block hover:opacity-50 transition-all duration-150 ease-in"
//                   >
//                     My bookings
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onSelect={() => setOpen(false)} asChild>
//                   <Link
//                     href={`/myrentals/${user?.id}`}
//                     className="block hover:opacity-50 transition-all duration-150 ease-in"
//                   >
//                     My rentals
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onSelect={async () => {
//                     await supabase.auth.signOut();
//                     setOpen(false);
//                     router.push("/");
//                   }}
//                   asChild
//                   className="cursor-pointer block hover:opacity-50 transition-all duration-150 ease-in"
//                 >
//                   <button>Log out</button>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Link
//               href="/sign-up"
//               className="hover:underline transition-all duration-150"
//             >
//               Sign in
//             </Link>
//           )}
//           <Button className="px-2">New +</Button>
//         </div>
//         <ul className="max-sm:hidden flex gap-5">
//           <li className="max-sm:hidden hover:opacity-80 transition-all duration-150 ease-in">
//             <Link href={`/listings/${user?.id}`}>Listings</Link>{" "}
//           </li>
//           <li className="max-sm:hidden hover:opacity-80 transition-all duration-150 ease-in">
//             <Link href={`/mybookings/${user?.id}`}>Bookings</Link>
//           </li>
//           <li className="max-sm:hidden hover:opacity-80 transition-all duration-150 ease-in">
//             <Link href={`/myrentals/${user?.id}`}>Rentals</Link>
//           </li>
//         </ul>
//         <Button className="max-sm:hidden">Create Listing</Button>
//       </nav>
//     </header>
//   );
// }
