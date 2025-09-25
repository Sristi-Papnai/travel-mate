'use client';

import { Button } from '@/components/ui/button';
import type { Trip, ChecklistItem } from '@/interfaces/openapi';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoAdd, IoCalendar, IoCheckmark, IoClose, IoHappy, IoImage, IoSearch, IoTrash, IoTrashBinOutline } from 'react-icons/io5';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoIosArrowDown } from 'react-icons/io';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface EditTripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}


export default function EditTripModal({ trip, isOpen, onClose }: EditTripModalProps) {
  // Main form data state
  const [formData, setFormData] = useState<Trip | null>(null);

  // Object to track only changed values
  const [changedData, setChangedData] = useState<Partial<Trip>>({});

  useEffect(() => {
    if (trip) {
      setFormData(trip);
      setChangedData({});
    }
  }, [trip]);

  if (!formData) return null;

  // Generic handler to update formData and changedData
  const updateField = <K extends keyof Trip>(key: K, value: Trip[K]) => {
    setFormData({ ...formData, [key]: value });
    setChangedData({ ...changedData, [key]: value });
  };

  // Checklist handlers
  const toggleChecklistItem = (id: number) => {
    if (!formData.checklist) return;
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
      created_by: { id: 0, name: 'You' },
      sequence: formData.checklist ? formData.checklist.length + 1 : 1,
    };
    updateField('checklist', formData.checklist ? [...formData.checklist, newItem] : [newItem]);
  };

  // ✅ Delete Checklist Item
  const deleteChecklistItem = (id: number) => {
    if (!formData.checklist) return;
    const updatedChecklist = formData.checklist.filter((item) => item.id !== id);
    updateField("checklist", updatedChecklist);
  };


  // Destination handlers
  const addDestination = (name: string) => {
    if (!name.trim()) return;
    const newLocations = [...(formData?.locations || []), { id: Date.now(), name }];
    updateField('locations' as any, newLocations);
  };

  const removeDestination = (id: number) => {
    const newLocations = (formData?.locations || []).filter(loc => loc.id !== id);
    updateField('locations' as any, newLocations);
  };

  // Save button
  const handleSave = () => {
    console.log('Changed Data to send to backend:', changedData);
    // Send `changedData` to backend via API call
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed editModal top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[80vw] h-[90vh] max-w-9xl z-50 overflow-hidden">
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
                {['inplanning', 'confirmed', 'completed'].map((status) => (
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
                  value={formData.destination}
                  onChange={(e) => updateField('destination', e.target.value)}
                  className=" text-black w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
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

              {/* Comments/History Tabs */}
              <Tabs.Root defaultValue="comments" className="mt-6 mb-6">
                <Tabs.List className="flex border-b border-gray-200">
                  <Tabs.Trigger value="comments" className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-800">
                    Comments
                  </Tabs.Trigger>
                  <Tabs.Trigger value="history" className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-800">
                    History
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="comments" className="mt-4">
                  <div className="text-sm text-gray-500 mb-4">
                    {formData.comments?.length ? 'Comments for this trip:' : 'There is no comments for this trip yet.'}
                  </div>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Type your comment here"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <IoHappy size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <IoImage size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="history" className="mt-4">
                  <div className="text-sm text-gray-500">Trip history will be displayed here.</div>
                </Tabs.Content>
              </Tabs.Root>
            </div>

            {/* Middle Column */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              {/* Members */}
              <div className="mb-1">
                <div className="flex items-center mb-3 justify-between">
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-[#5A2D82] text-white text-sm rounded-md hover:bg-purple-800">
                      Invite Member
                    </button>
                  </div>
                </div>
                <div className=" flex flex-wrap gap-5">

                  {/* Travel Dates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        selectsRange
                        startDate={formData?.start_date ? new Date(formData.start_date) : null}
                        endDate={formData?.end_date ? new Date(formData.end_date) : null}
                        onChange={(update: [Date | null, Date | null]) => {
                          if (!update) return;
                          const [start, end] = update;
                          updateField("start_date", start ? start.toISOString().split("T")[0] : "");
                          updateField("end_date", end ? end.toISOString().split("T")[0] : "");
                        }}
                        placeholderText="Select start and end date"
                        className="text-black lg:w-[220px] w-full flex-1 px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                      />
                      <IoCalendar size={16} className="text-gray-500" />
                    </div>
                  </div>

                  {/* Mode of Transport */}
                  <div className="mb-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Mode of Transport</label>
                    <div className="mb-6 w-full">
                    {/* <label className="text-sm font-medium text-gray-700 mb-2 block">Mode of Transport</label> */}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="text-sm flex w-full justify-between py-2 px-3 rounded-lg border border-purple-300 hover:border-purple-800 bg-white text-black hover:border-2 hover:bg-purple-50">
                          {formData?.mode_of_transportation === 'Flight' ? 'Flight' :
                          formData?.mode_of_transportation === 'Train' ? 'Train' :
                          'Car'}
                          <IoIosArrowDown size={16} className="ml-2 text-black" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content className="text-sm bg-white rounded-lg border border-purple-300 shadow-md p-2 mt-2 w-full text-black">
                        {['Flight', 'Train', 'Car'].map((mode) => (
                          <DropdownMenu.Item
                            key={mode}
                            className="cursor-pointer rounded px-3 py-2 hover:bg-purple-50 hover:border hover:border-purple-800"
                            onSelect={() => updateField('mode_of_transportation', mode)}
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
                        value={formData.min_budget}
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
                        value={formData.max_budget}
                        onChange={(e) => updateField('max_budget', Number(e.target.value))}
                        className="text-black flex-1 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Locations & Map */}
            <div className="w-1/3 p-6 overflow-y-auto">
              <Tabs.Root defaultValue="map" className="mb-4">
                <Tabs.List className="flex border-b border-gray-200">
                  <Tabs.Trigger value="map" className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-800 data-[state=active]:text-purple-800">
                    Map View
                  </Tabs.Trigger>
                  <Tabs.Trigger value="members" className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-800 data-[state=active]:text-purple-800">
                    Members
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="map" className="mt-4">
                  {/* Locations */}
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 relative">
                        <IoSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Find a place..."
                          className="w-full pl-10 pr-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addDestination((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const input = document.querySelector<HTMLInputElement>('input[placeholder="Find a place..."]');
                          if (input) {
                            addDestination(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-3 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-purple-800"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.locations || []).map(dest => (
                        <div key={dest.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                          <span className="text-sm text-gray-700">{dest.name}</span>
                          <button onClick={() => removeDestination(dest.id)} className="p-1 hover:bg-gray-100 rounded text-red-500">
                            <IoTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                    <div className="text-center text-gray-500">
                      <div className="text-sm">Map View</div>
                      <div className="text-xs mt-1">Interactive map will be displayed here</div>
                    </div>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="members" className="mt-4">
                  <div className="text-sm text-gray-500">Members view will be displayed here.</div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>

          {/* Footer */}
          <div className="fixed bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 footerDiv w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-purple-800 border-2 text-gray-700 rounded-md hover:bg-purple-50"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-purple-800">
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
