'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { createPresignedUpload, deleteTripLocation, deleteTripMember, fetchTripData, getPresignedGetUrl, saveTrip } from '@/app/actions/trip-actions'; 
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import type { ChecklistItem, CreateTripPayload, Trip, User, UserTrips } from '@/interfaces/openapi';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { IoAdd, IoCheckmark, IoClose, IoTrashBinOutline } from 'react-icons/io5';

import CommentsTab from '@/app/(private)/board/_components/comments-tab';
import InviteMemberDialog from '@/app/(private)/board/_components/invite-member-dialog';
import "react-datepicker/dist/react-datepicker.css";
import GoogleMaps from '@/app/(private)/board/_components/google-maps';
import DialogLoader from '@/app/_components/layout/dialog-loader';

const sanitizeTripData = (data: Partial<Trip>): Partial<CreateTripPayload> => ({
  destination: data.destination ?? undefined,
  description: data.description ?? undefined,
  occasion: data.occasion ?? undefined,
  members: data.members?.count ?? undefined,
  start_date: data.start_date ?? undefined,
  end_date: data.end_date ?? undefined,
  min_budget: data.min_budget ?? undefined,
  max_budget: data.max_budget ?? undefined,
  status: data.status,
  user: data.created_by, // assuming you want to keep the same user object
});

export type FileItem = {
  id: number;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  created_by: User;
  uploaded_at: string;
};


