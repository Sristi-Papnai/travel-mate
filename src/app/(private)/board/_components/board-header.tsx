// app/(private)/board/_components/board-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import {
  IoAdd,
  IoCalendarOutline,
  IoSearchOutline,
} from "react-icons/io5";

interface BoardHeaderProps {
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function BoardHeader({
  selectedFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: BoardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left side: Dropdown + Search */}
      <div className="flex items-center gap-3">
        {/* Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex py-2 px-3 rounded-xl border border-purple-800 bg-white text-black hover:shadow-[inset_0px_0px_0px_2px_#5A2D82] hover:bg-purple-50"
            >
              {selectedFilter}
              <IoIosArrowDown size={20} className="ml-2 text-black" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white rounded-lg border border-purple-300 shadow-md p-2 mt-2 ml-4 text-black">
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
              onSelect={() => onFilterChange("All Trips")}
            >
              All Trips
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
              onSelect={() => onFilterChange("Shared Trips")}
            >
              Shared Trips
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-500"
              onSelect={() => onFilterChange("My Trips")}
            >
              My Trips
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {/* Calendar picker (not wired yet) */}
        <div className="flex items-center rounded-xl cursor-pointer p-2 border border-purple-800 bg-white text-black hover:shadow-[inset_0px_0px_0px_2px_#5A2D82] hover:bg-purple-50">
          <IoCalendarOutline className="text-black text-lg" size={24} />
        </div>

        {/* Search bar */}
        <div className="relative rounded-xl border border-purple-800 bg-white text-black hover:shadow-[inset_0px_0px_0px_2px_#5A2D82] hover:bg-purple-50">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search here..."
            className="pl-10 pr-12 bg-gray-200 border-0 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      {/* Right side: Add Trip button */}
      <Button
        className="flex items-center gap-2 rounded-xl bg-[#5A2D82] hover:bg-purple-800 text-white"
        onClick={() => router.push("/create-trip")}
      >
        <IoAdd className="text-lg" />
        Add Trip
      </Button>
    </div>
  );
}
