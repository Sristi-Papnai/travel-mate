"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { IoCalendarOutline, IoNotificationsOutline, IoPersonCircleOutline } from "react-icons/io5";

export default function NavbarClient() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "home";
  const dynamicTitle = decodeURIComponent(lastSegment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <>
      {/* Left - Hamburger */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 justify-center">
            <h1 className="text-lg font-semibold text-gray-800">{dynamicTitle}</h1>
        </div>
      </div>

      {/* Right - Icons + Profile */}
      <div className="flex items-center gap-3">
        <IoNotificationsOutline size={20} color="black" />

        <IoCalendarOutline size={20} color="black" />

        <span className="text-black mx-2 text-2xl">|</span>

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div
                className="flex items-center gap-2 rounded-full py-1 "
                >
                <IoPersonCircleOutline size={40} className="text-gray-600" />
                <span className="text-md font-medium text-black">Sristi</span>
                <IoIosArrowDown size={20} className="text-gray-600"/>
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            sideOffset={5}
            className="min-w-[150px] rounded-md bg-white shadow-lg border border-gray-200 p-2 text-sm text-black"
          >
            <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
            <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-red-500">
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </>
  );
}
