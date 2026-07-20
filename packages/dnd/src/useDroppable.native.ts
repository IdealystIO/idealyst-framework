import { useCallback, useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { useDndManager } from './DndContext.native';
import type { UseDroppableOptions, UseDroppableResult, DragData, DndId, CollisionRect } from './types';

export function useDroppable<T extends DragData = DragData>(
  options: UseDroppableOptions<T>,
): UseDroppableResult<T> {
  const { id, data, accept, disabled = false } = options;

  const manager = useDndManager();
  const [isOver, setIsOver] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeItem, setActiveItem] = useState<{ id: DndId; data: T } | null>(null);
  const nodeRef = useRef<any>(null);
  const rectRef = useRef<CollisionRect>({ x: 0, y: 0, width: 0, height: 0 });

  // Register this droppable
  useEffect(() => {
    const unregister = manager.registerDroppable({
      id,
      data: (data as DragData) ?? {},
      rect: rectRef.current,
      accept,
      disabled,
    });
    return unregister;
  }, [manager, id, data, accept, disabled]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const node = nodeRef.current;
      if (node?.measureInWindow) {
        node.measureInWindow((x: number, y: number, width: number, height: number) => {
          rectRef.current = { x, y, width, height };
          manager.updateDroppableRect(id, rectRef.current);
        });
      } else {
        const { x, y, width, height } = event.nativeEvent.layout;
        rectRef.current = { x, y, width, height };
        manager.updateDroppableRect(id, rectRef.current);
      }
    },
    [manager, id],
  );

  // Track hover state via animated reaction
  const setOverState = useCallback(
    (hovering: boolean) => {
      setIsOver(hovering);
      if (hovering && manager.activeData.value) {
        setActiveItem({
          id: manager.activeId.value!,
          data: manager.activeData.value as T,
        });
      } else {
        setActiveItem(null);
      }
    },
    [manager],
  );

  const setActiveState = useCallback((active: boolean) => {
    setIsActive(active);
  }, []);

  useAnimatedReaction(
    () => manager.overId.value,
    (currentOverId) => {
      runOnJS(setOverState)(currentOverId === id);
    },
  );

  useAnimatedReaction(
    () => manager.activeId.value,
    (currentActiveId) => {
      runOnJS(setActiveState)(currentActiveId != null);
    },
  );

  const ref = useCallback(
    (node: any) => {
      nodeRef.current = node;
    },
    [],
  );

  return {
    ref: (node: any) => {
      ref(node);
      // Expose onLayout via attributes pattern — consumers attach to View
    },
    isOver,
    isActive,
    activeItem,
  };
}
