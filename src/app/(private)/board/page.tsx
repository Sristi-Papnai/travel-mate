// app/(private)/board/page.tsx
import BoardClient from "./_components/board-client";
import { Card, CardContent } from "@/components/ui/card";
import type { Trip, UserTrips } from "@/interfaces/openapi";
import { fetchUserTrips, fetchTripData } from "@/app/actions/trip-actions";

interface BoardPageProps {
  searchParams?: { trip?: string };
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const safeSearchParams = searchParams || {};


  let selectedTrip: Trip | null = null;
  const trips = await fetchUserTrips();

  try {
    if (safeSearchParams.trip) {
      // Fetch selected trip details
      selectedTrip = await fetchTripData(Number(safeSearchParams.trip));
    } 
  } catch (err) {
    console.error("Failed to fetch trips:", err);
  }

  console.log("data for selectedTrip")
  console.log(selectedTrip)
  console.log("data for trips")
  console.log(trips)

  return (
    <div className="px-6 py-2">
      <Card className="rounded-2xl bg-white shadow-md">
        <CardContent className="p-6">
          {/* Board UI */}
          <BoardClient
            initialCards={trips} 
            searchParams={safeSearchParams}
            selectedTrip={selectedTrip} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
