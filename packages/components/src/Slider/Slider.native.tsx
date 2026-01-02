import React, { useState, useCallback, forwardRef } from 'react';
import { View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { sliderStyles } from './Slider.styles';
import Text from '../Text';
import type { SliderProps } from './types';
import { isIconName } from '../Icon/icon-resolver';

const Slider = forwardRef<View, SliderProps>(({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
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
  onValueChange,
  onValueCommit,
  style,
  testID,
}, ref) => {
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
    margin,
    marginVertical,
    marginHorizontal,
  });

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

    onValueChange?.(newValue);
  }, [controlledValue, onValueChange]);

  const commitValue = useCallback((finalValue: number) => {
    onValueCommit?.(finalValue);
  }, [onValueCommit]);

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

  const percentage = ((value - min) / (max - min)) * 100;

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      const iconStyle = sliderStyles.thumbIcon({ intent });
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconStyle.width || 16}
          color={iconStyle.color}
        />
      );
    }

    return icon;
  };

  return (
    <View ref={ref} style={[sliderStyles.container, style]} testID={testID}>
      {showValue && (
        <View style={sliderStyles.valueLabel as any}>
          <Text>{value}</Text>
        </View>
      )}

      <View style={sliderStyles.sliderWrapper}>
        <GestureDetector gesture={composedGesture}>
          <View
            style={sliderStyles.track}
            onLayout={(e) => {
              const width = e.nativeEvent.layout.width;
              trackWidth.value = width;
              setTrackWidthState(width);
            }}
          >
            {/* Filled track */}
            <Animated.View
              style={[sliderStyles.filledTrack({ intent }), filledTrackAnimatedStyle]}
            />

            {/* Marks */}
            {marks.length > 0 && trackWidthState > 0 && (
              <View style={sliderStyles.marks}>
                {marks.map((mark) => {
                  const markPercentage = ((mark.value - min) / (max - min)) * 100;
                  const markPosition = (markPercentage / 100) * trackWidthState;
                  return (
                    <View key={mark.value}>
                      <View
                        style={[
                          sliderStyles.mark,
                          { left: markPosition },
                        ]}
                      />
                      {mark.label && (
                        <View
                          style={[
                            sliderStyles.markLabel,
                            { left: markPosition },
                          ]}
                        >
                          <Text size="sm">{mark.label}</Text>
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
                sliderStyles.thumb({ intent, disabled }),
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
          <Text style={sliderStyles.minMaxLabel} size="sm">{min}</Text>
          <Text style={sliderStyles.minMaxLabel} size="sm">{max}</Text>
        </View>
      )}
    </View>
  );
});

Slider.displayName = 'Slider';

export default Slider;
