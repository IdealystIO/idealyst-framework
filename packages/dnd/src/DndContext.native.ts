import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { DndId, DragData, CollisionDetector, CollisionRect } from './types';

export interface DroppableEntry {
  id: DndId;
  data: DragData;
  rect: CollisionRect;
  accept?: string | string[];
  disabled?: boolean;
}

export interface DndManager {
  // Active drag state (shared values for UI thread)
  activeId: SharedValue<DndId | null>;
  activeType: SharedValue<string | null>;
  activeData: SharedValue<DragData | null>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  startX: SharedValue<number>;
  startY: SharedValue<number>;

  // Registry
  registerDroppable: (entry: DroppableEntry) => () => void;
  updateDroppableRect: (id: DndId, rect: CollisionRect) => void;
  getDroppables: () => DroppableEntry[];

  // Drag lifecycle (called from JS thread via runOnJS)
  beginDrag: (id: DndId, type: string | null, data: DragData) => void;
  updateDrag: (x: number, y: number) => void;
  endDrag: () => void;
  cancelDrag: () => void;

  // Collision detection
  collisionDetection: CollisionDetector;
  findDropTarget: (activeRect: CollisionRect) => DroppableEntry | null;

  // Current hover target
  overId: SharedValue<DndId | null>;

  // Sortable support
  registerSortableItem: (
    groupOrType: string,
    id: DndId,
    index: number,
    rect: CollisionRect,
  ) => () => void;
  getSortableItems: (groupOrType: string) => Array<{ id: DndId; index: number; rect: CollisionRect }>;
  onReorder?: (fromId: DndId, toId: DndId) => void;
}

export const NativeDndContext = createContext<DndManager | null>(null);

export function useDndManager(): DndManager {
  const ctx = useContext(NativeDndContext);
  if (!ctx) {
    throw new Error('useDraggable/useDroppable/useSortable must be used within a <DndProvider>');
  }
  return ctx;
}
