'use client';

import type { Trip } from '@/interfaces/openapi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { IoBriefcase, IoCalendar, IoCash, IoPeople, IoPersonCircle } from 'react-icons/io5';

interface CardProps {
  card: Trip
}

export default function Card({ card }: CardProps) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 0 : 'auto',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when dragging
    if (isDragging) return;
    e.preventDefault();
    router.push(`/board?trip=${card.id}`);
  };

  function formatTripDates(startDate: string, endDate: string) {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
  
    const start = new Date(startDate).toLocaleDateString("en-US", options);
    const end = new Date(endDate).toLocaleDateString("en-US", options);
  
    return `${start} - ${end}`;
  }

  function calculateProgress(checklist: { is_completed: boolean }[]) {
    if (!checklist || checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.is_completed).length;
    return Math.round((completed / checklist.length) * 100);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 rounded-lg shadow-lg bg-white text-black w-72 border hover:border-2 border-purple-800"
    >
      {/* Drag handle area */}
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        {/* Clickable area for navigation */}
        <div 
          onClick={handleCardClick}
          className="cursor-pointer"
        >
    <h3 className="inline-block bg-pink-200 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
      {card.destination}
    </h3>


      <div className="mt-2 space-y-1 text-gray-600 text-sm">
        <div className="flex justify-between items-center">
          <div className='flex justify-between items-center gap-2'>
            <IoPeople className="text-gray-500" />
            <span>{card.members.count}</span>
          </div>
          <div className='flex justify-between items-center gap-2'>
            <IoBriefcase className="text-gray-500 ml-2" />
            <span>{card.occasion}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IoCalendar className="text-gray-500" />
          <span>{formatTripDates(card.start_date, card.end_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <IoCash className="text-gray-500" />
          <span>{card.min_budget}</span>
        </div>
      </div>

      {card.checklist !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-[#1a0236] rounded"
              style={{ width: `${calculateProgress(card.checklist)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <IoPersonCircle className="text-gray-500 text-xl" />
      </div>
        </div>
      </div>
    </div>
  );
}
