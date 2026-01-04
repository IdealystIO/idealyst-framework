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
  // Apply variants for main divider
  dividerStyles.useVariants({
    orientation,
    thickness,
    type: type as any,
    intent,
    length: typeof length === 'number' ? 'auto' : length,
    spacing,
  });

  // Get the current styles for color and dimensions
  const dividerStyle = dividerStyles.divider;
  
  // Get thickness value
  const getThickness = () => {
    switch (thickness) {
      case 'thin': return 1;
      case 'md': return 2;
      case 'thick': return 4;
      default: return 1;
    }
  };

  // For dashed/dotted variants, use border instead of background
  const getDashedStyle = () => {
    if (type === 'dashed' || type === 'dotted') {
      const actualThickness = getThickness();
      
      return {
        backgroundColor: 'transparent',
        borderStyle: type,
        borderColor: dividerStyle.backgroundColor,
        ...(orientation === 'horizontal' ? {
          borderTopWidth: actualThickness,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          width: '100%',
          height: actualThickness,
        } : {
          borderLeftWidth: actualThickness,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderRightWidth: 0,
          height: '100%',
          width: actualThickness,
        }),
      };
    }
    return {};
  };

  // If no children, render simple divider
  if (!children) {
    if (type === 'dashed' || type === 'dotted') {
      return (
        <View
          ref={ref}
          nativeID={id}
          style={[
            dividerStyle,
            getDashedStyle(),
            style,
          ]}
          testID={testID}
          accessibilityLabel={accessibilityLabel || "divider"}
        />
      );
    }

    return (
      <View
        ref={ref}
        nativeID={id}
        style={[dividerStyles.divider, style]}
        testID={testID}
        accessibilityLabel={accessibilityLabel || "divider"}
      />
    );
  }

  // For lines with content, create a simple dashed line
  const renderLineSegment = () => {
    if (type === 'dashed' || type === 'dotted') {
      const actualThickness = getThickness();
      
      return (
        <View
          style={[
            dividerStyles.line,
            {
              backgroundColor: 'transparent',
              borderStyle: type,
              borderColor: dividerStyles.line.backgroundColor,
              ...(orientation === 'horizontal' ? {
                borderTopWidth: actualThickness,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                height: actualThickness,
              } : {
                borderLeftWidth: actualThickness,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRightWidth: 0,
                width: actualThickness,
              }),
            },
          ]}
        />
      );
    }
    
    return <View style={dividerStyles.line} />;
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