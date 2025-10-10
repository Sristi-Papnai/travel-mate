import { NextResponse } from "next/server";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import { createTrip } from "@/db/services/trips";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const trip = await createTrip(body);

    return NextResponse.json(
      getSuccessResponse("Trip created successfully", {
        trip: trip
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating trip:", err);
    return NextResponse.json(
      getErrorResponse({ trip: "Failed to create trip" }),
      { status: 404 }
    );
  }
}
