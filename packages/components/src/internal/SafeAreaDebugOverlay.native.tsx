import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from '@idealyst/theme';

interface SafeAreaDebugOverlayProps {
  visible?: boolean;
}

export const SafeAreaDebugOverlay: React.FC<SafeAreaDebugOverlayProps> = ({ visible = true }) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const padding = 12;

  if (!visible) return null;

  // Calculate safe area bounds (system-defined safe zones)
  // Allow overlap with header at top (lenient), but respect system UI at bottom
  const topSafeEdge = 0; // Allow header overlap
  const leftSafeEdge = insets.left;
  const rightSafeEdge = windowWidth - insets.right;
  const bottomSafeEdge = windowHeight - insets.bottom;

  // Calculate content bounds (safe area with padding for visual comfort)
  const topBound = padding; // Start from top with just padding
  const leftBound = leftSafeEdge + padding;
  const rightBound = rightSafeEdge - padding;
  const bottomBound = bottomSafeEdge - padding;

  const safeWidth = rightBound - leftBound;
  const safeHeight = windowHeight - insets.bottom - insets.top - padding * 2;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top unsafe area (status bar, notch) */}
      <View
        style={[
          styles.safeAreaIndicator,
          {
            top: 0,
            left: 0,
            width: windowWidth,
            height: topSafeEdge,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
        ]}
      >
        <Text style={styles.label}>System UI: {topSafeEdge.toFixed(0)}px</Text>
      </View>

      {/* Bottom unsafe area (gesture bar, home indicator) */}
      <View
        style={[
          styles.safeAreaIndicator,
          {
            top: bottomSafeEdge,
            left: 0,
            width: windowWidth,
            height: windowHeight - bottomSafeEdge,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
        ]}
      >
        <Text style={styles.label}>Gesture Bar: {(windowHeight - bottomSafeEdge).toFixed(0)}px</Text>
      </View>

      {/* Left unsafe area */}
      <View
        style={[
          styles.safeAreaIndicator,
          {
            top: topSafeEdge,
            left: 0,
            width: leftSafeEdge,
            height: bottomSafeEdge - topSafeEdge,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
        ]}
      >
        <Text style={[styles.label, styles.rotatedLabel]}>L: {leftSafeEdge.toFixed(0)}px</Text>
      </View>

      {/* Right unsafe area */}
      <View
        style={[
          styles.safeAreaIndicator,
          {
            top: topSafeEdge,
            left: rightSafeEdge,
            width: windowWidth - rightSafeEdge,
            height: bottomSafeEdge - topSafeEdge,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
          },
        ]}
      >
        <Text style={[styles.label, styles.rotatedLabel]}>R: {(windowWidth - rightSafeEdge).toFixed(0)}px</Text>
      </View>

      {/* Safe area border outline */}
      <View
        style={[
          styles.safeAreaBorder,
          {
            top: topBound,
            left: leftBound,
            width: safeWidth,
            height: safeHeight,
          },
        ]}
      />

      {/* Info panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoText}>Window: {windowWidth.toFixed(0)}x{windowHeight.toFixed(0)}</Text>
        <Text style={styles.infoText}>Safe Area: {(rightSafeEdge - leftSafeEdge).toFixed(0)}x{(bottomSafeEdge - topSafeEdge).toFixed(0)}</Text>
        <Text style={styles.infoText}>Content: {safeWidth.toFixed(0)}x{safeHeight.toFixed(0)}</Text>
        <Text style={styles.infoText}>Insets: T:{insets.top} R:{insets.right} B:{insets.bottom} L:{insets.left}</Text>
        <Text style={styles.infoText}>Safe: T:{topSafeEdge} B:{bottomSafeEdge.toFixed(0)}</Text>
        <Text style={styles.infoText}>Bounds: T:{topBound.toFixed(0)} B:{bottomBound.toFixed(0)}</Text>
        <Text style={styles.infoText}>Padding: {padding}px</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  safeAreaIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 0, 0.8)',
    borderStyle: 'dashed',
  },
  label: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rotatedLabel: {
    transform: [{ rotate: '90deg' }],
  },
  infoPanel: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.8)',
  },
  infoText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});
