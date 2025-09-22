// lib/fakeApi.js (or trips.ts if migrated)

export const HARD_CODED_TRIPS = [
  {
    id: 1,
    destination: "Dubai",
    description: "Dubai",
    occasion: "Business",
    mode_of_transportation: "Bus",
    members: {
      count: 6,
      users: [
        { id: 1, name: "MK" },
        { id: 2, name: "SB" },
        { id: 3, name: "JP" },
      ],
    },
    start_date: "2025-12-23",
    end_date: "2025-12-30",
    min_budget: 50000,
    max_budget: 80000,
    budget_per_person: 60000,
    status: "inplanning",
    locations: [],
    checklist: [
      {
        id: 1,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 2,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 3,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 4,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 5,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 6,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 7,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 8,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
      {
        id: 9,
        description: "Passport",
        is_completed: true,
        created_by: { id: 1, name: "MK" },
        completed_by: { id: 2, name: "SB" },
        sequence: 1,
      },
    ],
    files: [
      {
        id: 1,
        file_name: "itinerary.pdf",
        filepath: "/uploads/itinerary.pdf",
        file_type: "pdf",
      },
    ],
    comments: [
      {
        id: 1,
        trip_id: 1,
        data: "Looking forward to the trip!",
        commented_by: { id: 3, name: "JP" },
      },
    ],
  },
  {
    id: 2,
    destination: "Bali",
    occasion: "Leisure",
    mode_of_transportation: null,
    members: {
      count: 2,
      users: [
        { id: 4, name: "AA" },
        { id: 5, name: "BT" },
      ],
    },
    start_date: "2025-12-23",
    end_date: "2025-12-30",
    min_budget: 40000,
    max_budget: 70000,
    budget_per_person: 60000,
    status: "inplanning",
    checklist: [],
    files: [],
    comments: [],
    locations: [],
  },
];
  
export async function fetchTrips() {
  return Promise.resolve(HARD_CODED_TRIPS);
}
