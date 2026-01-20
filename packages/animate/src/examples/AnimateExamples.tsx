/**
 * Animate Package Examples
 *
 * Demonstrates the @idealyst/animate hooks:
 * - useAnimatedStyle: State-driven style animations
 * - useAnimatedValue: Numeric value animations with interpolation
 * - usePresence: Mount/unmount animations
 * - useGradientBorder: Animated gradient borders
 */

import React, { useState } from 'react';
import { Screen, View, Text, Button, Card, Slider, Divider, Switch } from '@idealyst/components';
import { useAnimatedStyle, useAnimatedValue, usePresence, useGradientBorder } from '../index';

// =============================================================================
// useAnimatedStyle Demo
// =============================================================================

const AnimatedStyleDemo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const boxStyle = useAnimatedStyle(
    {
      opacity: isExpanded ? 1 : 0.6,
      backgroundColor: isHighlighted ? '#6366f1' : '#e5e7eb',
      borderRadius: isExpanded ? 16 : 8,
    },
    { duration: 'normal', easing: 'easeOut' }
  );

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">useAnimatedStyle</Text>
      <Text color="secondary">
        Animate styles based on state changes. Supports opacity, colors, border radius, and more.
      </Text>

      <View
        style={{
          height: 120,
          justifyContent: 'center',
          alignItems: 'center',
          ...boxStyle,
        }}
      >
        <Text weight="semibold" style={{ color: isHighlighted ? '#fff' : '#374151' }}>
          {isExpanded ? 'Expanded!' : 'Normal'}
        </Text>
      </View>

      <View direction="row" gap="sm">
        <Button
          type={isExpanded ? 'contained' : 'outlined'}
          onPress={() => setIsExpanded(!isExpanded)}
          size="sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
        <Button
          type={isHighlighted ? 'contained' : 'outlined'}
          intent={isHighlighted ? 'primary' : undefined}
          onPress={() => setIsHighlighted(!isHighlighted)}
          size="sm"
        >
          {isHighlighted ? 'Remove Color' : 'Add Color'}
        </Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`const style = useAnimatedStyle({
  opacity: isExpanded ? 1 : 0.6,
  backgroundColor: isHighlighted ? '#6366f1' : '#e5e7eb',
  borderRadius: isExpanded ? 16 : 8,
}, { duration: 'normal', easing: 'easeOut' });`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// useAnimatedValue Demo
// =============================================================================

const AnimatedValueDemo: React.FC = () => {
  const progress = useAnimatedValue(0);
  const [targetValue, setTargetValue] = useState(0);

  const handleSetProgress = (value: number) => {
    setTargetValue(value);
    progress.set(value, { duration: 'normal', easing: 'easeInOut' });
  };

  const color = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ef4444', '#eab308', '#22c55e'],
  });

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">useAnimatedValue</Text>
      <Text color="secondary">
        Animate numeric values with interpolation support. Great for progress bars and counters.
      </Text>

      <View gap="sm">
        <View
          style={{
            height: 24,
            backgroundColor: '#e5e7eb',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${progress.value * 100}%`,
              height: '100%',
              borderRadius: 12,
              backgroundColor: color,
              transition: 'width 300ms ease-out, background-color 300ms ease-out',
            }}
          />
        </View>
        <Text typography="caption" color="secondary" style={{ textAlign: 'center' }}>
          {Math.round(progress.value * 100)}%
        </Text>
      </View>

      <View gap="xs">
        <Text typography="caption" weight="semibold">Set Progress:</Text>
        <Slider
          value={targetValue}
          onValueChange={handleSetProgress}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
        />
      </View>

      <View direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
        <Button type="outlined" size="sm" onPress={() => handleSetProgress(0)}>0%</Button>
        <Button type="outlined" size="sm" onPress={() => handleSetProgress(0.25)}>25%</Button>
        <Button type="outlined" size="sm" onPress={() => handleSetProgress(0.5)}>50%</Button>
        <Button type="outlined" size="sm" onPress={() => handleSetProgress(0.75)}>75%</Button>
        <Button type="outlined" size="sm" onPress={() => handleSetProgress(1)}>100%</Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`const progress = useAnimatedValue(0);
progress.set(0.75, { duration: 'normal' });
progress.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: ['red', 'yellow', 'green'],
});`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// usePresence Demo
// =============================================================================

const PresenceDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { isPresent: isModalPresent, style: modalStyle } = usePresence(showModal, {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 'normal',
    easing: 'easeOut',
  });

  const { isPresent: isNotificationPresent, style: notificationStyle } = usePresence(showNotification, {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 'fast',
    easing: 'easeInOut',
  });

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">usePresence</Text>
      <Text color="secondary">
        Animate elements when they mount and unmount. The element stays in the DOM until the exit animation completes.
      </Text>

      <View direction="row" gap="sm">
        <Button
          type={showModal ? 'contained' : 'outlined'}
          onPress={() => setShowModal(!showModal)}
          size="sm"
        >
          {showModal ? 'Hide Modal' : 'Show Modal'}
        </Button>
        <Button
          type={showNotification ? 'contained' : 'outlined'}
          onPress={() => setShowNotification(!showNotification)}
          size="sm"
        >
          {showNotification ? 'Hide Toast' : 'Show Toast'}
        </Button>
      </View>

      <View style={{ minHeight: 160, position: 'relative' }}>
        {isModalPresent && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
              ...modalStyle,
            }}
          >
            <Text weight="semibold">Modal Content</Text>
            <Text color="secondary" typography="caption">
              This modal animates in with fade, and animates out smoothly.
            </Text>
          </View>
        )}

        {isNotificationPresent && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#22c55e',
              padding: 12,
              borderRadius: 8,
              ...notificationStyle,
            }}
          >
            <Text style={{ color: '#fff' }} weight="semibold">Success!</Text>
          </View>
        )}
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`const { isPresent, style } = usePresence(isOpen, {
  enter: { opacity: 1 },
  exit: { opacity: 0 },
  duration: 'normal',
});

