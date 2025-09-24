"use server"; 

import { authOptions } from "@/app/_libs/utils/auth";
import { findUserTrips, getTripData, updateTrip } from "@/db/services/trips";
import type { CommentItem, CreateTripPayload, Trip, UserTrips } from "@/interfaces/openapi";
import { getServerSession } from "next-auth";


async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}


export async function saveTrip(tripId: number, data: CreateTripPayload | CommentItem) {
  if (!tripId) throw new Error("Trip ID missing");
  const updated = await updateTrip(tripId, data);
  return updated;
}

export async function fetchUserTrips(): Promise<UserTrips[]> {
  // Get current server session
  const session = await getSession(); 

  if(!session)
  return [];

  // Call your function with the user ID
  const trips = await findUserTrips(Number(session?.user?.id));

  return trips;
}

export async function fetchTripData(tripId : number): Promise<Trip | null> {

  // Call your function with the user ID
  const trip = await getTripData(Number(tripId));

  return trip;
}

