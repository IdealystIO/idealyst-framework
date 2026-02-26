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
2. **Transform syntax** — Simplified object syntax: \`{ x: 10, y: 20, scale: 1.2, rotate: 90 }\` (rotate number auto-converts to degrees)
3. **Truly cross-platform** — Same code works on web (CSS transitions) and native (Reanimated). No platform-specific code needed.
4. **GPU-accelerated** — Prefers opacity + transform for best performance
5. **No wrapping needed** — \`useAnimatedStyle\` returns a style object you apply directly to \`<View style={style}>\`. No \`withAnimated\` HOC needed for Idealyst components.
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
  duration?: Duration;    // ms or theme token key (e.g., 300, 500)
  easing?: EasingKey;     // Theme easing key (e.g., 'easeOut', 'spring')
  delay?: number;         // Delay in ms before animation starts (e.g., 100, 200). Useful for staggered entrance animations.
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

// Staggered entrance: use delay for each item
const style1 = useAnimatedStyle(
  { opacity: ready ? 1 : 0, transform: { y: ready ? 0 : 20 } },
  { duration: 300, easing: 'easeOut', delay: 0 }
);
const style2 = useAnimatedStyle(
  { opacity: ready ? 1 : 0, transform: { y: ready ? 0 : 20 } },
  { duration: 300, easing: 'easeOut', delay: 100 }
);
const style3 = useAnimatedStyle(
  { opacity: ready ? 1 : 0, transform: { y: ready ? 0 : 20 } },
  { duration: 300, easing: 'easeOut', delay: 200 }
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

Enter/exit animations for conditional rendering. Keeps the element mounted during exit animation so the transition is visible.

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
| style | AnimatableStyle | Animated style to spread on the element |
| exit | () => void | Trigger exit animation manually |

**Usage pattern:**
\`\`\`tsx
const { isPresent, style } = usePresence(show, {
  enter: { opacity: 1, transform: { y: 0 } },
  exit: { opacity: 0, transform: { y: -20 } },
  duration: 250, easing: 'easeOut',
});
// CORRECT: conditionally render with isPresent, apply style
{isPresent && <View style={style}>Content</View>}
// WRONG: do NOT use {show && ...} — use isPresent from the hook
\`\`\`

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

**ALWAYS use object syntax** for transforms in useAnimatedStyle/usePresence:

\`\`\`typescript
// CORRECT: object syntax (required for animations)
transform: { x: 10, y: 20, scale: 1.2, rotate: 45 }

// WRONG in useAnimatedStyle: array syntax does NOT animate correctly
// transform: [{ translateX: 10 }, { translateY: 20 }]  // ❌ won't animate
\`\`\`

> **IMPORTANT:** Array-syntax transforms (React Native style) do NOT work with \`useAnimatedStyle\` or \`usePresence\`. Always use the simplified object syntax: \`transform: { x, y, scale, rotate }\`. Array syntax is only valid in static \`style\` props on non-animated elements.

| Property | Type | Maps to |
|----------|------|---------|
| x | number | translateX |
| y | number | translateY |
| scale | number | scale |
| scaleX | number | scaleX |
| scaleY | number | scaleY |
| rotate | number \\| string | rotate (number auto-converts to degrees: \`180\` → \`'180deg'\`) |
| rotateX | string | rotateX |
| rotateY | string | rotateY |
| skewX | string | skewX |
| skewY | string | skewY |
| perspective | number | perspective |

> **rotate accepts numbers:** \`transform: { rotate: 180 }\` is automatically converted to \`'180deg'\` internally. Both \`rotate: 180\` and \`rotate: '180deg'\` work identically on all platforms.

---

## withAnimated HOC

\`withAnimated\` wraps a component for animation support. **On web, it is a no-op** (CSS handles animations natively). On native, it calls \`Animated.createAnimatedComponent()\` from Reanimated.

\`\`\`tsx
import { withAnimated } from '@idealyst/animate';
import { View } from '@idealyst/components';

const AnimatedView = withAnimated(View);
\`\`\`

> **When do you need withAnimated?** In most cases, you do NOT need it. \`useAnimatedStyle\` returns a plain style object that works directly on any \`<View style={animStyle}>\`. Only use \`withAnimated\` if you need to animate a third-party component that doesn't accept style props normally.

---

## Platform Behavior

The animate package provides a unified API, but the underlying implementations differ:

| Behavior | Web | Native (iOS/Android) |
|----------|-----|---------------------|
| Engine | CSS transitions | react-native-reanimated |
| \`useAnimatedStyle\` | Sets CSS \`transition\` property | Runs on UI thread via worklets |
| \`usePresence\` | CSS transitions + requestAnimationFrame for DOM sync | Reanimated shared values |
| \`withAnimated\` | No-op (returns component as-is) | \`Animated.createAnimatedComponent()\` |
| \`easing: 'spring'\` | Approximated with CSS cubic-bezier | Native spring physics |
| Transform auto-conversion | \`rotate: 180\` → CSS \`rotate(180deg)\` | \`rotate: 180\` → \`'180deg'\` shared value |

**Key takeaway:** Your animation code is the same on all platforms. The \`@idealyst/animate\` package handles all platform differences internally. Do NOT write platform-specific animation code.
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

  // rotate accepts numbers — 180 auto-converts to '180deg' on all platforms
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
