"use server"; 

import { authOptions } from "@/app/_libs/utils/auth";
import { findUserTrips, getTripAnalytics, getTripData, inviteMembersService, saveTripFiles, saveTripLocations, updateTrip } from "@/db/services/trips";
import type { CommentItem, CreateTripPayload, InviteMembersPayload, Trip, UserTrips } from "@/interfaces/openapi";
import { getServerSession } from "next-auth";
import { files, members, savedLocations } from "@/db/schema/postgres";
import { GetObjectCommandService, getPresignedUrl } from "@/app/services/S3/s3-service";
import { db } from "@/db/client";
import { and, eq, inArray } from "drizzle-orm";



async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}


export async function saveTrip(tripId: number, data: Partial<CreateTripPayload> | CommentItem) {
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
  const session = await getServerSession(authOptions);
  if (!session) return null;
  // Call your function with the user ID
  const trip = await getTripData(Number(tripId),  session?.user?.id);

  return trip;
}

export async function inviteMembersAction({ tripId, emails }: InviteMembersPayload) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, msg: "Not authenticated" };

  const inviterName = session.user?.name || "Admin";

  const members = await inviteMembersService({ tripId, emails, inviterName });

  return { success: true, msg: "Invites sent", members: members };
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
  export async function getPresignedGetUrl(key: string | null) {

    if(key){
      const url = GetObjectCommandService(key);
      return url;
    }else{
      return '/';
    }

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

    const inserted = await saveTripLocations( 
       { 
        tripId,
        name,
        latitude,
        longitude,
        userId
      }
      );

  
    return inserted;
  }



  // Delete location from DB
export async function deleteTripLocation(tripId: number, locationId: number) {
  await db.delete(savedLocations).where(
    and(eq(savedLocations.tripId, tripId), eq(savedLocations.id, locationId))
  );
  return true;
}

// Delete member from DB
export async function deleteTripMember(tripId: number, memberId: number) {
  await db.delete(members).where(
    and(eq(members.tripId, tripId), eq(members.userId, memberId))
  );
  return true;
}

export async function tripAnalytics() {
  const session = await getSession(); 
  if(!session)
  return {success: false};

  const result = await getTripAnalytics(session?.user?.id);
  return {success: true, trip_details: result};
}



