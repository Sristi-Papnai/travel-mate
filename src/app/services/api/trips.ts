
import type { IStandardResponse } from "@/db/types";
import type { CreateTripPayload } from "@/interfaces/openapi";

export const fetchTrips = async ():Promise<IStandardResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    const data = await res.json();
    return data; 
};

export const createTrip = async (
  payload: CreateTripPayload
):Promise<IStandardResponse> => {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data; 
};



