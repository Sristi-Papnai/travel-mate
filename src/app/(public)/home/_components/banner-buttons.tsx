"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-context";

export default function BannerButtons() {
  const { openLogin } = useDialog();

  return (
    <div className="flex items-end space-x-6 text-white">
      <Button
        onClick={openLogin}
        variant="default"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
      >
        Get Started
      </Button>
      <Button
        variant="outline"
        className="bg-black text-white border border-white hover:bg-white hover:text-black px-5 py-2"
      >
        Learn More
      </Button>
    </div>
  );
}
