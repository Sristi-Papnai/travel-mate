// app/dashboard/page.tsx
import RightSectionCards from "@/app/(private)/_components/dashboard/RightSectionCards";
import { Card } from "@/components/ui/card";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="px-6 py-2">
       <Card className="rounded-2xl bg-white-600 shadow-md h-[90vh] overflow-y-auto  text-black">
        <RightSectionCards />
      </Card>
  </div>
  );
}
