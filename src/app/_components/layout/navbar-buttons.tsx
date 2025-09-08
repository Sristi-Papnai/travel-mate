"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-context";

export default function NavbarButtons() {
  const { openSignup } = useDialog();

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
