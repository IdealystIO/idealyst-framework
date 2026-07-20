import React, { useCallback, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeDndContext, type DndManager, type DroppableEntry } from './DndContext.native';
import { rectIntersection } from './collision';
import type {
  DndProviderProps,
  DndId,
  DragData,
  CollisionRect,
  CollisionDetector,
} from './types';

export function DndProvider({
  children,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel,
  collisionDetection,
}: DndProviderProps) {
  const droppablesRef = useRef<Map<DndId, DroppableEntry>>(new Map());
  const sortableItemsRef = useRef<Map<string, Map<DndId, { id: DndId; index: number; rect: CollisionRect }>>>(new Map());

  // Shared values for UI thread animation
  const activeId = useSharedValue<DndId | null>(null);
  const activeType = useSharedValue<string | null>(null);
  const activeData = useSharedValue<DragData | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const overId = useSharedValue<DndId | null>(null);

  // Track active drag info on JS thread for event callbacks
  const activeDragRef = useRef<{ id: DndId; type: string | null; data: DragData } | null>(null);

  const detector: CollisionDetector = collisionDetection ?? rectIntersection;

  const findDropTarget = useCallback(
    (activeRect: CollisionRect): DroppableEntry | null => {
      const entries = Array.from(droppablesRef.current.values()).filter(
        (e) => !e.disabled,
      );

      // Filter by accept type if active has a type
      const activeTypeVal = activeDragRef.current?.type;
      const filtered = entries.filter((entry) => {
        if (!entry.accept) return true;
        if (!activeTypeVal) return true;
        const accepts = Array.isArray(entry.accept) ? entry.accept : [entry.accept];
        return accepts.includes(activeTypeVal);
      });

      const droppables = filtered.map((e) => ({ id: e.id, rect: e.rect }));
      const hitId = detector({ active: activeRect, droppables });
      if (hitId == null) return null;
      return droppablesRef.current.get(hitId) ?? null;
    },
    [detector],
  );

  const beginDrag = useCallback(
    (id: DndId, type: string | null, data: DragData) => {
      activeDragRef.current = { id, type, data };
      onDragStart?.({ active: { id, data } });
    },
    [onDragStart],
  );

  const updateDrag = useCallback(
    (x: number, y: number) => {
      if (!activeDragRef.current) return;
      const { id, data } = activeDragRef.current;

      // Find what we're over
      const activeRect: CollisionRect = {
        x: startX.value + x,
        y: startY.value + y,
        width: 1,
        height: 1,
      };

      const target = findDropTarget(activeRect);
      const newOverId = target?.id ?? null;
      overId.value = newOverId;

      onDragMove?.({
        active: { id, data },
        over: target ? { id: target.id, data: target.data } : null,
        delta: { x, y },
      });
    },
    [findDropTarget, onDragMove, overId, startX, startY],
  );

  const endDrag = useCallback(() => {
    if (!activeDragRef.current) return;
    const { id, data } = activeDragRef.current;

    const currentOverId = overId.value;
    const target = currentOverId != null
      ? droppablesRef.current.get(currentOverId)
      : null;

    onDragEnd?.({
      active: { id, data },
      over: target ? { id: target.id, data: target.data } : null,
      canceled: false,
    });

    activeDragRef.current = null;
    activeId.value = null;
    activeType.value = null;
    activeData.value = null;
    translateX.value = 0;
    translateY.value = 0;
    overId.value = null;
  }, [onDragEnd, activeId, activeType, activeData, translateX, translateY, overId]);

  const cancelDrag = useCallback(() => {
    if (!activeDragRef.current) return;
    const { id, data } = activeDragRef.current;

    onDragCancel?.({ active: { id, data } });
    onDragEnd?.({
      active: { id, data },
      over: null,
      canceled: true,
    });

    activeDragRef.current = null;
    activeId.value = null;
    activeType.value = null;
    activeData.value = null;
    translateX.value = 0;
    translateY.value = 0;
    overId.value = null;
  }, [onDragCancel, onDragEnd, activeId, activeType, activeData, translateX, translateY, overId]);

  const registerDroppable = useCallback((entry: DroppableEntry) => {
    droppablesRef.current.set(entry.id, entry);
    return () => {
      droppablesRef.current.delete(entry.id);
    };
  }, []);

  const updateDroppableRect = useCallback((id: DndId, rect: CollisionRect) => {
    const entry = droppablesRef.current.get(id);
    if (entry) {
      entry.rect = rect;
    }
  }, []);

  const getDroppables = useCallback(() => {
    return Array.from(droppablesRef.current.values());
  }, []);

  const registerSortableItem = useCallback(
    (group: string, id: DndId, index: number, rect: CollisionRect) => {
      if (!sortableItemsRef.current.has(group)) {
        sortableItemsRef.current.set(group, new Map());
      }
      sortableItemsRef.current.get(group)!.set(id, { id, index, rect });
      return () => {
        sortableItemsRef.current.get(group)?.delete(id);
      };
    },
    [],
  );

  const getSortableItems = useCallback(
    (group: string) => {
      const map = sortableItemsRef.current.get(group);
      if (!map) return [];
      return Array.from(map.values()).sort((a, b) => a.index - b.index);
    },
    [],
  );

  const manager: DndManager = useMemo(
    () => ({
      activeId,
      activeType,
      activeData,
      translateX,
      translateY,
      startX,
      startY,
      overId,
      registerDroppable,
      updateDroppableRect,
      getDroppables,
      beginDrag,
      updateDrag,
      endDrag,
      cancelDrag,
      collisionDetection: detector,
      findDropTarget,
      registerSortableItem,
      getSortableItems,
    }),
    [
      activeId,
      activeType,
      activeData,
      translateX,
      translateY,
      startX,
      startY,
      overId,
      registerDroppable,
      updateDroppableRect,
      getDroppables,
      beginDrag,
      updateDrag,
      endDrag,
      cancelDrag,
      detector,
      findDropTarget,
      registerSortableItem,
      getSortableItems,
    ],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeDndContext.Provider value={manager}>
        {children}
      </NativeDndContext.Provider>
    </GestureHandlerRootView>
  );
}
