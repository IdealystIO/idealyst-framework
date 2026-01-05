import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { DividerProps } from './types';
import { dividerStyles } from './Divider.styles';

const Divider = forwardRef<View, DividerProps>(({
  orientation = 'horizontal',
  type = 'solid',
  thickness = 'thin',
  intent = 'neutral',
  length = 'full',
  spacing = 'md',
  children,
  style,
  testID,
  accessibilityLabel,
  id,
}, ref) => {
  // Apply variants for container, content (orientation, spacing)
  dividerStyles.useVariants({
    orientation,
    spacing,
    length: typeof length === 'number' ? 'auto' : length,
  });

  // Get dynamic divider style
  const dividerStyle = (dividerStyles.divider as any)({
    orientation,
    thickness,
    type,
    intent,
    spacing,
  });

  // Get dynamic line style
  const lineStyle = (dividerStyles.line as any)({
    orientation,
    thickness,
  });

  // Get thickness value for dashed/dotted border handling on native
  const getThicknessValue = () => {
    switch (thickness) {
      case 'thin': return 1;
      case 'md': return 2;
      case 'thick': return 4;
      default: return 1;
    }
  };

  // For dashed/dotted variants on native, we need to use border instead of background
  const getNativeDashedStyle = () => {
    if (type === 'dashed' || type === 'dotted') {
      const actualThickness = getThicknessValue();

      return {
        backgroundColor: 'transparent',
        borderStyle: type,
        borderColor: dividerStyle.backgroundColor,
        ...(orientation === 'horizontal' ? {
          borderTopWidth: actualThickness,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        } : {
          borderLeftWidth: actualThickness,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderRightWidth: 0,
        }),
      };
    }
    return {};
  };

  // If no children, render simple divider
  if (!children) {
    return (
      <View
        ref={ref}
        nativeID={id}
        style={[dividerStyle, getNativeDashedStyle(), style]}
        testID={testID}
        accessibilityLabel={accessibilityLabel || "divider"}
      />
    );
  }

  // For lines with content, create line segments
  const renderLineSegment = () => {
    if (type === 'dashed' || type === 'dotted') {
      const actualThickness = getThicknessValue();

      return (
        <View
          style={[
            lineStyle,
            {
              backgroundColor: 'transparent',
              borderStyle: type,
              borderColor: lineStyle.backgroundColor,
              ...(orientation === 'horizontal' ? {
                borderTopWidth: actualThickness,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              } : {
                borderLeftWidth: actualThickness,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRightWidth: 0,
              }),
            },
          ]}
        />
      );
    }

    return <View style={lineStyle} />;
  };

  return (
    <View
      ref={ref}
      nativeID={id}
      style={dividerStyles.container}
      testID={testID}
      accessibilityLabel={accessibilityLabel || "divider with content"}
    >
      {renderLineSegment()}
      <Text style={dividerStyles.content}>
        {children}
      </Text>
      {renderLineSegment()}
    </View>
  );
});

Divider.displayName = 'Divider';

export default Divider; 