/**
 * Animate Package Guides
 *
 * Comprehensive documentation for @idealyst/animate.
 */

export const animateGuides: Record<string, string> = {
  "idealyst://animate/overview": `# @idealyst/animate

Cross-platform animation hooks using CSS transitions (web) and Reanimated (native).

## Installation

\`\`\`bash
yarn add @idealyst/animate
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ CSS Transitions / Animations |
| iOS      | ✅ react-native-reanimated |
| Android  | ✅ react-native-reanimated |

## Key Exports

\`\`\`typescript
import {
  useAnimatedStyle,    // Animate style changes
  useAnimatedValue,    // Animated numeric value with interpolation
  usePresence,         // Enter/exit animations
  useGradientBorder,   // Animated gradient borders
  withAnimated,        // HOC to wrap any component for animation
} from '@idealyst/animate';
\`\`\`

> **There is NO \`useSequence\` or \`useKeyframes\` export.** For multi-step animations, chain \`useAnimatedStyle\` calls with state changes. For looping animations, use \`useAnimatedValue\` with repeated \`set()\` calls.

## Easing Values

Easing values use **camelCase** (NOT CSS hyphenated format). Available values:
\`\`\`
'ease' | 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' |
'spring' | 'standard' | 'accelerate' | 'decelerate' |
'springStiff' | 'springBouncy'
\`\`\`
> **IMPORTANT:** Use \`'easeOut'\` — NOT \`'ease-out'\`. All easing values are camelCase.

## Key Concepts

1. **Theme integration** — Duration and easing values come from \`@idealyst/theme/animation\`
2. **Transform syntax** — Simplified object syntax: \`{ x: 10, y: 20, scale: 1.2 }\` instead of arrays
3. **Platform overrides** — Customize animation behavior per-platform
4. **GPU-accelerated** — Prefers opacity + transform for best performance
`,

  "idealyst://animate/api": `# @idealyst/animate — API Reference

## Available Exports (COMPLETE LIST)

\`\`\`typescript
import {
  useAnimatedStyle,    // Animate style changes
  useAnimatedValue,    // Animated numeric value with interpolation
  usePresence,         // Enter/exit animations
  useGradientBorder,   // Animated gradient borders
  withAnimated,        // HOC to wrap any component for animation
} from '@idealyst/animate';
\`\`\`

> **There are exactly 5 exports.** There is NO \`useSequence\`, \`useKeyframes\`, \`useSpring\`, or \`useTransition\`.
> For multi-step animations, use \`useAnimatedStyle\` with state changes. For looping, use \`useAnimatedValue\` with repeated \`set()\` calls.

## Easing Values (EXACT string literals)

Easing values are **camelCase** — NOT CSS kebab-case. Using \`'ease-out'\` will cause a TypeScript error.

| Valid (use these) | INVALID (do NOT use) |
|---|---|
| \`'easeOut'\` | ~~\`'ease-out'\`~~ |
| \`'easeIn'\` | ~~\`'ease-in'\`~~ |
| \`'easeInOut'\` | ~~\`'ease-in-out'\`~~ |

All valid easing values:
\`\`\`typescript
type EasingKey = 'ease' | 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  | 'spring' | 'standard' | 'accelerate' | 'decelerate'
  | 'springStiff' | 'springBouncy';
\`\`\`

---

## Hooks

### useAnimatedStyle(style, options?)

Animate any style property changes. Returns an animated style object.

\`\`\`typescript
interface AnimationOptions {
  duration?: Duration;    // ms or theme token key
  easing?: EasingKey;     // Theme easing key
  delay?: number;         // Delay before animation (ms)
}

interface UseAnimatedStyleOptions extends AnimationOptions {
  web?: AnimationOptions & { transition?: string };      // Web overrides
  native?: AnimationOptions & { useSpring?: boolean; springType?: SpringType };  // Native overrides
}
\`\`\`

**Usage:**
\`\`\`tsx
const style = useAnimatedStyle(
  { opacity: isVisible ? 1 : 0, transform: { y: isVisible ? 0 : 20 } },
  { duration: 300, easing: 'easeOut' }
);
// Apply: <View style={style} />
\`\`\`

---

### useAnimatedValue(initialValue)

Create an animated numeric value with interpolation support.

**Returns \`AnimatedValue\`:**

| Property | Type | Description |
|----------|------|-------------|
| value | number (readonly) | Current value |
| set | (target, options?) => void | Animate to target value |
| setImmediate | (target) => void | Set value without animation |
| interpolate | (config) => T | Interpolate to another range |

\`\`\`typescript
interface InterpolationConfig<T> {
  inputRange: number[];
  outputRange: T[];
  extrapolate?: 'extend' | 'clamp' | 'identity';
}
\`\`\`

---

### usePresence(isPresent, options)

Enter/exit animations for conditional rendering.

\`\`\`typescript
interface UsePresenceOptions extends AnimationOptions {
  enter: AnimatableProperties;    // Style when entering/visible
  exit: AnimatableProperties;     // Style when exiting/hidden
  initial?: AnimatableProperties; // Initial style (defaults to exit)
}
\`\`\`

**Returns \`UsePresenceResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| isPresent | boolean | Whether element should be rendered |
| style | AnimatableStyle | Animated style |
| exit | () => void | Trigger exit animation manually |

---

### useGradientBorder(options)

Animated gradient borders.

\`\`\`typescript
interface UseGradientBorderOptions {
  colors: string[];                        // Gradient colors
  borderWidth?: number;                    // Border width in px
  borderRadius?: number;                   // Border radius in px
  duration?: Duration;                     // Animation duration
  animation?: 'spin' | 'pulse' | 'wave';  // Animation type
  active?: boolean;                        // Whether active
}
\`\`\`

**Returns \`UseGradientBorderResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| containerStyle | AnimatableStyle | Style for outer container |
| contentStyle | AnimatableStyle | Style for inner content |
| isReady | boolean | Whether gradient CSS injected (web) |

---

## Transform Syntax

Use simplified object syntax instead of React Native arrays:

\`\`\`typescript
// Recommended: object syntax
transform: { x: 10, y: 20, scale: 1.2, rotate: 45 }

// Legacy: array syntax (still supported)
transform: [{ translateX: 10 }, { translateY: 20 }, { scale: 1.2 }]
\`\`\`

| Property | Type | Maps to |
|----------|------|---------|
| x | number | translateX |
| y | number | translateY |
| scale | number | scale |
| scaleX | number | scaleX |
| scaleY | number | scaleY |
| rotate | number \\| string | rotate |
| rotateX | string | rotateX |
| rotateY | string | rotateY |
| skewX | string | skewX |
| skewY | string | skewY |
| perspective | number | perspective |
`,

  "idealyst://animate/examples": `# @idealyst/animate — Examples

## Fade In/Out

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { useAnimatedStyle } from '@idealyst/animate';

function FadeExample() {
  const [visible, setVisible] = useState(true);

  const style = useAnimatedStyle(
    { opacity: visible ? 1 : 0, transform: { y: visible ? 0 : -10 } },
    { duration: 300, easing: 'easeOut' }
  );

  return (
    <View padding="md" gap="md">
      <Button onPress={() => setVisible(!visible)}>Toggle</Button>
      <View style={style}>
        <Text>Hello, animated world!</Text>
      </View>
    </View>
  );
}
\`\`\`

## Animated Counter

\`\`\`tsx
import React, { useState, useCallback } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { useAnimatedValue } from '@idealyst/animate';

function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const animValue = useAnimatedValue(0);

  const increment = useCallback(() => {
    const next = count + 1;
    setCount(next);
    animValue.set(next, { duration: 500, easing: 'easeOut' });
  }, [count]);

  const color = animValue.interpolate({
    inputRange: [0, 5, 10],
    outputRange: ['#4CAF50', '#FFC107', '#F44336'],
    extrapolate: 'clamp',
  });

  return (
    <View padding="md" gap="md">
      <Text style={{ fontSize: 48, color }}>
        {count}
      </Text>
      <Button onPress={increment}>Increment</Button>
    </View>
  );
}
\`\`\`

## Multi-Step Animation (using state + useAnimatedStyle)

\`\`\`tsx
import React, { useState, useCallback } from 'react';
import { View, Button } from '@idealyst/components';
import { useAnimatedStyle } from '@idealyst/animate';

function BounceExample() {
  const [scale, setScale] = useState(1);

  const style = useAnimatedStyle(
    { transform: { scale } },
    { duration: 200, easing: 'easeOut' }
  );

  const bounce = useCallback(() => {
    setScale(1.2);
    setTimeout(() => setScale(0.9), 200);
    setTimeout(() => setScale(1), 350);
  }, []);

  return (
    <View padding="md" gap="md" style={{ alignItems: 'center' }}>
      <View style={[{ width: 100, height: 100, backgroundColor: '#4CAF50', borderRadius: 12 }, style]} />
      <Button onPress={bounce}>Bounce</Button>
    </View>
  );
}
\`\`\`

## Enter/Exit with usePresence

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Card, Text } from '@idealyst/components';
import { usePresence } from '@idealyst/animate';

function PresenceExample() {
  const [show, setShow] = useState(false);
  const { isPresent, style } = usePresence(show, {
    enter: { opacity: 1, transform: { y: 0, scale: 1 } },
    exit: { opacity: 0, transform: { y: -20, scale: 0.95 } },
    duration: 250,
    easing: 'easeOut',
  });

  return (
    <View padding="md" gap="md">
      <Button onPress={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} Card
      </Button>
      {isPresent && (
        <Card style={style} padding="md">
          <Text>Animated card content</Text>
        </Card>
      )}
    </View>
  );
}
\`\`\`

## Pulsing Animation (using useAnimatedValue)

\`\`\`tsx
import React, { useEffect, useRef } from 'react';
import { View } from '@idealyst/components';
import { useAnimatedValue } from '@idealyst/animate';

function PulseAnimation() {
  const pulse = useAnimatedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    let growing = true;
    intervalRef.current = setInterval(() => {
      pulse.set(growing ? 1.1 : 1, { duration: 500, easing: 'easeInOut' });
      growing = !growing;
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const style = { transform: [{ scale: pulse.value }] };

  return (
    <View padding="md" style={{ alignItems: 'center' }}>
      <View
        style={[
          { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2196F3' },
          style,
        ]}
      />
    </View>
  );
}
\`\`\`

## Gradient Border

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { useGradientBorder } from '@idealyst/animate';

function GradientBorderCard() {
  const { containerStyle, contentStyle } = useGradientBorder({
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1'],
    borderWidth: 2,
    borderRadius: 12,
    animation: 'spin',
    duration: 3000,
    active: true,
  });

  return (
    <View style={containerStyle}>
      <View style={[contentStyle, { padding: 20 }]}>
        <Text>Content with animated gradient border</Text>
      </View>
    </View>
  );
}
\`\`\`
`,
};
