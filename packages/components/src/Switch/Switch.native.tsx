import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { switchStyles } from './Switch.styles';
import Text from '../Text';
import type { SwitchProps } from './types';

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  labelPosition = 'right',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  switchStyles.useVariants({
    size,
    checked,
    intent,
    disabled,
    position: labelPosition,
  });

  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [checked, progress]);

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const getThumbDistance = () => {
    if (size === 'small') return 16;
    if (size === 'large') return 24;
    return 20;
  };

  // Native-specific thumb styles
  const getThumbSize = () => {
    if (size === 'small') return 16;
    if (size === 'large') return 24;
    return 20;
  };

  const getTrackHeight = () => {
    if (size === 'small') return 20;
    if (size === 'large') return 28;
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
      onPress={handlePress}
      disabled={disabled}
      style={switchStyles.switchContainer}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
    >
      <Animated.View style={switchStyles.switchTrack}>
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

  if (label) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={[switchStyles.container, style]}
      >
        {labelPosition === 'left' && (
          <Text style={switchStyles.label}>{label}</Text>
        )}
        {switchElement}
        {labelPosition === 'right' && (
          <Text style={switchStyles.label}>{label}</Text>
        )}
      </Pressable>
    );
  }

  return switchElement;
};

export default Switch;