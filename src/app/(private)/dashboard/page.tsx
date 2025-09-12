// app/dashboard/page.tsx
import React from "react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>

        {/* blank content area - add your widgets / routes here */}
        <div className="mt-6 p-6 rounded-lg border border-dashed border-gray-200 bg-white">
          {/* empty for now */}
        </div>
      </div>
    </main>
  );
}
