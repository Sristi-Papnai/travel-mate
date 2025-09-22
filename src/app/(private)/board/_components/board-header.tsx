// app/(private)/board/_components/board-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  IoAdd,
  IoCalendarOutline,
  IoSearchOutline,
} from "react-icons/io5";

export default function BoardHeader() {
  const [selected, setSelected] = useState("All Trips");

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left side: Dropdown + Search */}
      <div className="flex items-center gap-3">
        {/* Dropdown */}
        <DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button
      className=" flex py-2 px-3 rounded-xl border border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50"
    >
      {selected}
      <IoIosArrowDown size={20} className="ml-2 text-black" />
    </button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content
    className="bg-white rounded-lg border border-purple-300 shadow-md p-2 mt-2 ml-4 text-black"
  >
    <DropdownMenu.Item
      className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
      onSelect={() => setSelected("All")}
    >
      All Trips
    </DropdownMenu.Item>
    <DropdownMenu.Item
      className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
      onSelect={() => setSelected("Shared Trips")}
    >
      Shared Trips
    </DropdownMenu.Item>
    <DropdownMenu.Item
      className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
      onSelect={() => setSelected("My Trips")}
    >
      My Trips
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>


        {/* Calendar picker */}
        <div className="flex items-center  rounded-xl cursor-pointer p-2 border border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50">
          <IoCalendarOutline className="text-black text-lg" size={24} />
          {/* <span className="text-sm text-black">{dateRange}</span> */}
        </div>

        {/* Search bar */}
        <div className="relative rounded-xl border border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50">
          {/* Left icon */}
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg" />

          {/* Input */}
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-12  bg-gray-200 border-0 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      {/* Right side: Add Trip button */}
      <Button className="flex items-center gap-2 rounded-xl bg-[#5A2D82] hover:bg-purple-800 text-white">
        <IoAdd className="text-lg" />
        Add Trip
      </Button>
    </div>
  );
}
