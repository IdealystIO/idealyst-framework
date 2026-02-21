import React, { forwardRef, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { switchStyles } from './Switch.styles';
import Text from '../Text';
import type { SwitchProps } from './types';
import { getNativeSelectionAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const Switch = forwardRef<IdealystElement, SwitchProps>(({
  checked = false,
  onChange,
  disabled = false,
  error,
  helperText,
  label,
  labelPosition = 'right',
  intent = 'primary',
  size = 'md',
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
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
  accessibilityChecked,
}, ref) => {
  // Derive hasError from error prop
  const hasError = Boolean(error);
  // Determine if we need a wrapper (when error or helperText is present)
  const needsWrapper = Boolean(error) || Boolean(helperText);
  const showFooter = Boolean(error) || Boolean(helperText);

  switchStyles.useVariants({
    size,
    disabled,
    checked,
    hasError,
    intent,
    position: labelPosition,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Wrapper and helperText styles
  const wrapperStyle = (switchStyles.wrapper as any)({});
  const helperTextStyle = (switchStyles.helperText as any)({ hasError });

  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 40,
      stiffness: 200,
    });
  }, [checked, progress]);

  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? label;
    const computedChecked = accessibilityChecked ?? checked;

    return getNativeSelectionAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'switch',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityChecked: computedChecked,
    });
  }, [
    accessibilityLabel,
    label,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityChecked,
    checked,
  ]);

  const getThumbDistance = () => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 24;
    return 20;
  };

  // Native-specific thumb styles
  const getThumbSize = () => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 24;
    return 20;
  };

  const getTrackHeight = () => {
    if (size === 'sm') return 20;
    if (size === 'lg') return 28;
    return 24;
  };

  const thumbSize = getThumbSize();
  const thumbDistance = getThumbDistance();
  const trackHeight = getTrackHeight();
  const thumbTop = (trackHeight - thumbSize) / 2;

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * thumbDistance + 2,
        },
      ],
    };
  });

  const switchElement = (
    <Pressable
      ref={!label && !needsWrapper ? ref : undefined}
      nativeID={!label && !needsWrapper ? id : undefined}
      onPress={handlePress}
      disabled={disabled}
      style={switchStyles.switchContainer as any}
      testID={!label && !needsWrapper ? testID : undefined}
      {...nativeA11yProps}
    >
      <Animated.View style={switchStyles.switchTrack as any}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: thumbTop,
              width: thumbSize,
              height: thumbSize,
              backgroundColor: 'white',
              borderRadius: thumbSize / 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 2,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );

  // The switch + label row
  const switchWithLabel = label ? (
    <Pressable
      ref={!needsWrapper ? ref as any : undefined}
      nativeID={!needsWrapper ? id : undefined}
      onPress={handlePress}
      disabled={disabled}
      style={[switchStyles.container as any, !needsWrapper && style]}
      testID={!needsWrapper ? testID : undefined}
    >
      {labelPosition === 'left' && (
        <Text style={switchStyles.label as any}>{label}</Text>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <Text style={switchStyles.label as any}>{label}</Text>
      )}
    </Pressable>
  ) : switchElement;

  // If wrapper needed for error/helperText
  if (needsWrapper) {
    return (
      <View ref={ref as any} nativeID={id} style={[wrapperStyle, style]} testID={testID}>
        {switchWithLabel}
        {showFooter && (
          <View style={{ flex: 1 }}>
            {error && <Text style={helperTextStyle}>{error}</Text>}
            {!error && helperText && <Text style={helperTextStyle}>{helperText}</Text>}
          </View>
        )}
      </View>
    );
  }

  return switchWithLabel;
});

Switch.displayName = 'Switch';

export default Switch;