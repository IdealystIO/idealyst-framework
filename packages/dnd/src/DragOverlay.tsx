import React from 'react';
import {
  DragOverlay as DndKitDragOverlay,
  useDndContext,
} from '@dnd-kit/core';
import type { DragOverlayProps, DragData } from './types';

export function DragOverlay({
  children,
  dropAnimation,
  style,
}: DragOverlayProps) {
  const { active } = useDndContext();

  const activeItem = active
    ? {
        id: active.id,
        data: (active.data?.current ?? {}) as DragData,
      }
    : null;

  const resolvedChildren =
    typeof children === 'function' ? children(activeItem) : children;

  const dndKitDropAnimation = dropAnimation === null
    ? null
    : dropAnimation
      ? { duration: dropAnimation.duration ?? 250, easing: dropAnimation.easing }
      : undefined;

  return (
    <DndKitDragOverlay
      dropAnimation={dndKitDropAnimation}
      style={style as React.CSSProperties}
    >
      {resolvedChildren}
    </DndKitDragOverlay>
  );
}
