import React from 'react';
import { View, Pressable, Animated } from 'react-native';
import Text from '../Text';
import { switchStyles } from './Switch.styles';
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
  const animatedValue = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [checked, animatedValue]);

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const getTrackStyles = () => {
    const trackStyles = [
      switchStyles.switchTrack,
      size === 'small' && switchStyles.switchTrackSmall,
      size === 'medium' && switchStyles.switchTrackMedium,
      size === 'large' && switchStyles.switchTrackLarge,
    ];

    if (checked) {
      trackStyles.push(switchStyles.switchTrackChecked);
      if (intent === 'success') trackStyles.push(switchStyles.switchTrackCheckedSuccess);
      if (intent === 'error') trackStyles.push(switchStyles.switchTrackCheckedError);
      if (intent === 'warning') trackStyles.push(switchStyles.switchTrackCheckedWarning);
      if (intent === 'neutral') trackStyles.push(switchStyles.switchTrackCheckedNeutral);
    }

    if (disabled) {
      trackStyles.push(switchStyles.switchTrackDisabled);
    }

    return trackStyles;
  };

  const getThumbTranslation = () => {
    let distance = 16;
    if (size === 'medium') distance = 20;
    if (size === 'large') distance = 24;

    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, distance + 2],
    });
  };

  const getThumbStyles = () => {
    const thumbStyles = [
      switchStyles.switchThumb,
      size === 'small' && switchStyles.switchThumbSmall,
      size === 'medium' && switchStyles.switchThumbMedium,
      size === 'large' && switchStyles.switchThumbLarge,
      {
        transform: [{ translateX: getThumbTranslation() }],
      },
    ];

    return thumbStyles;
  };

  const switchElement = (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={switchStyles.switchContainer}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
    >
      <Animated.View style={getTrackStyles()}>
        <Animated.View style={getThumbStyles()} />
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
        {switchElement}
        <Text
          style={[
            switchStyles.label,
            disabled && switchStyles.labelDisabled,
            labelPosition === 'left' && switchStyles.labelLeft,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return switchElement;
};

export default Switch;