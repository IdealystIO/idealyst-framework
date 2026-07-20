import { useCallback, useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useDndManager } from './DndContext.native';
import type { UseSortableOptions, UseSortableResult, DragData, CollisionRect } from './types';

export function useSortable<T extends DragData = DragData>(
  options: UseSortableOptions<T>,
): UseSortableResult {
  const {
    id,
    index,
    data,
    type,
    group = '__default__',
    disabled = false,
    animateLayoutChanges = true,
  } = options;

  const manager = useDndManager();
  const [isDragging, setIsDragging] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const nodeRef = useRef<any>(null);
  const rectRef = useRef<CollisionRect>({ x: 0, y: 0, width: 0, height: 0 });

  // Animated offset for non-dragged items (shifts when other items move)
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);

  // Register as sortable item
  useEffect(() => {
    const unregister = manager.registerSortableItem(group, id, index, rectRef.current);
    return unregister;
  }, [manager, group, id, index]);

  // Register as droppable too (for collision detection)
  useEffect(() => {
    const unregister = manager.registerDroppable({
      id,
      data: (data as DragData) ?? {},
      rect: rectRef.current,
      disabled,
    });
    return unregister;
  }, [manager, id, data, disabled]);

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

  // Drag gesture for this sortable item
  const beginDragJS = useCallback(() => {
    setIsDragging(true);
    setIsSorting(true);
    manager.startX.value = rectRef.current.x;
    manager.startY.value = rectRef.current.y;
    manager.activeId.value = id;
    manager.activeType.value = type ?? null;
    manager.activeData.value = (data as DragData) ?? null;
    manager.beginDrag(id, type ?? null, (data as DragData) ?? {});
  }, [manager, id, type, data]);

  const updateDragJS = useCallback(
    (x: number, y: number) => {
      manager.updateDrag(x, y);
    },
    [manager],
  );

  const endDragJS = useCallback(() => {
    setIsDragging(false);
    setIsSorting(false);
    manager.endDrag();
  }, [manager]);

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      runOnJS(beginDragJS)();
    })
    .onUpdate((event) => {
      'worklet';
      manager.translateX.value = event.translationX;
      manager.translateY.value = event.translationY;
      runOnJS(updateDragJS)(event.translationX, event.translationY);
    })
    .onEnd(() => {
      'worklet';
      manager.translateX.value = withTiming(0, { duration: 200 });
      manager.translateY.value = withTiming(0, { duration: 200 });
      runOnJS(endDragJS)();
    });

  // React to hover changes — shift non-dragged items
  useAnimatedReaction(
    () => ({
      overId: manager.overId.value,
      activeId: manager.activeId.value,
    }),
    ({ overId: currentOverId, activeId: currentActiveId }) => {
      const isThisDragged = currentActiveId === id;
      const isHoveredOver = currentOverId === id;

      runOnJS(setIsOver)(isHoveredOver);

      // If this item is not being dragged, and a sort is active,
      // animate offset to make room for the dragged item
      if (!isThisDragged && currentActiveId != null) {
        // Simple vertical shift: if the hovered item is above us, shift down
        if (isHoveredOver && animateLayoutChanges) {
          offsetY.value = withTiming(rectRef.current.height, { duration: 200 });
        } else {
          offsetY.value = withTiming(0, { duration: 200 });
        }
      } else if (currentActiveId == null) {
        offsetY.value = withTiming(0, { duration: 200 });
        offsetX.value = withTiming(0, { duration: 200 });
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    const isThisDragged = manager.activeId.value === id;

    if (isThisDragged) {
      return {
        transform: [
          { translateX: manager.translateX.value },
          { translateY: manager.translateY.value },
        ],
        zIndex: 999,
        opacity: 0.8,
      };
    }

    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
      ],
    };
  });

  const ref = useCallback(
    (node: any) => {
      nodeRef.current = node;
    },
    [],
  );

  return {
    ref,
    handleRef: ref,
    isDragging,
    isSorting,
    isOver,
    style: animatedStyle as any,
  };
}
