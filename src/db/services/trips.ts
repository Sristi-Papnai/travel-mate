import { sendEmail } from "@/app/services/mail/send-mail";
import { db } from "@/db/client";
import {
  trips,
  members,
  checklists,
  comments,
  users,
  files,
  savedLocations
} from "@/db/schema/postgres";
import type { InviteMembersInput, Trip, TripAnalytics, UserTrips } from "@/interfaces/openapi";
import { and, eq, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";


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
        uploaded_at: f.uploadedAt,
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

  export async function getTripData(tripId: number, userId: number): Promise<Trip | null> {
    // Fetch trip with relations
    const tripWithRelations = await db.query.trips.findFirst({
      where: (trip, { eq, exists, and }) =>
        and(
          eq(trip.id, tripId),
          exists(
            db
              .select()
              .from(members)
              .where(
                and(
                  eq(members.tripId, trip.id),
                  eq(members.userId, userId)
                )
              )
          )
        ),
      with: {
        members: {
          with: { user: true },
        },
        checklists: {
          with: {
            creator: true,
            completer: true,
          },
        },
        creator: true,
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
      created_by: trip.creator
      ? { id: trip.creator.id, name: `${trip.creator.firstName} ${trip.creator.lastName}`, email: trip.creator.email }
      : { id: 0, name: "Unknown" },
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
        uploaded_at: f.uploadedAt,
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
        // files: { with: { user: true } },
        // comments: { with: { user: true } },
        // savedLocations: { with: { user: true } },
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
      // files: t.files.map((f) => ({
      //   id: f.id,
      //   file_name: f.fileName,
      //   file_path: f.filePath,
      //   file_type: f.fileType,
      // uploaded_at: f.uploadedAt,
      //   created_by: f.user
      //     ? { id: f.user.id, name: `${f.user.firstName} ${f.user.lastName}`, email: f.user.email ?? undefined }
      //     : { id: 0, name: "Unknown", email: undefined },
      // })),
      // comments: t.comments.map((c) => ({
      //   id: c.id,
      //   trip_id: t.id,
      //   data: c.data,
      //   created_at: c.createdAt,
      //   commented_by: c.user
      //     ? { id: c.user.id, name: `${c.user.firstName} ${c.user.lastName}`, email: c.user.email }
      //     : { id: 0, name: "Unknown" },
      // })),
      // locations: t.savedLocations.map((l) => ({
      //   id: l.id,
      //   trip_id: t.id,
      //   name: l.name,
      //   longitude: l.longitude,
      //   latitude: l.latitude,
      //   added_by: l.user
      //     ? { id: l.user.id, name: `${l.user.firstName} ${l.user.lastName}`, email: l.user.email }
      //     : { id: 0, name: "Unknown" },
      // })),
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

  export async function inviteMembersService({ tripId, emails, inviterName }: InviteMembersInput) {
    // 0️⃣ Sanity checks
    if (!tripId || emails.length === 0) return [];

    // Ensure tripId is a number
    if (typeof tripId === "object" && tripId?.tripId) tripId = tripId.tripId;

    console.log("inviteMembersService")
    console.log("tripId")
    console.log(tripId)

    // 1️⃣ Fetch existing users
    const existingUsers = await db.select().from(users).where(inArray(users.email, emails));
    const existingEmails = existingUsers.map(u => u.email);

    // 2️⃣ Create missing users
    const newUsersData = emails
      .filter(email => !existingEmails.includes(email))
      .map(email => {
        const [first, last] = email.split("@")[0].split(".");
        const password = Math.random().toString(36).slice(-8);
        return {
          firstName: first?.charAt(0).toUpperCase() + (first?.slice(1) || ""),
          lastName: last?.charAt(0).toUpperCase() + (last?.slice(1) || ""),
          email,
          password: bcrypt.hashSync(password, 10),
          plainPassword: password,
        };
      });

    let newUsers: (typeof newUsersData[0] & { id: number })[] = [];
    if (newUsersData.length > 0) {
      const inserted = await db.insert(users).values(
        newUsersData.map(u => ({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          password: u.password,
        }))
      ).returning();

      newUsers = inserted.map((u, i) => ({ ...u, plainPassword: newUsersData[i].plainPassword }));
    }



    const allUsers = [...existingUsers, ...newUsers];

    // 3️⃣ Fetch existing trip members
    let existingMembers: { userId: number }[] = [];
    if (allUsers.length > 0) {
      existingMembers = await db.select().from(members).where(
        and(
          eq(members.tripId, tripId),
          inArray(members.userId, allUsers.map(u => u.id))
        )
      );
    }
    const existingMemberUserIds = existingMembers.map(m => m.userId);

    // 4️⃣ Add new members
    const membersToInsert = allUsers.filter(u => !existingMemberUserIds.includes(u.id));

    console.log("membersToInsert")
    console.log(membersToInsert)
    if (membersToInsert.length > 0) {
      await db.insert(members).values(
        membersToInsert.map(u => ({
          userId: u.id,
          tripId,
          roleId: 2, // normal member
        }))
      );
    }

    // 5️⃣ Fetch trip details once
    const trip = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1).then(r => r[0]);
    if (!trip) return [];

    // 6️⃣ Send invite emails
    for (const user of membersToInsert) {
      try {
        const mail = await sendEmail({
          to: user.email,
          subject: `Travel Mate: You have been invited to trip to - ${trip.destination}`,
          htmlContent : user.plainPassword
                ? `
                  <h2>Hello ${user.firstName}!</h2>
                  <p>${inviterName} invited you to join the trip on Travel Mate: <strong>${trip.destination}</strong></p>
                  <p>Your login credentials:</p>
                  <p>Email: ${user.email}</p>
                  <p>Password: ${user.plainPassword}</p>
                  <p>Please login and update your password.</p>
                `
                : `
                  <h2>Hello ${user.firstName}!</h2>
                  <p>${inviterName} invited you to join the trip on Travel Mate: <strong>${trip.destination}</strong></p>
                  <p>You already have an account. Welcome!</p>
                `
                });

        if (!mail.success) {
          console.error(`Failed to send invite email to ${user.email}`);
        }
      } catch (err) {
        console.error(`Error sending invite to ${user.email}:`, err);
      }
    }

    // 7️⃣ Return all members
    const tripMembers = await db.query.members.findMany({
      where: eq(members.tripId, tripId),
      with: { user: true },
    });
  
    // Format response
    const formattedMembers = {
      count: tripMembers.length,
      users: tripMembers.map((m) => ({
        id: m.user.id,
        name: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
      })),
    };
  
    return formattedMembers;
  }

  export async function saveTripFiles(data){
    await db.insert(files).values(data);
  }

  export async function saveTripLocations({
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
  }){

    try{
      const inserted = await db.insert(savedLocations).values({
       tripId,
       name,
       latitude,
       longitude,
       userId,
     }).returning();

     console.log("inserted location ")
     console.log(inserted)

     const location = await db.query.savedLocations.findFirst({
      where: eq(savedLocations.id, inserted[0].id),
      with: { user: true },
    });
  
    // Format as desired
    const new_location = {
      id: location.id,
      trip_id: location.tripId,
      name: location.name,
      longitude: location.longitude,
      latitude: location.latitude,
      added_by: location.user
        ? {
            id: location.user.id,
            name: `${location.user.firstName} ${location.user.lastName}`,
            email: location.user.email,
          }
        : { id: 0, name: "Unknown" },
    };
  
     return {success: true, msg:"Location saved!", new_location: new_location};
    }
    catch (error) {
      console.log("Error in saving location")
      console.log(error)
      return  {success: false, msg :"Error in saving location"};
    }

  }

  export async function getTripAnalytics(userId: number): Promise<TripAnalytics> {
    const userTrips = await db.query.trips.findMany({
      where: (trips, { exists, eq, and }) =>
        exists(
          db
            .select()
            .from(members)
            .where(
              and(eq(members.tripId, trips.id), eq(members.userId, userId))
            )
        ),
      with: {
        members: true,
      },
    });
  
    const statusMeta: Record<string, { color: string }> = {
      completed: { color: "#34D399" },
      inplanning: { color: "#87CEEB" },
      confirmed: { color: "#FBBF24" },
      cancelled: { color: "#EF4444" },
    };
  
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ];
    const currentMonthIndex = new Date().getMonth();
  
    // Initialize accumulators
    const statusCounts: Record<string, number> = {};
    const monthlySpends: number[] = new Array(12).fill(0);
  
    for (const trip of userTrips) {
      // ---- Status Count ----
      if (trip.status in statusMeta) {
        statusCounts[trip.status] = (statusCounts[trip.status] || 0) + 1;
      }
  
      // ---- Trip Spends (Completed only) ----
      if (trip.status === "completed" && trip.min_budget != null) {
        const spendPerPerson = trip.min_budget / (trip.members.length || 1);
        let monthIndex: number;
  
        if (trip.start_date) {
          monthIndex = new Date(trip.start_date as unknown as string).getMonth();
        } else {
          monthIndex = (currentMonthIndex + 1) % 12;
        }
  
        monthlySpends[monthIndex] += spendPerPerson;
      }
    }
  
    // Construct the final response in one go
    const result: TripAnalytics = {
      status_count: Object.keys(statusMeta).map((status) => ({
        name: status,
        value: statusCounts[status] || 0,
        color: statusMeta[status].color,
      })),
      total_trips: userTrips.length,
      trip_spends: months.map((month, i) => ({
        month,
        spend: Math.round(monthlySpends[i]),
      })),
    };
  
    return result;
  }


