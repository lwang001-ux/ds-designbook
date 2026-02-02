'use client';

import { useState, useRef, useCallback } from 'react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Pin } from './Pin';
import { PinCreator } from './PinCreator';
import { usePins } from '@/lib/hooks/usePins';
import { useAuth } from '@/lib/context/AuthContext';
import { debounce } from '@/lib/utils';
import type { Pin as PinType } from '@/lib/types';

interface DraggablePinProps {
  pin: PinType;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
}

function DraggablePin({ pin, isOwner, onEdit, onDelete, onLike }: DraggablePinProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: pin.id,
    disabled: !isOwner,
  });

  const style = {
    position: 'absolute' as const,
    left: `${pin.position.x}%`,
    top: `${pin.position.y}%`,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : pin.zIndex,
    cursor: isOwner ? 'grab' : 'default',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...(isOwner ? { ...listeners, ...attributes } : {})}>
      <Pin
        pin={pin}
        isOwner={isOwner}
        onEdit={onEdit}
        onDelete={onDelete}
        onLike={onLike}
      />
    </div>
  );
}

export function Whiteboard() {
  const [showCreator, setShowCreator] = useState(false);
  const [editingPin, setEditingPin] = useState<PinType | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { pins, loading, error, addPin, movePin, removePin, likePin, isOwner } = usePins();

  // Debounced position update
  const debouncedMovePin = useCallback(
    debounce((pinId: string, position: { x: number; y: number }) => {
      movePin(pinId, position);
    }, 300),
    [movePin]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const pinId = active.id as string;
    const pin = pins.find((p) => p.id === pinId);

    if (!pin || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    // Calculate new position as percentage
    const deltaXPercent = (delta.x / boardRect.width) * 100;
    const deltaYPercent = (delta.y / boardRect.height) * 100;

    const newX = Math.max(0, Math.min(95, pin.position.x + deltaXPercent));
    const newY = Math.max(0, Math.min(95, pin.position.y + deltaYPercent));

    debouncedMovePin(pinId, { x: newX, y: newY });
  };

  const handleDelete = async (pinId: string) => {
    if (window.confirm('Are you sure you want to delete this pin?')) {
      await removePin(pinId);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        ref={boardRef}
        className="relative h-[calc(100vh-64px)] bg-white overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Empty state */}
        {pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to the Board!
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first pin. Share photos, quotes, videos, or links with your community.
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Pin
              </button>
            </div>
          </div>
        )}

        {/* Pins */}
        {pins.map((pin) => (
          <DraggablePin
            key={pin.id}
            pin={pin}
            isOwner={isOwner(pin.id)}
            onEdit={() => setEditingPin(pin)}
            onDelete={() => handleDelete(pin.id)}
            onLike={() => likePin(pin.id)}
          />
        ))}

        {/* FAB - Add Pin */}
        <button
          onClick={() => setShowCreator(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Pin Creator Modal */}
        <PinCreator
          isOpen={showCreator}
          onClose={() => setShowCreator(false)}
          onCreatePin={addPin}
        />

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-6 left-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
      </div>
    </DndContext>
  );
}
