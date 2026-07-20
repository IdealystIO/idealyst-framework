import { useCallback } from 'react';
import {
  useDroppable as useDndKitDroppable,
  useDndContext,
} from '@dnd-kit/core';
import type { UseDroppableOptions, UseDroppableResult, DragData } from './types';

export function useDroppable<T extends DragData = DragData>(
  options: UseDroppableOptions<T>,
): UseDroppableResult<T> {
  const { id, data, disabled } = options;

  const { setNodeRef, isOver, active } = useDndKitDroppable({
    id,
    data,
    disabled,
  });

  const { active: contextActive } = useDndContext();

  const ref = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
    },
    [setNodeRef],
  );

  const isActive = contextActive != null;

  const activeItem =
    isOver && active
      ? ({
          id: active.id,
          data: (active.data?.current ?? {}) as T,
        } as { id: typeof active.id; data: T })
      : null;

  return {
    ref,
    isOver,
    isActive,
    activeItem,
  };
}