{isPresent && <View style={{...baseStyle, ...style}}>...</View>}`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// useGradientBorder Demo
// =============================================================================

const GradientBorderDemo: React.FC = () => {
  const [animation, setAnimation] = useState<'spin' | 'pulse' | 'wave'>('spin');
  const [isActive, setIsActive] = useState(true);

  const spinGradient = useGradientBorder({
    colors: ['#6366f1', '#8b5cf6', '#ec4899', '#6366f1'],
    borderWidth: 3,
    borderRadius: 16,
    animation: 'spin',
    duration: 'slow',
    active: isActive && animation === 'spin',
  });

  const pulseGradient = useGradientBorder({
    colors: ['#22c55e', '#10b981', '#14b8a6', '#22c55e'],
    borderWidth: 3,
    borderRadius: 16,
    animation: 'pulse',
    duration: 'normal',
    active: isActive && animation === 'pulse',
  });

  const waveGradient = useGradientBorder({
    colors: ['#f59e0b', '#ef4444', '#ec4899', '#f59e0b'],
    borderWidth: 3,
    borderRadius: 16,
    animation: 'wave',
    duration: 'normal',
    active: isActive && animation === 'wave',
  });

  const currentGradient =
    animation === 'spin' ? spinGradient : animation === 'pulse' ? pulseGradient : waveGradient;

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">useGradientBorder</Text>
      <Text color="secondary">
        Create animated gradient borders with spin, pulse, or wave effects.
      </Text>

      <View style={{ alignItems: 'center' }}>
        <View style={{ padding: 3, ...currentGradient.containerStyle }}>
          <View
            style={{
              padding: 24,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              ...currentGradient.contentStyle,
            }}
          >
            <Text weight="semibold">Gradient Border</Text>
            <Text typography="caption" color="secondary">Animation: {animation}</Text>
          </View>
        </View>
      </View>

      <View direction="row" gap="sm" style={{ justifyContent: 'center' }}>
        <Button
          type={animation === 'spin' ? 'contained' : 'outlined'}
          onPress={() => setAnimation('spin')}
          size="sm"
        >
          Spin
        </Button>
        <Button
          type={animation === 'pulse' ? 'contained' : 'outlined'}
          onPress={() => setAnimation('pulse')}
          size="sm"
        >
          Pulse
        </Button>
        <Button
          type={animation === 'wave' ? 'contained' : 'outlined'}
          onPress={() => setAnimation('wave')}
          size="sm"
        >
          Wave
        </Button>
      </View>

      <View direction="row" gap="sm" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text typography="caption">Animation Active:</Text>
        <Switch value={isActive} onValueChange={setIsActive} />
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`const { containerStyle, contentStyle } = useGradientBorder({
  colors: ['#6366f1', '#8b5cf6', '#ec4899'],
  borderWidth: 3,
  animation: 'spin',
  active: true,
});`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Main Screen
// =============================================================================

export const AnimateExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        <Text typography="h2" weight="bold" align="center">
          Animate Examples
        </Text>
        <Text color="secondary" align="center">
          Cross-platform animation hooks for React and React Native
        </Text>

        <Divider />

        <AnimatedStyleDemo />
        <AnimatedValueDemo />
        <PresenceDemo />
        <GradientBorderDemo />

        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">About @idealyst/animate</Text>
          <Text color="secondary">
            Uses CSS transitions on web and React Native Reanimated on native for optimal performance.
            All animations run on the UI thread when possible.
          </Text>
          <View gap="xs">
            <Text typography="caption" weight="semibold">Available Hooks:</Text>
            <Text typography="caption" color="secondary">• useAnimatedStyle - State-driven style animations</Text>
            <Text typography="caption" color="secondary">• useAnimatedValue - Numeric value animations</Text>
            <Text typography="caption" color="secondary">• usePresence - Mount/unmount animations</Text>
            <Text typography="caption" color="secondary">• useGradientBorder - Animated gradient borders</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default AnimateExamples;
