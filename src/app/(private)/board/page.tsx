// app/(private)/board/page.tsx
import BoardClient from "./_components/board-client";
import { Card, CardContent } from "@/components/ui/card";
import type { UserTrips } from "@/interfaces/openapi";
import { fetchUserTrips } from "@/app/actions/trip-actions";

export default async function BoardPage() {
  const trips: UserTrips[] | [] = await fetchUserTrips();

  return (
    <div className="px-6 py-2">
      <Card className="rounded-2xl bg-white shadow-md">
        <CardContent className="p-6">
          {/* Board UI */}
          <BoardClient
            initialCards={trips} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
