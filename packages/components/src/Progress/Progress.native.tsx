import React from 'react';
import { View, Animated } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import Svg, { Circle } from 'react-native-svg';
import Text from '../Text';
import { progressStyles } from './Progress.styles';
import type { ProgressProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  variant = 'linear',
  intent = 'primary',
  size = 'medium',
  indeterminate = false,
  showLabel = false,
  label,
  style,
  testID,
}) => {
  const theme = UnistylesRuntime.theme;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const slideAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [percentage, indeterminate, animatedValue, slideAnimation]);

  const getBarStyles = () => {
    const barStyles = [progressStyles.linearBar];

    if (intent === 'success') barStyles.push(progressStyles.linearBarSuccess);
    else if (intent === 'error') barStyles.push(progressStyles.linearBarError);
    else if (intent === 'warning') barStyles.push(progressStyles.linearBarWarning);
    else if (intent === 'neutral') barStyles.push(progressStyles.linearBarNeutral);

    return barStyles;
  };

  const getIndeterminateBarStyles = () => {
    const barStyles = [progressStyles.indeterminateBar];

    if (intent === 'success') barStyles.push(progressStyles.indeterminateBarSuccess);
    else if (intent === 'error') barStyles.push(progressStyles.indeterminateBarError);
    else if (intent === 'warning') barStyles.push(progressStyles.indeterminateBarWarning);
    else if (intent === 'neutral') barStyles.push(progressStyles.indeterminateBarNeutral);

    return barStyles;
  };

  const getLabelStyles = () => {
    const labelStyles = [progressStyles.label];
    if (size === 'medium') labelStyles.push(progressStyles.labelMedium);
    if (size === 'large') labelStyles.push(progressStyles.labelLarge);
    return labelStyles;
  };

  const getCircularSize = () => {
    if (size === 'small') return 32;
    if (size === 'large') return 64;
    return 48;
  };

  const getBarColor = () => {
    if (intent === 'success') return theme.intents?.success?.main || '#22c55e';
    if (intent === 'error') return theme.intents?.error?.main || '#ef4444';
    if (intent === 'warning') return theme.intents?.warning?.main || '#f59e0b';
    if (intent === 'neutral') return theme.colors?.neutral?.[6] || '#52525b';
    return theme.intents?.primary?.main || '#3b82f6';
  };

  if (variant === 'circular') {
    const circularSize = getCircularSize();
    const strokeWidth = size === 'small' ? 3 : size === 'large' ? 5 : 4;
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const rotateAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (indeterminate) {
        Animated.loop(
          Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          })
        ).start();
      }
    }, [indeterminate, rotateAnimation]);

    const strokeDashoffset = indeterminate
      ? 0
      : animatedValue.interpolate({
          inputRange: [0, 100],
          outputRange: [circumference, 0],
        });

    const rotation = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={[progressStyles.circularContainer, { width: circularSize, height: circularSize }, style]} testID={testID}>
        <Animated.View
          style={[
            progressStyles.circularSvg,
            indeterminate && { transform: [{ rotate: rotation }] },
          ]}
        >
          <Svg width={circularSize} height={circularSize}>
            <Circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={theme.colors?.neutral?.[3] || '#d4d4d8'}
            />
            <AnimatedCircle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={getBarColor()}
              strokeDasharray={indeterminate ? `${circumference * 0.8} ${circumference * 0.2}` : `${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
        {showLabel && (
          <Text style={[progressStyles.circularLabel, ...getLabelStyles()]}>
            {label || `${Math.round(percentage)}%`}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[progressStyles.container, style]} testID={testID} accessibilityRole="progressbar">
      <View
        style={[
          progressStyles.linearTrack,
          size === 'small' && progressStyles.linearTrackSmall,
          size === 'medium' && progressStyles.linearTrackMedium,
          size === 'large' && progressStyles.linearTrackLarge,
        ]}
      >
        {indeterminate ? (
          <Animated.View
            style={[
              getIndeterminateBarStyles(),
              {
                transform: [{
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 400],
                  }),
                }],
              },
            ]}
          />
        ) : (
          <Animated.View
            style={[
              getBarStyles(),
              {
                width: animatedValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
      {showLabel && (
        <Text style={getLabelStyles()}>
          {label || `${Math.round(percentage)}%`}
        </Text>
      )}
    </View>
  );
};

export default Progress;