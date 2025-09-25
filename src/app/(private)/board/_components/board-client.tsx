'use client';

import BoardHeader from '@/app/(private)/board/_components/board-header';
import Card from '@/app/(private)/board/_components/card';
import Column from '@/app/(private)/board/_components/column';
import EditTripModal from '@/app/(private)/board/_components/edit-trip-modal';
import { saveTrip } from '@/app/actions/trip-actions';
import type { UserTrips } from '@/interfaces/openapi';
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  PointerSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

interface BoardClientProps {
  initialCards: UserTrips[];
}

export default function BoardClient({ initialCards }: BoardClientProps) {
  const [cards, setCards] = useState(initialCards);
  const [activeId, setActiveId] = useState(null);
  const { data: session } = useSession();

  const [selectedFilter, setSelectedFilter] = useState("All Trips");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedFilter === "My Trips" && card.created_by.id != session?.user?.id) return false;
      if (selectedFilter === "Shared Trips" && card.created_by.id == session?.user?.id) return false;
      if (searchQuery.trim() != "" && card.destination && !card.destination.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [cards, selectedFilter, searchQuery, session?.user?.id]);

  useEffect(() => {
    console.log('Cards state updated:', cards);
  }, [cards]);

  const columns = ['inplanning', 'confirmed', 'completed', 'cancelled'];

  const findCard = (id: string) => filteredCards.find((c) => c.id == id);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    const activeCard = findCard(active.id);
    const overCard = findCard(over.id);

    if (overCard) {
      if (activeCard?.status !== overCard.status) {
        setCards((prev) =>
          prev.map((c) => (c.id === active.id ? { ...c, status: overCard.status } : c))
        );
        updateTripInDB(activeCard?.id, { status: overCard.status });
      } else {
        const prev = [...cards];
        const globalOldIndex = prev.findIndex((c) => c.id === active.id);
        const globalNewIndex = prev.findIndex((c) => c.id === over.id);
        setCards((p) => arrayMove(p, globalOldIndex, globalNewIndex));
      }
    } else {
      const overColumn = over.id;
      if (columns.includes(overColumn) && activeCard.status !== overColumn) {
        setCards((prev) => prev.map((c) => (c.id === active.id ? { ...c, status: overColumn } : c)));
        updateTripInDB(activeCard.id, { status: overColumn });
      }
    }
  }

  const updateTripInDB = async (tripId, data) => {
    await saveTrip(tripId, data);
  };

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeCard = activeId ? findCard(activeId) : null;

  return (
    <>
      <BoardHeader
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
          useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
        )}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex justify-center items-start h-[70vh]">
          <div className="flex gap-4 px-4 pt-4 pb-2 overflow-x-auto w-full h-full">
            {columns.map((col) => (
              <Column
                key={col}
                id={col}
                column={col}
                cards={filteredCards.filter((c) => c.status === col)}
              />
            ))}
          </div>
        </div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: "0.5" } },
            }),
          }}
        >
          {activeCard ? <Card key={activeCard.id} card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Always rendered, handles its own open/close */}
      <EditTripModal setCards={setCards} />
    </>
  );
}
