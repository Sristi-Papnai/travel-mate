'use client';

import Card from '@/app/(private)/board/_components/card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { IoAdd } from 'react-icons/io5';

export default function Column({ id, column, cards }) {
  const columnNames = {
    inplanning: 'In Planning',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4  flex flex-col h-full text-black shadow-lg`}
      style={{ outline: isOver ? '2px dashed rgba(99,102,241,0.15)' : undefined }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-600">{columnNames[column]}</h2>
          {/* Circular badge for number of cards */}
          <div className="w-6 h-6 bg-[#1a0236] text-purple-200 rounded-full flex items-center justify-center text-sm font-medium">
            {cards.length}
          </div>
        </div>

        {/* Gray circular plus button */}
        <button className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-400 transition-colors">
          <IoAdd size={16} />
        </button>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          className="flex flex-col gap-4 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
