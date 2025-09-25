"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UrlObject } from "url";

export default function SidebarItem({
  icon,
  text,
  collapsed,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  href: string | UrlObject;
}) {
  const pathname = usePathname();

  // Convert href to string for comparison
  const hrefString =
    typeof href === "string"
      ? href
      : (href as UrlObject).pathname || "/";

  const isActive = pathname.startsWith(hrefString);

  return (
    <Link href={href as any} className="w-full">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all
        ${
          isActive
            ? "bg-[#5A2D82] text-white"
            : "hover:bg-[#5A2D82] hover:text-white text-purple-200"
        }`}
      >
        {icon}
        {!collapsed && <span className="text-sm font-medium">{text}</span>}
      </div>
    </Link>
  );
}
