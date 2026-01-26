import { forwardRef, useMemo } from 'react';
import { ActivityIndicator, StyleSheet as RNStyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';
import { iconButtonStyles } from './IconButton.styles';
import { IconButtonProps } from './types';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';
import type { Theme } from '@idealyst/theme';

const IconButton = forwardRef<IdealystElement, IconButtonProps>((props, ref) => {
  const {
    icon,
    onPress,
    onClick,
    disabled = false,
    loading = false,
    type = 'contained',
    intent = 'primary',
    size = 'md',
    gradient,
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

  // Get theme for icon size
  const { theme } = useUnistyles() as { theme: Theme };

  // Button is effectively disabled when loading
  const isDisabled = disabled || loading;

  // Get icon size directly from theme
  const iconSize = theme.sizes.iconButton[size]?.iconSize ?? 24;

  // Determine the handler to use - onPress takes precedence
  const pressHandler = onPress ?? onClick;

  // Warn about deprecated onClick usage in development
  if (__DEV__ && onClick && !onPress) {
    console.warn(
      'IconButton: onClick prop is deprecated. Use onPress instead for cross-platform compatibility.'
    );
  }

  // Apply variants for size, disabled, gradient
  iconButtonStyles.useVariants({
    size,
    disabled: isDisabled,
    gradient,
  });

  // Compute dynamic styles with all props for full flexibility
  const dynamicProps = { intent, type, size, disabled: isDisabled, gradient };
  const buttonStyle = (iconButtonStyles.button as any)(dynamicProps);
  const iconStyle = (iconButtonStyles.icon as any)(dynamicProps);
  const spinnerStyle = (iconButtonStyles.spinner as any)(dynamicProps);

  // Gradient is only applicable to contained buttons
  const showGradient = gradient && type === 'contained';

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? (typeof icon === 'string' ? icon : undefined);

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
    icon,
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
          <LinearGradient id="iconButtonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" {...startColor} />
            <Stop offset="100%" {...endColor} />
          </LinearGradient>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#iconButtonGradient)"
          rx={9999}
          ry={9999}
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

  // Get spinner color from the spinner style (matches icon color)
  const spinnerColor = spinnerStyle?.color || (type === 'contained' ? '#fff' : undefined);

  // Content opacity - hide when loading but keep for sizing
  const contentOpacity = loading ? 0 : 1;

  // Render icon
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <MaterialDesignIcons
          name={icon}
          size={iconSize}
          style={[iconStyle, { opacity: contentOpacity }]}
        />
      );
    }
    // Custom ReactNode icon
    return (
      <View style={{ opacity: contentOpacity }}>
        {icon}
      </View>
    );
  };

  return (
    <TouchableOpacity {...touchableProps as any}>
      {renderGradientLayer()}
      {/* Centered spinner overlay */}
      {loading && (
        <View style={[RNStyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator
            size="small"
            color={spinnerColor}
          />
        </View>
      )}
      {/* Icon renders directly - TouchableOpacity has alignItems/justifyContent center */}
      {renderIcon()}
    </TouchableOpacity>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
