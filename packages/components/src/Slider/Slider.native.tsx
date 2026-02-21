import React, { useState, useCallback, forwardRef, useMemo } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { sliderStyles } from './Slider.styles';
import Text from '../Text';
import type { SliderProps } from './types';
import { isIconName } from '../Icon/icon-resolver';
import { getNativeRangeAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const Slider = forwardRef<IdealystElement, SliderProps>(({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  error,
  helperText,
  label,
  showValue = false,
  showMinMax = false,
  marks = [],
  intent = 'primary',
  size = 'md',
  icon,
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  onChange,
  onChangeCommit,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityValueNow,
  accessibilityValueMin,
  accessibilityValueMax,
  accessibilityValueText,
}, ref) => {
  // Derive hasError from error prop
  const hasError = Boolean(error);
  // Determine if we need a wrapper (when label, error, or helperText is present)
  const needsWrapper = Boolean(label) || Boolean(error) || Boolean(helperText);
  const showFooter = Boolean(error) || Boolean(helperText);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [trackWidthState, setTrackWidthState] = useState(0);
  const trackWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  sliderStyles.useVariants({
    size,
    disabled,
    hasError,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Wrapper, label, and footer styles
  const wrapperStyle = sliderStyles.wrapper as any;
  const labelStyle = sliderStyles.label as any;
  const footerStyle = sliderStyles.footer as any;
  const helperTextStyle = sliderStyles.helperText as any;

  const clampValue = (val: number) => {
    'worklet';
    const clampedValue = Math.min(Math.max(val, min), max);
    const steppedValue = Math.round(clampedValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const calculateValueFromPosition = (position: number) => {
    'worklet';
    if (trackWidth.value === 0) return value;
    const percentage = Math.max(0, Math.min(1, position / trackWidth.value));
    const rawValue = min + percentage * (max - min);
    return clampValue(rawValue);
  };

  const updateValue = useCallback((newValue: number) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  }, [controlledValue, onChange]);

  const commitValue = useCallback((finalValue: number) => {
    onChangeCommit?.(finalValue);
  }, [onChangeCommit]);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeRangeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'adjustable',
      accessibilityValueNow: accessibilityValueNow ?? value,
      accessibilityValueMin: accessibilityValueMin ?? min,
      accessibilityValueMax: accessibilityValueMax ?? max,
      accessibilityValueText: accessibilityValueText ?? `${value}`,
    });
  }, [
    accessibilityLabel,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityValueNow,
    value,
    accessibilityValueMin,
    min,
    accessibilityValueMax,
    max,
    accessibilityValueText,
  ]);

  // Update translateX when value changes externally
  React.useEffect(() => {
    if (!isDragging.value && trackWidth.value > 0) {
      const percentage = (value - min) / (max - min);
      translateX.value = percentage * trackWidth.value;
    }
  }, [value, min, max, trackWidth, translateX, isDragging]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-5, 5])
    .failOffsetY([-5, 5])
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.15, { damping: 15, stiffness: 200 });
    })
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(trackWidth.value, event.x));
      translateX.value = newPosition;
      const newValue = calculateValueFromPosition(newPosition);
      runOnJS(updateValue)(newValue);
    })
    .onEnd(() => {
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      const newPosition = Math.max(0, Math.min(trackWidth.value, translateX.value));
      const finalValue = calculateValueFromPosition(newPosition);
      runOnJS(commitValue)(finalValue);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(1.15, { damping: 15, stiffness: 200 });
    })
    .onEnd((event) => {
      const newPosition = Math.max(0, Math.min(trackWidth.value, event.x));
      translateX.value = newPosition;
      const newValue = calculateValueFromPosition(newPosition);
      runOnJS(updateValue)(newValue);
      runOnJS(commitValue)(newValue);
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const getThumbSize = () => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 24;
    return 20;
  };

  const thumbSize = getThumbSize();

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value - thumbSize / 2 },
        { scale: scale.value },
      ],
    } as any;
  });

  const filledTrackAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  const _percentage = ((value - min) / (max - min)) * 100;

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      const iconStyle = (sliderStyles.thumbIcon as any);
      return (
        <MaterialDesignIcons
          name={icon}
          size={iconStyle.width || 16}
          color={iconStyle.color}
        />
      );
    }

    return icon;
  };

  // Get dynamic styles
  const containerStyle = (sliderStyles.container as any);
  const trackStyle = (sliderStyles.track as any);

  // The slider container element
  const sliderContainer = (
    <View style={[containerStyle, !needsWrapper && style]} testID={!needsWrapper ? testID : undefined} {...nativeA11yProps}>
      {showValue && (
        <View style={sliderStyles.valueLabel as any}>
          <Text>{value}</Text>
        </View>
      )}

      <View style={sliderStyles.sliderWrapper}>
        <GestureDetector gesture={composedGesture}>
          <View
            style={trackStyle}
            onLayout={(e: LayoutChangeEvent) => {
              const width = e.nativeEvent.layout.width;
              trackWidth.value = width;
              setTrackWidthState(width);
            }}
          >
            {/* Filled track */}
            <Animated.View
              style={[(sliderStyles.filledTrack as any), filledTrackAnimatedStyle]}
            />

            {/* Marks */}
            {marks.length > 0 && trackWidthState > 0 && (
              <View style={sliderStyles.marks as any}>
                {marks.map((mark) => {
                  const markPercentage = ((mark.value - min) / (max - min)) * 100;
                  const markPosition = (markPercentage / 100) * trackWidthState;
                  return (
                    <View key={mark.value}>
                      <View
                        style={[
                          sliderStyles.mark as any,
                          { left: markPosition },
                        ]}
                      />
                      {mark.label && (
                        <View
                          style={[
                            sliderStyles.markLabel as any,
                            { left: markPosition },
                          ]}
                        >
                          <Text typography="caption">{mark.label}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Thumb */}
            <Animated.View
              style={[
                (sliderStyles.thumb as any),
                {
                  // Manual positioning/sizing for native layout
                  position: 'absolute',
                  top: '50%',
                  marginTop: -thumbSize / 2,
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 2,
                },
                thumbAnimatedStyle,
              ]}
            >
              {renderIcon()}
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      {showMinMax && (
        <View style={sliderStyles.minMaxLabels}>
          <Text style={sliderStyles.minMaxLabel} typography="caption">{min}</Text>
          <Text style={sliderStyles.minMaxLabel} typography="caption">{max}</Text>
        </View>
      )}
    </View>
  );

  // If wrapper needed for label/error/helperText
  if (needsWrapper) {
    return (
      <View ref={ref as any} nativeID={id} style={[wrapperStyle, style]} testID={testID}>
        {label && (
          <Text style={labelStyle}>{label}</Text>
        )}

        {sliderContainer}

        {showFooter && (
          <View style={footerStyle}>
            <View style={{ flex: 1 }}>
              {error && <Text style={helperTextStyle}>{error}</Text>}
              {!error && helperText && <Text style={helperTextStyle}>{helperText}</Text>}
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View ref={ref as any} nativeID={id} style={[containerStyle, style]} testID={testID} {...nativeA11yProps}>
      {showValue && (
        <View style={sliderStyles.valueLabel as any}>
          <Text>{value}</Text>
        </View>
      )}

      <View style={sliderStyles.sliderWrapper}>
        <GestureDetector gesture={composedGesture}>
          <View
            style={trackStyle}
            onLayout={(e: LayoutChangeEvent) => {
              const width = e.nativeEvent.layout.width;
              trackWidth.value = width;
              setTrackWidthState(width);
            }}
          >
            {/* Filled track */}
            <Animated.View
              style={[(sliderStyles.filledTrack as any), filledTrackAnimatedStyle]}
            />

            {/* Marks */}
            {marks.length > 0 && trackWidthState > 0 && (
              <View style={sliderStyles.marks as any}>
                {marks.map((mark) => {
                  const markPercentage = ((mark.value - min) / (max - min)) * 100;
                  const markPosition = (markPercentage / 100) * trackWidthState;
                  return (
                    <View key={mark.value}>
                      <View
                        style={[
                          sliderStyles.mark as any,
                          { left: markPosition },
                        ]}
                      />
                      {mark.label && (
                        <View
                          style={[
                            sliderStyles.markLabel as any,
                            { left: markPosition },
                          ]}
                        >
                          <Text typography="caption">{mark.label}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Thumb */}
            <Animated.View
              style={[
                (sliderStyles.thumb as any),
                {
                  // Manual positioning/sizing for native layout
                  position: 'absolute',
                  top: '50%',
                  marginTop: -thumbSize / 2,
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 2,
                },
                thumbAnimatedStyle,
              ]}
            >
              {renderIcon()}
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      {showMinMax && (
        <View style={sliderStyles.minMaxLabels}>
          <Text style={sliderStyles.minMaxLabel} typography="caption">{min}</Text>
          <Text style={sliderStyles.minMaxLabel} typography="caption">{max}</Text>
        </View>
      )}
    </View>
  );
});

Slider.displayName = 'Slider';

export default Slider;
