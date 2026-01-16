import { forwardRef, useMemo } from 'react';
import { ActivityIndicator, StyleSheet as RNStyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { buttonStyles } from './Button.styles';
import { ButtonProps } from './types';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const Button = forwardRef<IdealystElement, ButtonProps>((props, ref) => {
  const {
    children,
    onPress,
    onClick,
    disabled = false,
    loading = false,
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

  // Button is effectively disabled when loading
  const isDisabled = disabled || loading;

  // Determine the handler to use - onPress takes precedence
  const pressHandler = onPress ?? onClick;

  // Warn about deprecated onClick usage in development
  if (__DEV__ && onClick && !onPress) {
    console.warn(
      'Button: onClick prop is deprecated. Use onPress instead for cross-platform compatibility.'
    );
  }

  // Apply variants for size, disabled, gradient
  buttonStyles.useVariants({
    size,
    disabled: isDisabled,
    gradient,
  });

  // Compute dynamic styles with all props for full flexibility
  const dynamicProps = { intent, type, size, disabled: isDisabled, gradient };
  const buttonStyle = (buttonStyles.button as any)(dynamicProps);
  const textStyle = (buttonStyles.text as any)(dynamicProps);
  const iconStyle = (buttonStyles.icon as any)(dynamicProps);
  const iconContainerStyle = (buttonStyles.iconContainer as any)(dynamicProps);
  const spinnerStyle = (buttonStyles.spinner as any)(dynamicProps);

  // Gradient is only applicable to contained buttons
  const showGradient = gradient && type === 'contained';

  // Map button size to icon size
  const iconSizeMap: Record<string, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };
  const iconSize = iconSizeMap[size] ?? 16;


  const buttonContent = children;

  // Determine if we need to wrap content in icon container
  const hasIcons = leftIcon || rightIcon;

  // Generate native accessibility props - especially important for icon-only buttons
  const nativeA11yProps = useMemo(() => {
    const isIconOnly = !buttonContent && (leftIcon || rightIcon);
    const computedLabel = accessibilityLabel ?? (isIconOnly && typeof leftIcon === 'string' ? leftIcon : undefined);

    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? isDisabled,
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
    isDisabled,
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
    onPress: pressHandler,
    disabled: isDisabled,
    testID,
    nativeID: id,
    activeOpacity: 0.7,
    style: [
      buttonStyle,
      showGradient && { overflow: 'hidden' },
      style,
    ],
    accessibilityState: loading ? { busy: true } : undefined,
    ...nativeA11yProps,
  };

  // Get spinner color from the spinner style (matches text color)
  const spinnerColor = spinnerStyle?.color || (type === 'contained' ? '#fff' : undefined);

  // Content opacity - hide when loading but keep for sizing
  const contentOpacity = loading ? 0 : 1;

  return (
    <TouchableOpacity {...touchableProps as any}>
      {renderGradientLayer()}
      {/* Centered spinner overlay */}
      {loading && (
        <View style={RNStyleSheet.absoluteFill}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
              size="small"
              color={spinnerColor}
            />
          </View>
        </View>
      )}
      {/* Content with opacity 0 when loading to maintain size */}
      {hasIcons ? (
        <View style={[iconContainerStyle, { opacity: contentOpacity }]}>
          {leftIcon && (
            <MaterialDesignIcons
              name={leftIcon}
              size={iconSize}
              style={iconStyle}
            />
          )}
          <Text style={textStyle}>
            {buttonContent}
          </Text>
          {rightIcon && (
            <MaterialDesignIcons
              name={rightIcon}
              size={iconSize}
              style={iconStyle}
            />
          )}
        </View>
      ) : (
        <Text style={[textStyle, { opacity: contentOpacity }]}>
          {buttonContent}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button; 