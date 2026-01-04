import React, { ComponentRef, forwardRef, isValidElement } from 'react';
import { StyleSheet as RNStyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { buttonStyles } from './Button.styles';
import { ButtonProps } from './types';

const Button = forwardRef<ComponentRef<typeof TouchableOpacity>, ButtonProps>((props, ref) => {
  const {
    children,
    title,
    onPress,
    disabled = false,
    type = 'contained',
    intent = 'primary',
    size = 'md',
    gradient,
    leftIcon,
    rightIcon,
    style,
    testID,
    id,
  } = props;

  // Apply variants
  buttonStyles.useVariants({
    type,
    intent,
    size,
    disabled,
    gradient,
  });

  // Compute dynamic styles
  const buttonStyle = buttonStyles.button;
  const textStyle = buttonStyles.text;
  const iconStyle = buttonStyles.icon;

  // Gradient is only applicable to contained buttons
  const showGradient = gradient && type === 'contained';

  // Get gradient overlay colors (transparent to semi-transparent black/white)
  const getGradientColors = (): [string, string] => {
    switch (gradient) {
      case 'darken': return ['transparent', 'rgba(0, 0, 0, 0.15)'];
      case 'lighten': return ['transparent', 'rgba(255, 255, 255, 0.2)'];
      default: return ['transparent', 'transparent'];
    }
  };

  // Map button size to icon size
  const iconSizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  } as const;
  const iconSize = iconSizeMap[size];

  // Helper to render icon - uses the icon styles from buttonStyles
  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      // Render MaterialCommunityIcons with explicit size prop
      // The icon styles provide the correct color based on dynamic styles
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          style={iconStyle}
        />
      );
    } else if (isValidElement(icon)) {
      // Render custom component as-is
      return icon;
    }
    return null;
  };

  // Use children if available, otherwise use title
  const buttonContent = children || title;

  // Determine if we need to wrap content in icon container
  const hasIcons = leftIcon || rightIcon;

  // Render gradient background layer
  const renderGradientLayer = () => {
    if (!showGradient) return null;

    const [startColor, endColor] = getGradientColors();

    return (
      <Svg style={RNStyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#buttonGradient)"
          rx={8}
          ry={8}
        />
      </Svg>
    );
  };

  // TouchableOpacity types don't include nativeID but it's a valid RN prop
  const touchableProps = {
    ref,
    onPress,
    disabled,
    testID,
    nativeID: id,
    activeOpacity: 0.7,
    style: [
      buttonStyle,
      showGradient && { overflow: 'hidden' },
      style,
    ],
  };

  return (
    <TouchableOpacity {...touchableProps as any}>
      {renderGradientLayer()}
      {hasIcons ? (
        <View style={buttonStyles.iconContainer}>
          {leftIcon && renderIcon(leftIcon)}
          <Text style={textStyle}>
            {buttonContent}
          </Text>
          {rightIcon && renderIcon(rightIcon)}
        </View>
      ) : (
        <Text style={textStyle}>
          {buttonContent}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button; 