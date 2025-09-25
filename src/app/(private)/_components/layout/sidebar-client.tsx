"use client";

import SidebarItem from "@/app/(private)/_components/layout/sidebar-item";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar-context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import {
  IoAirplaneOutline,
  IoBarChartOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoClipboardOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMapOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export default function SidebarClient({ trips }: { trips: string[] }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#1a0236] shadow-lg transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-75"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-purple-700">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={52}
              height={52}
              className="cursor-pointer"
            />
            {!collapsed && (
              <span className="font-semibold text-lg text-white cursor-pointer">
                Travel Mate
              </span>
            )}
          </Link>
        </div>
        <Button
          variant="ghost"
          onClick={toggle}
          className="text-white absolute top-18 -right-3 rounded-full shadow-md bg-[#9109bb] border border-purple-500"
          size="icon"
        >
          {collapsed ? (
            <IoChevronForwardOutline size={20} />
          ) : (
            <IoChevronBackOutline size={20} />
          )}
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col px-3 py-6 text-purple-200 space-y-4">
        <SidebarItem
          icon={<IoHomeOutline size={22} />}
          text="Dashboard"
          href="/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<IoMapOutline size={22} />}
          text="Destinations"
          href="/destinations"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<IoClipboardOutline size={22} />}
          text="Planner Board"
          href="/board"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<IoBarChartOutline size={22} />}
          text="Reports"
          href="/home"
          collapsed={collapsed}
        />

        {/* Trips Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <SidebarItem
                icon={<IoAirplaneOutline size={22} />}
                text="Trips"
                href="/home"
                collapsed={collapsed}
              />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            side="right"
            align="start"
            className="bg-[#34035f] rounded-xl shadow-xl max-h-60 w-48 text-white overflow-y-auto p-2"
          >
            {trips.map((trip, i) => (
              <DropdownMenu.Item
                key={i}
                className="px-3 py-2 text-sm rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                {trip}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <SidebarItem
          icon={<IoSettingsOutline size={22} />}
          text="Settings"
          href="/home"
          collapsed={collapsed}
        />
      </nav>

      {/* Bottom Menu */}
      <div className="absolute bottom-10 w-full flex flex-col px-3 py-6 text-purple-200 space-y-4">
        <SidebarItem
          icon={<IoLogOutOutline size={22} />}
          text="Log Out"
          href="/home"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
