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

**How it works:** The hook watches the style object for changes. When any value changes (e.g., opacity goes from 0 to 1), it animates the transition. On mount, the initial values are applied immediately without animation. To create entrance animations, use \`usePresence\` instead, or toggle state after mount with \`useEffect\`.

**Usage:**
\`\`\`tsx
// Reactive: style changes animate automatically
const style = useAnimatedStyle(
  { opacity: isVisible ? 1 : 0, transform: { y: isVisible ? 0 : 20 } },
  { duration: 300, easing: 'easeOut' }
);
// Apply: <View style={style} />

// Entrance animation pattern: start hidden, toggle after mount
const [ready, setReady] = useState(false);
useEffect(() => { setReady(true); }, []);
const entranceStyle = useAnimatedStyle(
  { opacity: ready ? 1 : 0, transform: { y: ready ? 0 : 20 } },
  { duration: 400, easing: 'easeOut' }
);
\`\`\`

---

### useAnimatedValue(initialValue: number)

Create an animated numeric value with interpolation support. Best for **continuous/looping** animations where you control timing with \`set()\` calls.

> **REQUIRED:** The \`initialValue\` argument is mandatory. Calling \`useAnimatedValue()\` without an argument causes TS2554. Always pass an initial number: \`useAnimatedValue(0)\` or \`useAnimatedValue(1)\`.

**Returns \`AnimatedValue\`:**

| Property | Type | Description |
|----------|------|-------------|
| value | number (readonly) | Current snapshot (NOT a live binding) |
| set | (target, options?) => void | Animate to target value |
| setImmediate | (target) => void | Set value without animation |
| interpolate | (config) => T | Interpolate to another range |

> **WARNING:** \`animatedValue.value\` is a plain number snapshot. Do NOT use it directly in inline styles — it will not update during animation. Instead, use \`useAnimatedStyle\` with state for reactive animations, or use \`interpolate()\` for derived animated values.

\`\`\`tsx
// WRONG: pulse.value is a snapshot, not a live animated binding
// <View style={{ transform: { scale: pulse.value } }} />  // Will NOT animate

// CORRECT: Use useAnimatedStyle with state for pulsing animations
const [scale, setScale] = useState(1);
const style = useAnimatedStyle(
  { transform: { scale } },
  { duration: 600, easing: 'easeInOut' }
);
// Then toggle: setScale(1.3) / setScale(1) in setInterval

// CORRECT: Use useAnimatedValue for interpolation
const progress = useAnimatedValue(0);
// progress.set(1, { duration: 1000 }); // animate 0 -> 1
// const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
\`\`\`

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

## Import Checklist (copy this pattern)

When writing animation code, start with this import and ONLY use these hooks:

\`\`\`tsx
// CORRECT — the ONLY available imports from @idealyst/animate
import { useAnimatedStyle, useAnimatedValue, usePresence, useGradientBorder, withAnimated } from '@idealyst/animate';

// WRONG — these do NOT exist and will cause TS2305 errors:
// import { useSequence } from '@idealyst/animate';     // DOES NOT EXIST
// import { useKeyframes } from '@idealyst/animate';    // DOES NOT EXIST
// import { useSpring } from '@idealyst/animate';       // DOES NOT EXIST
// import { useTransition } from '@idealyst/animate';   // DOES NOT EXIST
\`\`\`

**How to achieve common patterns WITHOUT the non-existent hooks:**
- **Sequence/multi-step**: Use \`useAnimatedStyle\` + \`setTimeout\` to change state at each step
- **Keyframes/looping**: Use \`useAnimatedValue\` + \`setInterval\` to call \`.set()\` repeatedly
- **Spring**: Use \`useAnimatedStyle\` with \`easing: 'spring'\` or \`easing: 'springBouncy'\`

---

## Animatable Properties

Only certain CSS properties animate smoothly. Stick to these for best results:

| Animatable | NOT animatable (avoid in useAnimatedStyle) |
|---|---|
| \`opacity\` | \`overflow\` |
| \`transform\` (x, y, scale, rotate) | \`display\` |
| \`backgroundColor\` | \`position\` |
| \`borderColor\` | \`zIndex\` |
| \`maxHeight\` (use for expand/collapse) | \`pointerEvents\` |
| \`width\`, \`height\` | \`justifyContent\`, \`alignItems\` |
| \`borderRadius\` | \`flexDirection\` |
| \`padding\`, \`margin\` | |

For expand/collapse, animate \`opacity\` + \`maxHeight\` together. Do NOT include \`overflow: 'hidden'\` inside the animated style object — set it as a static style on the parent View instead.

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

> **STOP — Before writing animation code, verify your imports and these critical rules.**
> The ONLY hooks exported from \`@idealyst/animate\` are: \`useAnimatedStyle\`, \`useAnimatedValue\`, \`usePresence\`, \`useGradientBorder\`, \`withAnimated\`.
> There is NO \`useSequence\`, \`useKeyframes\`, \`useSpring\`, or \`useTransition\`.
> Easing values are camelCase: \`'easeOut'\`, NOT \`'ease-out'\`.
> \`useAnimatedValue\` REQUIRES an initial number argument: \`useAnimatedValue(0)\` — calling \`useAnimatedValue()\` without arguments causes TS2554.
> \`useRef\` REQUIRES an initial argument in React 19: \`useRef<T | null>(null)\` — writing \`useRef<T>()\` causes TS2554.
> For expand/collapse: NEVER use \`{condition && <View style={animStyle}>}\` — this destroys the element before exit animations run. Always render the element and animate opacity/maxHeight.

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

## Bounce / Sequence Animation (NO useSequence — use state + setTimeout)

> **There is no \`useSequence\` hook.** For multi-step animations, change state with \`setTimeout\` and let \`useAnimatedStyle\` animate each change.

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

  // Sequence: scale up -> overshoot -> settle. Just change state at each step.
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

## Pulsing / Looping / Keyframe-like Animation (NO useKeyframes — use useAnimatedValue + setInterval)

> **There is no \`useKeyframes\` hook.** For continuous/looping animations, use \`useAnimatedValue\` with \`setInterval\` to repeatedly call \`.set()\`.

\`\`\`tsx
import React, { useState, useEffect, useRef } from 'react';
import { View } from '@idealyst/components';
import { useAnimatedStyle } from '@idealyst/animate';

function PulseAnimation() {
  const [scale, setScale] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animStyle = useAnimatedStyle(
    { transform: { scale } },
    { duration: 500, easing: 'easeInOut' }
  );

  useEffect(() => {
    let growing = true;
    intervalRef.current = setInterval(() => {
      setScale(growing ? 1.1 : 1);
      growing = !growing;
    }, 500);
    return () => clearInterval(intervalRef.current!);
  }, []);

  return (
    <View padding="md" style={{ alignItems: 'center' }}>
      <View
        style={[{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#2196F3',
        }, animStyle]}
      />
    </View>
  );
}
\`\`\`

## Expand / Collapse (animate height + opacity — do NOT use conditional rendering)

> **Do NOT use \`{expanded && <View style={animStyle}>...}</View>}\`** — conditional rendering removes the element before the exit animation runs. Instead, always render the content and animate its height/opacity.

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Text, Card, Pressable, Icon } from '@idealyst/components';
import { useAnimatedStyle } from '@idealyst/animate';

function ExpandableSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  // Animate opacity + maxHeight. overflow is NOT animatable — set it as a static style.
  const contentStyle = useAnimatedStyle(
    {
      opacity: expanded ? 1 : 0,
      maxHeight: expanded ? 500 : 0,
    },
    { duration: 300, easing: 'easeOut' }
  );

  const iconStyle = useAnimatedStyle(
    { transform: { rotate: expanded ? 180 : 0 } },
    { duration: 200, easing: 'easeOut' }
  );

  return (
    <Card>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <View padding="md" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text typography="subtitle1" weight="bold">{title}</Text>
          <View style={iconStyle}>
            <Icon name="chevron-down" />
          </View>
        </View>
      </Pressable>
      {/* Always render — animate opacity + maxHeight instead of conditional rendering */}
      <View style={[{ overflow: 'hidden' }, contentStyle]} padding="md" paddingVertical="sm">
        {children}
      </View>
    </Card>
  );
}
\`\`\`

## useRef in React 19

> **React 19 requires an initial argument for useRef.** Writing \`useRef<T>()\` causes TS2554. Always pass an initial value.

\`\`\`typescript
// CORRECT
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const countRef = useRef<number>(0);
const lottieRef = useRef<LottieRef>(null);

// WRONG — TS2554: Expected 1 arguments, but got 0
// const intervalRef = useRef<ReturnType<typeof setInterval>>();
// const countRef = useRef<number>();
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