export default function EditTripModal({ setCards }: { setCards: React.Dispatch<React.SetStateAction<UserTrips[]>> }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get('trip') ?? null;
  const [formData, setFormData] = useState<Trip | null>(null);
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [loadingTrip] = useState(false); 
  const [savingTrip, setSavingTrip] = useState(false); 

  const [changedData, setChangedData] = useState<Partial<Trip>>({});


  useEffect(() => {
    if (tripId) {
      fetchTrip();
    } else {
      setFormData(null);
    }
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const trip = await fetchTripData(Number(tripId));
      setFormData(trip);
    } catch (err) {
      console.error('Error fetching trip:', err);
    }
  };

  // Generic handler to update formData and changedData
  const updateField = <K extends keyof Trip>(key: K, value: Trip[K]) => {
    // Only update if value is not undefined when key is 'id'
    if (key === "id" && value === undefined) return;
  
    setFormData({ ...formData, [key]: value } as Trip);
    setChangedData({ ...changedData, [key]: value });
  };

  // Checklist handlers
  const toggleChecklistItem = (id: number) => {
    if (!formData?.checklist) return;
    const newChecklist = formData.checklist.map(item =>
      item.id === id ? { ...item, is_completed: !item.is_completed } : item
    );
    updateField('checklist', newChecklist);
  };

  const addChecklistItem = (text: string) => {
    if (!text.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now(),
      description: text,
      is_completed: false,
      created_by: {id: Number(session?.user?.id), name: session?.user?.name ?? '' },
      sequence: formData?.checklist ? formData.checklist.length + 1 : 1,
    };
    updateField('checklist', formData?.checklist ? [...formData.checklist, newItem] : [newItem]);
  };

  // ✅ Delete Checklist Item
  const deleteChecklistItem = (id: number) => {
    if (!formData?.checklist) return;
    const updatedChecklist = formData.checklist.filter((item) => item.id !== id);
    updateField("checklist", updatedChecklist);
  };

  const handleSave = async () => {
    try {
      if (!tripId) throw new Error("Trip ID missing");
      setSavingTrip(true);

      const updatedTrip = await saveTrip(Number(tripId), sanitizeTripData(changedData));
      setCards((prevCards: UserTrips[]) =>
        prevCards.map((card) => {
          if (card.id !== Number(tripId)) return card;
      
          // Extract members count safely
          const membersCount =
            typeof changedData.members === "object"
              ? changedData.members.count
              : changedData.members ?? card.members; // fallback to existing number
      
          return {
            ...card,
            ...changedData,
            members: membersCount, // always a number
          } as UserTrips;
        })
      );
      
      
      console.log("Update response:", updatedTrip);

      handleClose();
    } catch (err) {
      console.error("Error updating trip:", err);
    } finally {
      setSavingTrip(false);
    }
  };


  const handleClose = () => {
    // setOpen(false);
    router.replace('/board'); // remove ?trip param
  };

  // Delete location handler
  const handleDeleteLocation = async (locId: number) => {
    if (!tripId) return;

    try {
      // Update UI immediately
      setFormData((prev) => ({
        ...prev!,
        locations: prev!.locations?.filter((loc) => loc.id !== locId),
      }));

      // Call backend
      await deleteTripLocation(Number(tripId), locId);
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  // Delete member handler
  const handleDeleteMember = async (memberId: number) => {
    if (!tripId) return;

    try {
      // Update UI immediately
      setFormData((prev) => ({
        ...prev!,
        members: {
          ...prev!.members,
          users: prev!.members?.users?.filter((m) => m.id !== memberId),
        },
      }));

      // Call backend
      await deleteTripMember(Number(tripId), memberId);
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };


  if (!formData) return null;

  return (
    <Dialog.Root open={!!tripId} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed editModal top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[80vw] h-[90vh] max-w-9xl z-50 overflow-hidden">
        {/* ✅ Loader Overlays */}
        {(loadingTrip || savingTrip) && <DialogLoader />}
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#48395a]">
            <div className="flex items-center gap-4">

            <Dialog.Title className="text-2xl font-semibold text-gray-800 flex flex-col gap-2">
              {/* Destination Link */}
              <Link href="/board" className="text-white hover:text-[#e5daf2] transition ">
                Trip to {formData.destination}
              </Link>
            </Dialog.Title>
            {/* Status Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-sm flex py-1 px-2 rounded-lg border border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50">
                  {formData.status === 'inplanning' ? 'In Planning' :
                  formData.status === 'confirmed' ? 'Confirmed' :
                  'Completed'}
                  <IoIosArrowDown size={16} className="ml-2 text-black" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="text-sm bg-white rounded-lg border border-purple-300 shadow-md p-2 mt-2 ml-0 text-black">
                {['inplanning', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <DropdownMenu.Item
                    key={status}
                    className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-800 "
                    onSelect={() => updateField('status', status as "inplanning" | "confirmed" | "completed" | "cancelled" )}
                  >
                    {status === 'inplanning' ? 'In Planning' :
                    status === 'confirmed' ? 'Confirmed' :
                    status === 'cancelled' ? 'Cancelled' :'Completed'}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            </div>
            <Dialog.Close asChild>
                <IoClose size={20} color='white' className="hover:text-[#e5daf2] cursor-pointer"/>
            </Dialog.Close>
          </div>

          {/* Main Content */}
          <div className="flex h-full max-h-[calc(100vh-300px)]">
            {/* Left Column */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.destination ?? ""}
                  onChange={(e) => updateField('destination', e.target.value)}
                  className="text-black w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                />

              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description ?? ""}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="text-black w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent resize-none"
                />
              </div>

              {/* Checklist */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Checklist ({formData.checklist?.length || 0})</label>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add new item"
                    className="text-black flex-1 px-3 py-1 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addChecklistItem((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    variant="default"
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('input[placeholder="Add new item"]');
                      if (input) {
                        addChecklistItem(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-purple-800"
                  >
                    <IoAdd size={18} />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.checklist?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.is_completed ? 'bg-[#5A2D82] border-purple-800' : 'border-gray-300'
                        }`}
                      >
                        {item.is_completed && <IoCheckmark size={12} className="text-white" />}
                      </button>
                      <span className={`flex-1 text-sm ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {item.description}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="p-1"
                      >
                        <IoTrashBinOutline size={16} color="red" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <CommentsTab 
                tripId={formData.id} 
                formData={formData} 
                setFormData={setFormData} 
              />

            </div>

            {/* Middle Column */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              {/* Members */}
              <div className="mb-1">
                <div className="flex items-center mb-3 justify-between">
                  
                  <div className="flex items-center gap-2">
                    <InviteMemberDialog tripId={formData.id}/>
                  </div>
                </div>
                <div className=" flex flex-wrap gap-5">

                <div className="mb-6 flex flex-col gap-3">
                {/* Dates Row */}
                <div className="flex flex-wrap gap-3">
                  {/* Start Date */}
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) => updateField("start_date", e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) => updateField("end_date", e.target.value)}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Mode of Transport */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Transport</label>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="text-sm flex w-full justify-between py-2 px-3 rounded-lg border border-gray-300 bg-white text-black hover:border-purple-800 hover:bg-purple-50">
                        {formData.mode_of_transportation || "Select mode"}
                        <IoIosArrowDown size={16} className="ml-2 text-black" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="text-sm bg-white rounded-lg border border-gray-300 shadow-md p-2 mt-2 w-full text-black">
                      {["Flight", "Train", "Car"].map((mode) => (
                        <DropdownMenu.Item
                          key={mode}
                          className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-800"
                          onSelect={() => updateField("mode_of_transportation", mode)}
                        >
                          {mode}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </div>



                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Budget</label>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Budget</label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">₹</span>
                      <input
                        type="number"
                        value={Number(formData.min_budget)}
                        onChange={(e) => updateField('min_budget', Number(e.target.value))}
                        className="text-black flex-1 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Budget</label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">₹</span>
                      <input
                        type="number"
                        value={Number(formData.max_budget)}
                        onChange={(e) => updateField('max_budget', Number(e.target.value))}
                        className="text-black flex-1 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Upload Files</label>

                <input
                  type="file"
                  disabled={uploading}
                  onChange={async (e) => {
                    if (!e.target.files?.length || !tripId) return;
                    const file = e.target.files[0];

                    try {
                      setUploading(true); // start loader

                      // 1️⃣ Get presigned URL
                      const res = await createPresignedUpload(Number(tripId), file.name, file.type);

                      // 2️⃣ Upload to S3
                      await fetch(res.url, {
                        method: "PUT",
                        body: file,
                        headers: { "Content-Type": file.type },
                      });

                      // 3️⃣ Add uploaded file to formData.files
                      const newFile: FileItem = {
                        id: Date.now(),
                        file_name: res.key.split("/").pop() ?? "unknown", // derive from S3 key
                        file_path: res.url.split("?")[0], // this is required by FileItem
                        file_type: "png", // or null if unknown
                        created_by: {
                          id: Number(session?.user?.id) || 0,
                          name: session?.user?.name ?? "Unknown",
                          email: session?.user?.email ?? undefined,
                        },
                        uploaded_at: new Date().toISOString(), // required field
                      };
                      
                      setFormData((prev) => ({
                        ...prev!,
                        files: prev?.files ? [...prev.files, newFile] : [newFile],
                      }));
                      
                    } catch (err) {
                      console.error("Upload failed:", err);
                    } finally {
                      setUploading(false); // stop loader
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-50 file:text-purple-800
                            hover:file:bg-purple-100"
                />

                {/* Loader */}
                {uploading && <div className="mt-2 text-sm text-purple-700">Uploading...</div>}

                {/* Files Table */}
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-purple-800 text-white">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">File Name</th>
                        <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Uploaded By</th>
                      </tr>
                    </thead>
                    <tbody className="bg-purple-50 divide-y divide-gray-200">
                      {(formData.files || []).map((file) => (
                        <tr key={file.id} className="hover:bg-purple-100">
                          <td className="px-4 py-2 text-sm text-gray-700">
                          <button
                            onClick={async () => {
                              const url = await getPresignedGetUrl(file.file_path);
                              window.open(url, "_blank");
                            }}
                            className="hover:underline hover:text-purple-800"
                          >
                            {file.file_name}
                          </button>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-right">{file.created_by.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>

            {/* Right Column - Locations & Map */}
            <div className="w-1/3 p-6 overflow-y-auto">
              <Tabs.Root defaultValue="map" className="mb-4">
                <Tabs.List className="flex border-b border-gray-200">
                  <Tabs.Trigger
                    value="map"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-800 data-[state=active]:text-purple-800"
                  >
                    Map View
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="itinerary"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-800 data-[state=active]:text-purple-800"
                  >
                    Itinerary
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="members"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-800 data-[state=active]:text-purple-800"
                  >
                    Members
                  </Tabs.Trigger>
                </Tabs.List>

                {/* Map View */}
                <Tabs.Content value="map" className="mt-4">
                  <GoogleMaps
                    tripId={Number(tripId)}
                    userId={Number(session?.user?.id ?? 0)}
                    initialLocations={
                      formData.locations?.map(loc => ({
                        id: loc.id,
                        name: loc.name ?? "",
                        latitude: loc.latitude ?? "",
                        longitude: loc.longitude ?? "",
                        added_by: loc.added_by,
                      })) || []
                    }
                    // setFormData={setFormData}
                  />
                </Tabs.Content>



                {/* Itinerary */}
                <Tabs.Content value="itinerary" className="mt-4">
                  <div className="space-y-3">
                    {formData.locations?.length ? (
                      formData.locations.map((loc) => (
                        <div
                          key={loc.id}
                          className="flex items-center justify-between p-3 border rounded-md shadow-sm hover:bg-purple-50 text-black"
                        >
                          <span className="text-sm text-gray-700">{loc.name}</span>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteLocation(loc.id)}
                          >
                            <IoTrashBinOutline size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No saved locations</div>
                    )}
                  </div>
                </Tabs.Content>

                {/* Members */}
                <Tabs.Content value="members" className="mt-4">
                  <div className="space-y-4">
                    {formData.members?.users ? (
                      formData.members.users.map((m) => (
                        <div key={m.id} className="flex items-start justify-between space-x-3 p-3 border rounded-md shadow-sm hover:bg-purple-50">
                          <div className="flex items-center space-x-3">
                            {/* Profile Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                                {m.name?.charAt(0) || 'U'}
                              </div>
                            </div>

                            {/* Member Info */}
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{m.name}</span>
                              <span className="text-xs text-gray-500">{m.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Tag */}
                            {formData.created_by?.id === m.id ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                  Creator
                                </span>
                              ) : (
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteMember(m.id)}
                                >
                                  <IoTrashBinOutline size={16} />
                                </button>
                              )}
                           

                            
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No members</div>
                    )}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>

          </div>

          {/* Footer */}
          <div className="fixed bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 footerDiv w-full">
            <button
              onClick={handleClose}
              className="px-4 py-2 border-purple-800 border-2 text-gray-700 rounded-md hover:bg-purple-50"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-purple-800">
            {savingTrip ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
