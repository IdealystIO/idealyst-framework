import { useCallback, useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useDndManager } from './DndContext.native';
import type { UseDraggableOptions, UseDraggableResult, DragData } from './types';

export function useDraggable<T extends DragData = DragData>(
  options: UseDraggableOptions<T>,
): UseDraggableResult {
  const {
    id,
    data,
    type,
    disabled = false,
    activationDelay = 0,
    activationTolerance = 0,
  } = options;

  const manager = useDndManager();
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<any>(null);
  const layoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    layoutRef.current = { x, y, width, height };
    // Also measure absolute position
    nodeRef.current?.measureInWindow?.(
      (absX: number, absY: number, w: number, h: number) => {
        layoutRef.current = { x: absX, y: absY, width: w, height: h };
      },
    );
  }, []);

  const beginDragJS = useCallback(() => {
    setIsDragging(true);
    manager.startX.value = layoutRef.current.x;
    manager.startY.value = layoutRef.current.y;
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
    manager.endDrag();
  }, [manager]);

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(activationTolerance)
    .activateAfterLongPress(activationDelay > 0 ? activationDelay : undefined as any)
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
      manager.translateX.value = withSpring(0);
      manager.translateY.value = withSpring(0);
      runOnJS(endDragJS)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (manager.activeId.value !== id) return {};
    return {
      transform: [
        { translateX: manager.translateX.value },
        { translateY: manager.translateY.value },
      ],
      zIndex: 999,
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
    isDragSource: isDragging,
    attributes: {
      onLayout,
      gesture,
      animatedStyle,
    },
  };
}
