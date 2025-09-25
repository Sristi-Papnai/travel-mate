"use client";

import Sidebar from "@/app/(private)/_components/layout/sidebar";
import Navbar from "@/app/(private)/_components/layout/navbar";
import { useSidebar } from "@/context/sidebar-context";

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-75"
        } bg-[#f5f1f6]`}
      >
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
