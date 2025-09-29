"use server"; 

import { authOptions } from "@/app/_libs/utils/auth";
import { findUserTrips, getTripData, inviteMembersService, saveTripFiles, updateTrip } from "@/db/services/trips";
import type { CommentItem, CreateTripPayload, InviteMembersPayload, Trip, UserTrips } from "@/interfaces/openapi";
import { getServerSession } from "next-auth";
import { files, savedLocations } from "@/db/schema/postgres";
import { getPresignedUrl } from "@/app/services/S3/s3-service";
import { db } from "@/db/client";
import { and, eq, inArray } from "drizzle-orm";



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

export async function inviteMembersAction({ tripId, emails }: InviteMembersPayload) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, msg: "Not authenticated" };

  const inviterName = session.user?.name || "Admin";

  const invitedEmails = await inviteMembersService({ tripId, emails, inviterName });

  return { success: true, msg: "Invites sent", invited: invitedEmails };
}


  export async function createPresignedUpload(tripId: number, fileName: string, fileType: string) {

    const key = `trips/${tripId}/${Date.now()}-${fileName}`;


    const url = await getPresignedUrl(key, fileType);
    const session = await getServerSession(authOptions);

    const res =  await saveTripFiles({
      tripId: tripId,
      fileName: fileName,
      filePath: key,
      fileType: fileType,
      userId: session?.user?.id,
    });


      return { url, key };

  }


  export async function fetchTripFiles(tripId: number) {

    // return await db.select().from(files).where(files.tripId.eq(tripId));
    return [];

  }

  export async function saveLocationAction({
    tripId,
    name,
    latitude,
    longitude,
    userId,
  }: {
    tripId: number;
    name: string;
    latitude: string;
    longitude: string;
    userId: number;
  }) {
    const inserted = await db.insert(savedLocations).values({
      tripId,
      name,
      latitude,
      longitude,
      userId,
    }).returning();
  
    return inserted[0];
  }
  
  export async function getSavedLocations(tripId: number) {
    return await db.select().from(savedLocations).where(eq(tripId, tripId));
  }

