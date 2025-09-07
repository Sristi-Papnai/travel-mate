"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; 
import { useSignupModal } from "@/app/(public)/_components/signup-modal-context";

export default function Navbar() {
  const { openSignup } = useSignupModal(); 
  return (
    <nav className="flex justify-between fixed top-0 w-full z-50 items-center px-6 bg-black shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={100} height={40} />
      </div>

      {/* Navigation Links */}
      <div className="flex items-end space-x-6 text-white">
        <Link href="/" className="hover:text-gray-300 underline underline-offset-9">
          Home Page
        </Link>
        <Link href="/" className="hover:text-gray-300">
          Destinations
        </Link>
        <Link href="/" className="hover:text-gray-300">
          Travel Tips
        </Link>


        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center hover:text-gray-300">
              More Info <span className="ml-1">▾</span>
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

        <Button
          variant="outline"
          className="bg-black text-white border border-white hover:bg-white hover:text-black px-5 py-2"
        >
          Join
        </Button>
        {/* Sign Up Button opens the modal */}
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 px-5 py-2"
          onClick={openSignup} 
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
