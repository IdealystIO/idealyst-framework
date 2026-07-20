import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useDndManager } from './DndContext.native';
import type { DragOverlayProps, DragData, DndId } from './types';

export function DragOverlay({
  children,
  style,
}: DragOverlayProps) {
  const manager = useDndManager();
  const [activeItem, setActiveItem] = useState<{
    id: DndId;
    data: DragData;
  } | null>(null);

  const updateActiveItem = (id: DndId | null, data: DragData | null) => {
    if (id != null && data != null) {
      setActiveItem({ id, data });
    } else {
      setActiveItem(null);
    }
  };

  useAnimatedReaction(
    () => ({
      id: manager.activeId.value,
      data: manager.activeData.value,
    }),
    ({ id, data }) => {
      runOnJS(updateActiveItem)(id, data);
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (manager.activeId.value == null) {
      return { opacity: 0 };
    }

    return {
      opacity: 1,
      transform: [
        { translateX: manager.startX.value + manager.translateX.value },
        { translateY: manager.startY.value + manager.translateY.value },
      ],
    };
  });

  const resolvedChildren =
    typeof children === 'function' ? children(activeItem) : children;

  if (!resolvedChildren) return null;

  return (
    <Animated.View
      style={[styles.overlay, animatedStyle, style]}
      pointerEvents="none"
    >
      {resolvedChildren}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
