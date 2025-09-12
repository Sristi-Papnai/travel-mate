"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useDialog } from "@/context/dialog-context";
import { useSession, signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { useCallback } from "react";
import { useRouter } from "next/navigation";


export default function NavbarButtons() {
  const { openSignup } = useDialog();
  const { data: session } = useSession(); 
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/"); 
  }, []); 



  if (session && session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>

          <CgProfile size={28} />

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
    );
  }

  return (
    <>
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
    </>
  );
}
