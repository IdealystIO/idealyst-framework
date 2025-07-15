import React from 'react';
import { View, Text } from 'react-native';
import { DividerProps } from './types';
import { dividerStyles } from './Divider.styles';

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  intent = 'neutral',
  length = 'full',
  spacing = 'medium',
  children,
  style,
  testID,
  accessibilityLabel,
}) => {
  // Apply variants for main divider
  dividerStyles.useVariants({
    orientation,
    thickness,
    variant: variant as any,
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
      case 'medium': return 2;
      case 'thick': return 4;
      default: return 1;
    }
  };

  // For dashed/dotted variants, use border instead of background
  const getDashedStyle = () => {
    if (variant === 'dashed' || variant === 'dotted') {
      const actualThickness = getThickness();
      
      return {
        backgroundColor: 'transparent',
        borderStyle: variant,
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
    if (variant === 'dashed' || variant === 'dotted') {
      return (
        <View
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
        style={[dividerStyles.divider, style]}
        testID={testID}
        accessibilityLabel={accessibilityLabel || "divider"}
      />
    );
  }

  // For lines with content, create a simple dashed line
  const renderLineSegment = () => {
    if (variant === 'dashed' || variant === 'dotted') {
      const actualThickness = getThickness();
      
      return (
        <View
          style={[
            dividerStyles.line,
            {
              backgroundColor: 'transparent',
              borderStyle: variant,
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
};

export default Divider; 