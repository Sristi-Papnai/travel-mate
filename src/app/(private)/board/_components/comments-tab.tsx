'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { IoHappy, IoImage } from "react-icons/io5";
import type { Trip, CommentItem } from "@/interfaces/openapi";
import { saveTrip } from "@/app/actions/trip-actions";
import { useSession } from "next-auth/react";

interface CommentsTabProps {
  tripId: number;
  formData: Trip;
  setFormData: (data: Trip) => void;
}

export default function CommentsTab({ tripId, formData, setFormData }: CommentsTabProps) {
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();


  const handleCancel = () => {
    setNewComment("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!newComment.trim()) return;
    setSaving(true);

    try {
      // Call server action to save comment
      if (!session?.user?.id) return; // don’t save if no user ID

        const newCommentItem: CommentItem = {
          id: Date.now(),
          trip_id: tripId,
          data: newComment,
          commented_by: {
            id: Number(session.user.id),
            name: session.user.name || "Unknown",
            email: session.user.email || "",
          },
          created_at: new Date().toISOString()
      };
      console.log(newCommentItem)
      // Optionally you can call saveTrip with a structure like:
      const updateDbComment = await saveTrip(tripId, {
        comments: [newCommentItem], 
      } as any);

      // Update UI immediately
      if(updateDbComment){
        setFormData({
          ...formData,
          comments: [...(formData.comments || []), newCommentItem],
        });
  
        setNewComment("");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error saving comment:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tabs.Root defaultValue="comments" className="mt-6 mb-6">
      <Tabs.List className="flex border-b border-gray-200">
        <Tabs.Trigger
          value="comments"
          className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-800"
        >
          Comments
        </Tabs.Trigger>
        <Tabs.Trigger
          value="history"
          className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-800"
        >
          History
        </Tabs.Trigger>
      </Tabs.List>

      {/* COMMENTS CONTENT */}
      <Tabs.Content value="comments" className="mt-4">
        {/* Existing comments */}
        <div className="text-sm text-gray-500 mb-4 space-y-2">
        {formData.comments?.length ? (
          formData.comments.map((c) => (
            <div key={c.id} className="flex items-start space-x-3 mb-4">
              {/* Profile Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                  {c.commented_by?.name?.charAt(0) || "U"}
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                {/* Name + Date */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{c.commented_by?.name}</span>
                  <span className="text-xs text-gray-500">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                  </span>
                </div>

                {/* Comment Box */}
                <div className="mt-2 bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
                  {c.data}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">There are no comments for this trip yet.</div>
        )}

        </div>

        {/* New comment input */}
        <div className="space-y-3">
          <textarea
            placeholder="Type your comment here"
            className="text-black w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent resize-none"
            rows={3}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setIsEditing(!!e.target.value);
            }}
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

            {/* Save & Cancel */}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
                  disabled={saving}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="history" className="mt-4">
        <div className="text-sm text-gray-500">Trip history will be displayed here.</div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
