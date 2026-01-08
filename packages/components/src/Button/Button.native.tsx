import React, { ComponentRef, forwardRef, isValidElement, useMemo } from 'react';
import { StyleSheet as RNStyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { buttonStyles } from './Button.styles';
import { ButtonProps } from './types';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import { useUnistyles } from 'react-native-unistyles';

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
    // Accessibility props
    accessibilityLabel,
    accessibilityHint,
    accessibilityDisabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
  } = props;

  // Apply variants for size, disabled, gradient
  buttonStyles.useVariants({
    size,
    disabled,
    gradient,
  });

  // Compute dynamic styles with all props for full flexibility
  const dynamicProps = { intent, type, size, disabled, gradient };
  const buttonStyle = (buttonStyles.button as any)(dynamicProps);
  const textStyle = (buttonStyles.text as any)(dynamicProps);
  const iconStyle = (buttonStyles.icon as any)(dynamicProps);
  const iconContainerStyle = (buttonStyles.iconContainer as any)(dynamicProps);

  // Gradient is only applicable to contained buttons
  const showGradient = gradient && type === 'contained';

  // Get gradient overlay colors (transparent to semi-transparent black/white)
  // Note: Use explicit rgba(0,0,0,0) instead of 'transparent' for RN SVG compatibility
  const getGradientColors = (): [string, string] => {
    switch (gradient) {
      case 'darken': return ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.15)'];
      case 'lighten': return ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)'];
      default: return ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'];
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


  // Use children if available, otherwise use title
  const buttonContent = children || title;

  // Determine if we need to wrap content in icon container
  const hasIcons = leftIcon || rightIcon;

  // Generate native accessibility props - especially important for icon-only buttons
  const nativeA11yProps = useMemo(() => {
    const isIconOnly = !buttonContent && (leftIcon || rightIcon);
    const computedLabel = accessibilityLabel ?? (isIconOnly && typeof leftIcon === 'string' ? leftIcon : undefined);

    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'button',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityControls,
      accessibilityExpanded,
      accessibilityPressed,
    });
  }, [
    accessibilityLabel,
    buttonContent,
    leftIcon,
    rightIcon,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
  ]);

  // Render gradient background layer
  const renderGradientLayer = () => {
    if (!showGradient) return null;

    const [startColor, endColor] = useMemo(() => {
      switch (gradient) {
        case 'darken': return [{
          stopColor: 'black',
          stopOpacity: 0,
        }, {
          stopColor: 'black',
          stopOpacity: 0.15,
        }];
        case 'lighten': return [{
          stopColor: 'white',
          stopOpacity: 0,
        }, {
          stopColor: 'white',
          stopOpacity: 0.2,
        }];
        default: return [{
          stopColor: 'black',
          stopOpacity: 0,
        }, {
          stopColor: 'black',
          stopOpacity: 0,
        }];
      }
    }, [gradient]);

    return (
      <Svg style={RNStyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" {...startColor} />
            <Stop offset="100%" {...endColor} />
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
    ...nativeA11yProps,
  };

  return (
    <TouchableOpacity {...touchableProps as any}>
      {renderGradientLayer()}
      {hasIcons ? (
        <View  style={iconContainerStyle}>
          {leftIcon && 
          <MaterialCommunityIcons
            name={leftIcon}
            size={iconSize}
            style={iconStyle}
        />}
          <Text style={textStyle}>
            {buttonContent}
          </Text>
          {rightIcon &&    
          <MaterialCommunityIcons
            name={rightIcon}
            size={iconSize}
            style={iconStyle}
        />}
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