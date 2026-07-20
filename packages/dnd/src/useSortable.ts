import { useCallback } from 'react';
import { useSortable as useDndKitSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { UseSortableOptions, UseSortableResult, DragData } from './types';

export function useSortable<T extends DragData = DragData>(
  options: UseSortableOptions<T>,
): UseSortableResult {
  const { id, data, disabled, animateLayoutChanges } = options;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    isOver,
  } = useDndKitSortable({
    id,
    data,
    disabled,
    animateLayoutChanges: animateLayoutChanges === false ? () => false : undefined,
  });

  const ref = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
    },
    [setNodeRef],
  );

  const handleRef = useCallback(
    (_node: HTMLElement | null) => {
      // On web, handle is same as the sortable element for dnd-kit
    },
    [],
  );

  // Convert dnd-kit transform to a style object compatible with ViewStyle
  const style: any = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  };

  return {
    ref,
    handleRef,
    isDragging,
    isSorting,
    isOver,
    style,
  };
}
