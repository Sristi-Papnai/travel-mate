// app/(private)/board/page.tsx
import BoardHeader from "@/app/(private)/board/_components/board-header";
import { fetchTrips } from "@/app/services/api/trips";
import { Card, CardContent } from "@/components/ui/card";
import BoardClient from "./_components/board-client";

interface BoardPageProps {
  searchParams?: { trip?: string };
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  // Handle undefined searchParams
  const safeSearchParams = searchParams || {};
  const trips = await fetchTrips();

  return (
    <div className="px-6 py-2">
      <Card className="rounded-2xl bg-white shadow-md">
        <CardContent className="p-6">
          {/* Header row */}
          <BoardHeader />

          {/* Board UI */}
          <BoardClient initialCards={trips} searchParams={safeSearchParams} />
        </CardContent>
      </Card>
    </div>
  );
}
