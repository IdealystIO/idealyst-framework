/**
 * Lottie Package Guides
 *
 * Comprehensive documentation for @idealyst/lottie.
 */

export const lottieGuides: Record<string, string> = {
  "idealyst://lottie/overview": `# @idealyst/lottie

Cross-platform Lottie animation component for rendering After Effects animations.

## Installation

\`\`\`bash
yarn add @idealyst/lottie
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ lottie-web |
| iOS      | ✅ lottie-ios |
| Android  | ✅ lottie-android |

## Key Exports

\`\`\`typescript
import { Lottie } from '@idealyst/lottie';
import type { LottieProps, LottieRef, LottieSource } from '@idealyst/lottie';
\`\`\`

## Quick Start

\`\`\`tsx
import { Lottie } from '@idealyst/lottie';

function LoadingAnimation() {
  return (
    <Lottie
      source="https://assets.lottiefiles.com/packages/lf20_loading.json"
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
\`\`\`
`,

  "idealyst://lottie/api": `# @idealyst/lottie — API Reference

## Lottie Component

### LottieProps

\`\`\`typescript
interface LottieProps {
  /**
   * Animation source:
   * - URL string to .json file
   * - Imported JSON object
   * - require() statement (native only)
   * - { uri: string } object
   */
  source: LottieSource;

  /** Auto-play on mount (default: true) */
  autoPlay?: boolean;

  /** Loop: true = infinite, false = once, number = N times (default: false) */
  loop?: boolean | number;

  /** Playback speed: 1 = normal, 2 = double, 0.5 = half (default: 1) */
  speed?: number;

  /** Container style */
  style?: ViewStyle;

  /** Resize mode (default: 'contain') */
  resizeMode?: 'cover' | 'contain' | 'center';

  /** Initial progress 0-1 */
  progress?: number;

  /** Callback when animation completes a loop or finishes */
  onComplete?: () => void;

  /** Callback when animation is loaded */
  onLoad?: () => void;

  /** Callback on load error */
  onError?: (error: Error) => void;

  /** Frame update callback */
  onAnimationUpdate?: (frame: number) => void;

  /** Conditional rendering (default: true) */
  visible?: boolean;

  testID?: string;
}
\`\`\`

### LottieSource Type

\`\`\`typescript
type LottieSource = string | LottieJSON | { uri: string };
\`\`\`

---

### LottieRef (imperative methods)

Access via \`useRef<LottieRef>()\` and \`ref\` prop.

| Method | Description |
|--------|-------------|
| play() | Start playing from current position |
| pause() | Pause at current position |
| stop() | Stop and reset to beginning |
| reset() | Reset to beginning without stopping |
| setProgress(p) | Set progress (0-1) |
| goToAndStop(frame, isFrame?) | Go to frame/time and stop |
| goToAndPlay(frame, isFrame?) | Go to frame/time and play |
| setSpeed(speed) | Set playback speed |
| setDirection(dir) | Set direction: 1 (forward) or -1 (reverse) |
| playSegments(start, end, force?) | Play specific frame range |
| getCurrentFrame() | Get current frame number |
| getTotalFrames() | Get total frames |
| getDuration() | Get duration in seconds |
| isPlaying() | Check if playing |
| destroy() | Clean up resources |
`,

  "idealyst://lottie/examples": `# @idealyst/lottie — Examples

## Basic Animation

\`\`\`tsx
import React from 'react';
import { View } from '@idealyst/components';
import { Lottie } from '@idealyst/lottie';

function SuccessAnimation() {
  return (
    <View style={{ alignItems: 'center' }} padding="lg">
      <Lottie
        source="https://assets.lottiefiles.com/packages/lf20_success.json"
        autoPlay
        loop={false}
        style={{ width: 150, height: 150 }}
        onComplete={() => console.log('Animation done')}
      />
    </View>
  );
}
\`\`\`

## Imported JSON

\`\`\`tsx
import React from 'react';
import { Lottie } from '@idealyst/lottie';
import loadingAnimation from '../assets/loading.json';

function LoadingSpinner() {
  return (
    <Lottie
      source={loadingAnimation}
      autoPlay
      loop
      speed={1.5}
      style={{ width: 100, height: 100 }}
    />
  );
}
\`\`\`

## Controlled with Ref

\`\`\`tsx
import React, { useRef } from 'react';
import { View, Button } from '@idealyst/components';
import { Lottie } from '@idealyst/lottie';
import type { LottieRef } from '@idealyst/lottie';

function ControlledAnimation() {
  const lottieRef = useRef<LottieRef>(null);

  return (
    <View padding="md" gap="md" style={{ alignItems: 'center' }}>
      <Lottie
        ref={lottieRef}
        source="https://assets.lottiefiles.com/packages/lf20_animation.json"
        autoPlay={false}
        loop
        style={{ width: 200, height: 200 }}
      />
      <View style={{ flexDirection: 'row' }} gap="sm">
        <Button onPress={() => lottieRef.current?.play()} size="sm">Play</Button>
        <Button onPress={() => lottieRef.current?.pause()} size="sm">Pause</Button>
        <Button onPress={() => lottieRef.current?.stop()} size="sm">Stop</Button>
      </View>
      <View style={{ flexDirection: 'row' }} gap="sm">
        <Button
          onPress={() => lottieRef.current?.setSpeed(2)}
          size="sm"
          intent="secondary"
        >
          2x Speed
        </Button>
        <Button
          onPress={() => lottieRef.current?.setDirection(-1)}
          size="sm"
          intent="secondary"
        >
          Reverse
        </Button>
        <Button
          onPress={() => lottieRef.current?.playSegments(0, 30)}
          size="sm"
          intent="secondary"
        >
          First 30 Frames
        </Button>
      </View>
    </View>
  );
}
\`\`\`

## Progress-Based (Scroll-Linked)

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import { Lottie } from '@idealyst/lottie';

function ScrollLinkedAnimation() {
  const [progress, setProgress] = useState(0);

  return (
    <View padding="md" gap="md">
      <Lottie
        source="https://example.com/scroll-animation.json"
        autoPlay={false}
        progress={progress}
        style={{ width: 300, height: 200 }}
      />
      {/* Slider to simulate scroll progress */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }} gap="sm">
        <Text>0%</Text>
        <input
          type="range"
          min={0}
          max={100}
          value={progress * 100}
          onChange={(e) => setProgress(Number(e.target.value) / 100)}
          style={{ flex: 1 }}
        />
        <Text>100%</Text>
      </View>
    </View>
  );
}
\`\`\`
`,
};
