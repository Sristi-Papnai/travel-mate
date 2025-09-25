"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useDialog } from "@/context/dialog-context";
import { CgProfile } from "react-icons/cg";
import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { IoMdArrowDropdown } from "react-icons/io";


export default function NavbarButtons({ session }: { session: Session | null  }) {
  const { openSignup } = useDialog();
  const router = useRouter();
  const pathname = usePathname();

  const { data: clientSession } = useSession(); 

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/"); 
  }, []); 

  return (
    <>
      {/* Navigation Links */}
      <Link
        href="/"
        className={`hover:text-gray-300 ${
          pathname === "/" || pathname === "/home" ? "underline underline-offset-8" : ""
        }`}
      >
        Home Page
      </Link>

      <Link
        href="/destinations"
        className={`hover:text-gray-300 ${
          pathname === "/destinations" ? "underline underline-offset-8" : ""
        }`}
      >
        Destinations
      </Link>

      <Link
        href="/travel-tips"
        className={`hover:text-gray-300 ${
          pathname === "/travel-tips" ? "underline underline-offset-8" : ""
        }`}
      >
        Travel Tips
      </Link>

      {( (clientSession === undefined && session?.user) || clientSession?.user ) && (
        <>
          <Link
            href="/dashboard"
            className={`hover:text-gray-300 ${
              pathname === "/dashboard" ? "underline underline-offset-8" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/board"
            className={`hover:text-gray-300 ${
              pathname === "/board" ? "underline underline-offset-8" : ""
            }`}
          >
            Board
          </Link>
        </>

    )}
  
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center hover:text-gray-300">
            More Info
            <span className="ml-1">
              <IoMdArrowDropdown />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white text-black shadow-md rounded-md p-2">
          <DropdownMenuItem asChild>
            <Link href="/">About Us</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">Contact</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  
      {/* Profile or Join/SignUp buttons */}
      {((clientSession === undefined && session?.user) || clientSession?.user) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CgProfile size={35} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black shadow-md rounded-md p-2">
            <DropdownMenuItem asChild>
              <Link href="/">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={handleLogout}>Logout</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-black text-white border border-white hover:bg-white hover:text-black px-5 py-2"
          >
            Join
          </Button>
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2"
            onClick={openSignup}
          >
            Sign Up
          </Button>
        </div>
      )}
    </>
  );
  
}
