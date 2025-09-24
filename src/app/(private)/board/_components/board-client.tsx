'use client';

import BoardHeader from '@/app/(private)/board/_components/board-header';
import Card from '@/app/(private)/board/_components/card';
import Column from '@/app/(private)/board/_components/column';
import EditTripModal from '@/app/(private)/board/_components/edit-trip-modal';
import { saveTrip } from '@/app/actions/trip-actions';
import type { Trip, UserTrips } from '@/interfaces/openapi';
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
  searchParams?: { trip?: string };
  selectedTrip?: Trip | null;
}

export default function BoardClient({ initialCards, searchParams, selectedTrip: initialSelectedTrip }: BoardClientProps) {
  
  const [cards, setCards] = useState(initialCards);
  const [activeId, setActiveId] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(initialSelectedTrip || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();

  // new states for filters
  const [selectedFilter, setSelectedFilter] = useState("All Trips");
  const [searchQuery, setSearchQuery] = useState("");

 

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
    
    // Function to check URL and open modal
    const checkUrlAndOpenModal = () => {
      // const urlParams = new URLSearchParams(window.location.search);
      // const tripParam = urlParams.get('trip');
      
      if (selectedTrip) {
        // const trip = cards.find(card => card.id == tripParam);
        // if (trip) {
          // setSelectedTrip(trip);
          setIsModalOpen(true);
        // }
      } else {
        // Close modal if no trip parameter
        setIsModalOpen(false);
        // setSelectedTrip(null);
      }
    };
    
    // Check URL on initial load
    checkUrlAndOpenModal();
    
    // Listen for URL changes (popstate event)
    const handlePopState = () => {
      checkUrlAndOpenModal();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [cards]);

  // Handle URL search params to show modal (server-side)
  useEffect(() => {
    const safeSearchParams = searchParams || {};
    if (safeSearchParams.trip) {
      const trip = cards.find(card => card.id == Number(safeSearchParams.trip));
      if (trip) {
        setSelectedTrip(trip);
        setIsModalOpen(true);
      }
    }
  }, [searchParams?.trip, cards]);

  // Handle client-side URL changes
  useEffect(() => {
    if (!isClient) return;
    
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tripParam = urlParams.get('trip');
      
      console.log('URL changed, checking for trip param:', tripParam);
      
      if (tripParam) {
        const trip = cards.find(card => card.id == tripParam);
        console.log('Found trip:', trip);
        if (trip) {
          setSelectedTrip(trip);
          setIsModalOpen(true);
          console.log('Modal opened for trip:', trip.id);
        }
      } else {
        // Close modal if no trip parameter
        console.log('No trip param, closing modal');
        setIsModalOpen(false);
        setSelectedTrip(null);
      }
    };
    
    // Check URL on mount
    handleUrlChange();
    
    // Listen for browser navigation (back/forward buttons)
    window.addEventListener('popstate', handleUrlChange);
    
    // Listen for programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleUrlChange, 0);
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleUrlChange, 0);
    };
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [isClient, cards]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedFilter === "My Trips" && card.created_by.id != session?.user?.id) {
        return false;
      }
      if (selectedFilter === "Shared Trips" && card.created_by.id == session?.user?.id) {
        return false;
      }
      if (searchQuery.trim() != "" && card.destination && !card.destination.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [cards, selectedFilter, searchQuery, session?.user?.id]);
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
    // Update URL to remove trip parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('trip');
    window.history.replaceState({}, '', url.toString());
  };

  // sensors: pointer + touch
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const columns = ['inplanning', 'confirmed', 'completed', 'cancelled'];

  const findCard = (id: string) => filteredCards.find((c) => c.id === id);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // active = dragged card id
    const activeCard = findCard(active.id);
    // over could be card id (dropping on card) or column id (dropping on empty column)
    const overCard = findCard(over.id);

    // Dropped onto another card
    if (overCard) {
      if (activeCard?.status !== overCard.status) {
        // move to other column (append near overCard's column)
        setCards((prev) =>
          prev.map((c) => (c.id === active.id ? { ...c, status: overCard.status } : c))
        );
        updateTripInDB(activeCard?.id, {status:overCard.status });
        
      } else {
        // reorder inside same column
        const prev = [...cards];
        // compute global indices
        const globalOldIndex = prev.findIndex((c) => c.id === active.id);
        const globalNewIndex = prev.findIndex((c) => c.id === over.id);
        setCards((p) => arrayMove(p, globalOldIndex, globalNewIndex));
        
      }
    } else {
      // Dropped on empty column area (over.id is column id)
      const overColumn = over.id;
      if (columns.includes(overColumn) && activeCard.status !== overColumn) {
        setCards((prev) => prev.map((c) => (c.id === active.id ? { ...c, status: overColumn } : c)));
        updateTripInDB(activeCard.id, {status:overColumn });
      }
    }
  }
  const updateTripInDB = async (tripId, data) => {
    await saveTrip(tripId, data);
  }
  

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeCard = activeId ? findCard(activeId) : null;


  // Prevent hydration mismatch by only rendering DnD context on client
  if (!isClient) {
    return (
      <>
        <div className="flex justify-center items-start h-[70vh]">
          <div className="flex gap-4 px-4 pt-4 pb-2 overflow-x-auto w-full h-full">
            {columns.map((col) => (
              <div key={col} className="flex-shrink-0 w-72">
                <div className="bg-gray-100 rounded-lg p-4 h-96">
                  <h3 className="text-lg font-semibold mb-4 capitalize">{col}</h3>
                  <div className="space-y-3">
                    {filteredCards.filter((c) => c.status === col).map((card) => (
                      <div key={card.id} className="p-4 rounded-lg shadow-lg bg-white">
                        <h4 className="font-medium">{card.destination}</h4>
                        <p className="text-sm text-gray-600">{card.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <EditTripModal 
          trip={selectedTrip} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </>
    );
  }

  return (
    <>
     {/* Header controls */}
     <BoardHeader
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* board wrapper - full height */}

        {/* board wrapper - 80% of viewport height */}
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

        {/* DragOverlay: ensures dragged item appears above everything */}
        <DragOverlay dropAnimation={{
      sideEffects: defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: "0.5",
          },
        },
      }),
    }}>
          {activeCard ? <Card key={activeCard.id} card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Edit Trip Modal */}
      <EditTripModal 
        trip={selectedTrip} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}
