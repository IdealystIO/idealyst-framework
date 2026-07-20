import { useCallback, useRef } from 'react';
import { useDraggable as useDndKitDraggable } from '@dnd-kit/core';
import type { UseDraggableOptions, UseDraggableResult, DragData } from './types';

export function useDraggable<T extends DragData = DragData>(
  options: UseDraggableOptions<T>,
): UseDraggableResult {
  const { id, data, disabled } = options;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDndKitDraggable({
      id,
      data,
      disabled,
    });

  // Combine setNodeRef with listeners for a single ref callback
  const ref = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
    },
    [setNodeRef],
  );

  // For drag handles, combine ref + listeners on a separate element
  const handleNodeRef = useRef<HTMLElement | null>(null);
  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      handleNodeRef.current = node;
    },
    [],
  );

  return {
    ref,
    handleRef,
    isDragging,
    isDragSource: isDragging,
    attributes: {
      ...attributes,
      ...listeners,
      role: 'button',
      tabIndex: 0,
      'aria-roledescription': 'draggable',
    },
  };
}
