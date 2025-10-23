import React, { ReactNode } from 'react';
import { View, Dimensions, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BoundedModalContentProps {
  children: ReactNode;
  top: number;
  left: number;
  width?: number;
  maxHeight?: number;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: any) => void;
}

/**
 * A wrapper component for modal content that automatically constrains its height
 * to fit within screen boundaries, accounting for safe areas.
 */
export const BoundedModalContent: React.FC<BoundedModalContentProps> = ({
  children,
  top,
  left,
  width,
  maxHeight = 500,
  style,
  onLayout,
}) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get('window');
  const padding = 12;

  // Calculate dynamic maxHeight to ensure content stays within bounds
  // The safe area goes from the top of the window to windowHeight - insets.bottom
  // We then subtract padding from available space for visual breathing room
  const bottomSafeEdge = windowHeight - insets.bottom;
  const bottomBound = bottomSafeEdge - padding;

  // Calculate available height: from current top position to bottom boundary
  const availableHeight = Math.max(100, bottomBound - top);

  return (
    <View
      style={[
        {
          position: 'absolute',
          top,
          left,
          ...(width && { width }),
          maxHeight: availableHeight,
        },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};
