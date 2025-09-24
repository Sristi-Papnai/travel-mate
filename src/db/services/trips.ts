import { db } from "@/db/client";
import {
  trips,
  members,
  checklists,
  comments
} from "@/db/schema/postgres";
import type { Trip, UserTrips } from "@/interfaces/openapi";
import { and, eq, inArray } from "drizzle-orm";

export async function findAllTrips(userId: number): Promise<Trip[]> {
    const allTrips = await db.query.trips.findMany({
        with: {
          members: { with: { user: true } },
          checklists: { with: { creator: true, completer: true } },
          files: { with: { user: true } },
          comments: { with: { user: true } },
          savedLocations: { with: { user: true } },
        },
      });
      
      // Filter trips in JS where members include the user
      const userTrips = allTrips.filter(trip =>
        trip.members.some(member => member.userId === userId)
      );

    return userTrips.map((t) => ({
      id: t.id,
      destination: t.destination,
      description: t.description,
      occasion: t.occasion,
      mode_of_transportation: t.mode_of_transportation,
      start_date: t.start_date,
      end_date: t.end_date,
      min_budget: t.min_budget,
      max_budget: t.max_budget,
      budget_per_person: t.budget_per_person,
      status: t.status as "inplanning" | "confirmed" | "completed" | "cancelled",
      members: {
        count: t.members.length,
        users: t.members.map((m) => ({
          id: m.user.id,
          name: `${m.user.firstName} ${m.user.lastName}`,
          email: m.user.email,
        })),
      },
      checklist: t.checklists.map((c) => ({
        id: c.id,
        description: c.description,
        is_completed: c.isCompleted,
        created_by: c.creator
          ? { id: c.creator.id, name: `${c.creator.firstName} ${c.creator.lastName}`, email: c.creator.email }
          : { id: 0, name: "Unknown" },
        completed_by: c.completer
          ? { id: c.completer.id, name: `${c.completer.firstName} ${c.completer.lastName}`, email: c.completer.email }
          : undefined,
        sequence: c.sequence,
      })),
      files: (t.files ?? []).map((f) => ({
        id: f.id,
        file_name: f.fileName,
        file_path: f.filePath,
        file_type: f.fileType,
        created_by: f.user
          ? { id: f.user.id, name: `${f.user.firstName} ${f.user.lastName}`, email: f.user.email ?? undefined }
          : { id: 0, name: "Unknown", email: undefined },
      })),
      comments: t.comments.map((c) => ({
        id: c.id,
        trip_id: t.id,
        data: c.data,
        commented_by: c.user
          ? { id: c.user.id, name: `${c.user.firstName} ${c.user.lastName}`, email: c.user.email }
          : { id: 0, name: "Unknown" },
      })),
      locations: t.savedLocations.map((l) => ({
        id: l.id,
        trip_id: t.id,
        name: l.name,
        longitude: l.longitude,
        latitude: l.latitude,
        added_by: l.user
          ? { id: l.user.id, name: `${l.user.firstName} ${l.user.lastName}`, email: l.user.email }
          : { id: 0, name: "Unknown" },
      })),
    }));
  }

  export async function getTripData(tripId: number): Promise<Trip | null> {
    // Fetch trip with relations
    const tripWithRelations = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, tripId),
      with: {
        members: {
          with: { user: true }, // resolve members -> user
        },
        checklists: {
          with: {
            creator: true,
            completer: true,
          },
        },
        files: { with: { user: true } },
        comments: { with: { user: true } },
        savedLocations: { with: { user: true } },
      },
    });
  
    if (!tripWithRelations) return null;
  
    const trip = tripWithRelations;
  
    return {
      id: trip.id,
      destination: trip.destination,
      description: trip.description,
      occasion: trip.occasion,
      mode_of_transportation: trip.mode_of_transportation,
      start_date: trip.start_date,
      end_date: trip.end_date,
      min_budget: trip.min_budget,
      max_budget: trip.max_budget,
      budget_per_person: trip.budget_per_person,
      status: trip.status as "inplanning" | "confirmed" | "completed" | "cancelled",
      members: {
        count: trip.members.length,
        users: trip.members.map((m) => ({
          id: m.user.id,
          name: `${m.user.firstName} ${m.user.lastName}`,
          email: m.user.email,
        })),
      },
      checklist: trip.checklists.map((c) => ({
        id: c.id,
        description: c.description,
        is_completed: c.isCompleted,
        created_by: c.creator
          ? { id: c.creator.id, name: `${c.creator.firstName} ${c.creator.lastName}`, email: c.creator.email }
          : { id: 0, name: "Unknown" },
        completed_by: c.completer
          ? { id: c.completer.id, name: `${c.completer.firstName} ${c.completer.lastName}`, email: c.completer.email }
          : undefined,
        sequence: c.sequence,
      })),
      files: trip.files.map((f) => ({
        id: f.id,
        file_name: f.fileName,
        file_path: f.filePath,
        file_type: f.fileType,
        created_by: f.user
          ? { id: f.user.id, name: `${f.user.firstName} ${f.user.lastName}`, email: f.user.email ?? undefined }
          : { id: 0, name: "Unknown", email: undefined },
      })),
      comments: trip.comments.map((c) => ({
        id: c.id,
        trip_id: trip.id,
        data: c.data,
        created_at: c.createdAt,
        commented_by: c.user
          ? { id: c.user.id, name: `${c.user.firstName} ${c.user.lastName}`, email: c.user.email }
          : { id: 0, name: "Unknown" },
      })),
      locations: trip.savedLocations.map((l) => ({
        id: l.id,
        trip_id: trip.id,
        name: l.name,
        longitude: l.longitude,
        latitude: l.latitude,
        added_by: l.user
          ? { id: l.user.id, name: `${l.user.firstName} ${l.user.lastName}`, email: l.user.email }
          : { id: 0, name: "Unknown" },
      })),
    };
  };
  
  


  export async function findUserTrips(userId: number): Promise<UserTrips[]> {
    const allTrips = await db.query.trips.findMany({
      with: {
        creator: true,
        members: { with: { user: true } },
        checklists: { with: { creator: true, completer: true } },
      },
    });

    // Filter trips in JS where members include the user
    const userTrips = allTrips.filter(trip =>
      trip.members.some(member => member.userId === userId)
    );

    return userTrips.map((t) => ({
      id: t.id,
      destination: t.destination,
      description: t.description,
      occasion: t.occasion,
      mode_of_transportation: t.mode_of_transportation,
      start_date: t.start_date,
      end_date: t.end_date,
      min_budget: t.min_budget,
      max_budget: t.max_budget,
      budget_per_person: t.budget_per_person,
      status: t.status as "inplanning" | "confirmed" | "completed" | "cancelled",
      members: t.members.length,
      created_by: t.creator
      ? { id: t.creator.id, name: `${t.creator.firstName} ${t.creator.lastName}`, email: t.creator.email }
      : { id: 0, name: "Unknown" },
      checklist: t.checklists.map((c) => ({
        id: c.id,
        description: c.description,
        is_completed: c.isCompleted,
        created_by: c.creator
          ? { id: c.creator.id, name: `${c.creator.firstName} ${c.creator.lastName}`, email: c.creator.email }
          : { id: 0, name: "Unknown" },
        completed_by: c.completer
          ? { id: c.completer.id, name: `${c.completer.firstName} ${c.completer.lastName}`, email: c.completer.email }
          : undefined,
        sequence: c.sequence,
      })),
    }));

  }

  export async function createTrip(body : any) {

      // Insert all data from the request into the DB
      const result = await db.insert(trips).values({
          destination: body.destination,
          description: body.description,
          occasion: body.occasion ?? null,
          mode_of_transportation: body.mode_of_transportation ?? null,
          members: body.members ?? 1,
          start_date: body.start_date ?? null,
          end_date: body.end_date ?? null,
          min_budget: body.min_budget ?? null,
          max_budget: body.max_budget ?? null,
          budget_per_person: body.budget_per_person ?? null,
          status: body.status,
          userId: body.user.id,
        }).returning(); 
    
        const createdTrip = result[0];
        // Insert trip creator into members table
        await db.insert(members).values({
          userId: body.user.id,
          tripId: createdTrip.id,
          roleId: 1, 
        });
    
        return createdTrip;
  }

  export const updateTrip = async (tripId: number, data: any) => {
    try {
      console.log("Data to be saved for trip id " + tripId);
      console.log(data);
  
      // 1. Update trip base fields (excluding checklists)
      const { checklist: incomingChecklists, comments: incomingComments,  ...tripData } = data;
  
      console.log(tripData);
  
      if (Object.keys(tripData).length > 0) {
        await db
          .update(trips)
          .set(tripData)
          .where(eq(trips.id, tripId));
      }

      if (incomingChecklists && Array.isArray(incomingChecklists)) {
  
        // Fetch existing checklist IDs for this trip
        const existingChecklists = await db
          .select()
          .from(checklists)
          .where(eq(checklists.tripId, tripId));
  
        const existingIds = existingChecklists.map((c) => c.id);
        const incomingIds = incomingChecklists.map((c) => c.id).filter(Boolean);
  
        // 2. Delete checklists that exist in DB but not in incoming
        if (existingIds.length > 0) {
          const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
          if (toDelete.length > 0) {
            await db.delete(checklists).where(inArray(checklists.id, toDelete));
            console.log("Deleted checklists with IDs:", toDelete);
          }
        }
  
        // 3. Insert new checklists (those with no id yet)
        const newChecklists = incomingChecklists.filter((c) => !existingIds.includes(c.id));
        if (newChecklists.length > 0) {
          await db.insert(checklists).values(
            newChecklists.map((c) => ({
              tripId,
              description: c.description,
              isCompleted: c.is_completed ?? false,
              userId: c.created_by?.id,
              completedBy: c.completed_by ?? null,
              sequence: c.sequence,
            }))
          );
          console.log("Inserted new checklists:", newChecklists);
        }
  
        // 4. Update existing ones (matching IDs)
        const toUpdate = incomingChecklists.filter((c) => existingIds.includes(c.id));
        for (const checklist of toUpdate) {
          await db
            .update(checklists)
            .set({
              description: checklist.description,
              isCompleted: checklist.is_completed,
              completedBy: checklist.completed_by ?? null,
              sequence: checklist.sequence,
            })
            .where(and(eq(checklists.id, checklist.id), eq(checklists.tripId, tripId)));
          console.log("Updated checklist ID:", checklist.id);
        }
      }


      console.log("here for comments")
      console.log(incomingComments)
      console.log("here for comments type check")
      console.log(Array.isArray(incomingComments))
      if (incomingComments && Array.isArray(incomingComments)) {
        for (const comment of incomingComments) {

            console.log("comment i found ")
            // Insert new comment
            await db.insert(comments).values({
              tripId,
              data: comment.data,
              userId: comment.commented_by.id,
            });
            console.log("comment added to db ")
        }
      }
  
      return true;
    } catch (error) {
      console.error("Error updating trip:", error);
      return false;
    }
  };
  


