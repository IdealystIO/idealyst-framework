import React, { useCallback } from 'react';
import {
  DndContext,
  type DragStartEvent as DndKitDragStartEvent,
  type DragMoveEvent as DndKitDragMoveEvent,
  type DragEndEvent as DndKitDragEndEvent,
  type DragCancelEvent as DndKitDragCancelEvent,
  type CollisionDetection,
  pointerWithin,
  rectIntersection as dndKitRectIntersection,
} from '@dnd-kit/core';
import type { DndProviderProps, DragData } from './types';

function extractData(entry: { id: any; data?: { current?: any } } | null) {
  if (!entry) return null;
  return {
    id: entry.id,
    data: (entry.data?.current ?? {}) as DragData,
  };
}

export function DndProvider({
  children,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel,
  collisionDetection,
}: DndProviderProps) {
  const handleDragStart = useCallback(
    (event: DndKitDragStartEvent) => {
      onDragStart?.({ active: extractData(event.active)! });
    },
    [onDragStart],
  );

  const handleDragMove = useCallback(
    (event: DndKitDragMoveEvent) => {
      onDragMove?.({
        active: extractData(event.active)!,
        over: extractData(event.over),
        delta: event.delta,
      });
    },
    [onDragMove],
  );

  const handleDragEnd = useCallback(
    (event: DndKitDragEndEvent) => {
      onDragEnd?.({
        active: extractData(event.active)!,
        over: extractData(event.over),
        canceled: false,
      });
    },
    [onDragEnd],
  );

  const handleDragCancel = useCallback(
    (event: DndKitDragCancelEvent) => {
      onDragCancel?.({ active: extractData(event.active)! });
      onDragEnd?.({
        active: extractData(event.active)!,
        over: null,
        canceled: true,
      });
    },
    [onDragCancel, onDragEnd],
  );

  // Map our CollisionDetector to dnd-kit's CollisionDetection if provided
  const dndKitCollision: CollisionDetection | undefined = collisionDetection
    ? (args) => {
        const active = args.active.rect.current.translated;
        if (!active) return [];

        const droppables = args.droppableContainers
          .filter((c) => c.rect.current)
          .map((c) => ({
            id: c.id,
            rect: {
              x: c.rect.current!.left,
              y: c.rect.current!.top,
              width: c.rect.current!.width,
              height: c.rect.current!.height,
            },
          }));

        const hitId = collisionDetection({
          active: {
            x: active.left,
            y: active.top,
            width: active.width,
            height: active.height,
          },
          droppables,
        });

        if (hitId == null) return [];

        const container = args.droppableContainers.find(
          (c) => c.id === hitId,
        );
        return container ? [{ id: container.id, data: container }] : [];
      }
    : undefined;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={dndKitCollision}
    >
      {children}
    </DndContext>
  );
}
