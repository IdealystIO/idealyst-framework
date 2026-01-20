/**
 * Lottie Package Examples
 *
 * Demonstrates the @idealyst/lottie component:
 * - Basic Lottie animation playback
 * - Playback controls (play, pause, stop)
 * - Speed and direction controls
 * - Progress control
 * - Loop configuration
 */

import React, { useState, useRef } from 'react';
import { Screen, View, Text, Button, Card, Slider, Divider, Switch } from '@idealyst/components';
import { Lottie, LottieRef } from '../index';

// Sample Lottie animation URLs (from LottieFiles)
const SAMPLE_ANIMATIONS = {
  loading: 'https://assets2.lottiefiles.com/packages/lf20_p8bfn5to.json',
  success: 'https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  rocket: 'https://assets9.lottiefiles.com/packages/lf20_vPnn3K.json',
  heart: 'https://assets2.lottiefiles.com/packages/lf20_k86wxpgr.json',
};

// =============================================================================
// Basic Lottie Demo
// =============================================================================

const BasicLottieDemo: React.FC = () => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [loop, setLoop] = useState(true);

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Basic Usage</Text>
      <Text color="secondary">
        Simple Lottie animation with autoPlay and loop options.
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Lottie
          source={SAMPLE_ANIMATIONS.loading}
          autoPlay={autoPlay}
          loop={loop}
          style={{ width: 200, height: 200 }}
        />
      </View>

      <View direction="row" gap="lg" style={{ justifyContent: 'center' }}>
        <View direction="row" gap="sm" style={{ alignItems: 'center' }}>
          <Text typography="caption">Auto Play:</Text>
          <Switch value={autoPlay} onValueChange={setAutoPlay} />
        </View>
        <View direction="row" gap="sm" style={{ alignItems: 'center' }}>
          <Text typography="caption">Loop:</Text>
          <Switch value={loop} onValueChange={setLoop} />
        </View>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`<Lottie
  source="https://...animation.json"
  autoPlay={${autoPlay}}
  loop={${loop}}
  style={{ width: 200, height: 200 }}
/>`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Playback Controls Demo
// =============================================================================

const PlaybackControlsDemo: React.FC = () => {
  const lottieRef = useRef<LottieRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    lottieRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    lottieRef.current?.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    lottieRef.current?.stop();
    setIsPlaying(false);
  };

  const handleReset = () => {
    lottieRef.current?.reset();
  };

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Playback Controls</Text>
      <Text color="secondary">
        Use ref methods to control animation playback imperatively.
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Lottie
          ref={lottieRef}
          source={SAMPLE_ANIMATIONS.rocket}
          autoPlay={false}
          loop
          style={{ width: 200, height: 200 }}
          onComplete={() => setIsPlaying(false)}
        />
      </View>

      <View direction="row" gap="sm" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          type={isPlaying ? 'outlined' : 'contained'}
          onPress={handlePlay}
          size="sm"
          leftIcon="play"
          disabled={isPlaying}
        >
          Play
        </Button>
        <Button
          type="outlined"
          onPress={handlePause}
          size="sm"
          leftIcon="pause"
          disabled={!isPlaying}
        >
          Pause
        </Button>
        <Button
          type="outlined"
          onPress={handleStop}
          size="sm"
          leftIcon="stop"
        >
          Stop
        </Button>
        <Button
          type="outlined"
          onPress={handleReset}
          size="sm"
          leftIcon="refresh"
        >
          Reset
        </Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`const lottieRef = useRef<LottieRef>(null);

lottieRef.current?.play();
lottieRef.current?.pause();
lottieRef.current?.stop();
lottieRef.current?.reset();`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Speed & Direction Demo
// =============================================================================

const SpeedDirectionDemo: React.FC = () => {
  const lottieRef = useRef<LottieRef>(null);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handleSpeedChange = (value: number) => {
    setSpeed(value);
    lottieRef.current?.setSpeed(value);
  };

  const handleDirectionToggle = () => {
    const newDirection = direction === 1 ? -1 : 1;
    setDirection(newDirection);
    lottieRef.current?.setDirection(newDirection);
  };

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Speed & Direction</Text>
      <Text color="secondary">
        Control playback speed and direction dynamically.
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Lottie
          ref={lottieRef}
          source={SAMPLE_ANIMATIONS.heart}
          autoPlay
          loop
          speed={speed}
          style={{ width: 150, height: 150 }}
        />
      </View>

      <View gap="sm">
        <View direction="row" gap="sm" style={{ alignItems: 'center' }}>
          <Text typography="caption" style={{ width: 60 }}>Speed:</Text>
          <View style={{ flex: 1 }}>
            <Slider
              value={speed}
              onValueChange={handleSpeedChange}
              minimumValue={0.25}
              maximumValue={3}
              step={0.25}
            />
          </View>
          <Text typography="caption" style={{ width: 40 }}>{speed}x</Text>
        </View>
      </View>

      <View direction="row" gap="sm" style={{ justifyContent: 'center' }}>
        <Button type="outlined" size="sm" onPress={() => handleSpeedChange(0.5)}>0.5x</Button>
        <Button type="outlined" size="sm" onPress={() => handleSpeedChange(1)}>1x</Button>
        <Button type="outlined" size="sm" onPress={() => handleSpeedChange(2)}>2x</Button>
        <Button
          type={direction === -1 ? 'contained' : 'outlined'}
          size="sm"
          onPress={handleDirectionToggle}
          leftIcon={direction === 1 ? 'arrow-right' : 'arrow-left'}
        >
          {direction === 1 ? 'Forward' : 'Reverse'}
        </Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`lottieRef.current?.setSpeed(${speed});
lottieRef.current?.setDirection(${direction});`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Progress Control Demo
// =============================================================================

const ProgressControlDemo: React.FC = () => {
  const lottieRef = useRef<LottieRef>(null);
  const [progress, setProgress] = useState(0);

  const handleProgressChange = (value: number) => {
    setProgress(value);
    lottieRef.current?.setProgress(value);
  };

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Progress Control</Text>
      <Text color="secondary">
        Scrub through the animation manually using progress (0-1).
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Lottie
          ref={lottieRef}
          source={SAMPLE_ANIMATIONS.success}
          autoPlay={false}
          loop={false}
          progress={progress}
          style={{ width: 200, height: 200 }}
        />
      </View>

      <View gap="sm">
        <View direction="row" gap="sm" style={{ alignItems: 'center' }}>
          <Text typography="caption" style={{ width: 70 }}>Progress:</Text>
          <View style={{ flex: 1 }}>
            <Slider
              value={progress}
              onValueChange={handleProgressChange}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
            />
          </View>
          <Text typography="caption" style={{ width: 50 }}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      <View direction="row" gap="sm" style={{ justifyContent: 'center' }}>
        <Button type="outlined" size="sm" onPress={() => handleProgressChange(0)}>0%</Button>
        <Button type="outlined" size="sm" onPress={() => handleProgressChange(0.25)}>25%</Button>
        <Button type="outlined" size="sm" onPress={() => handleProgressChange(0.5)}>50%</Button>
        <Button type="outlined" size="sm" onPress={() => handleProgressChange(0.75)}>75%</Button>
        <Button type="outlined" size="sm" onPress={() => handleProgressChange(1)}>100%</Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`// Set progress directly (0-1)
lottieRef.current?.setProgress(${progress.toFixed(2)});

// Or go to specific frame
lottieRef.current?.goToAndStop(30);`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Multiple Animations Demo
// =============================================================================

const MultipleAnimationsDemo: React.FC = () => {
  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Multiple Animations</Text>
      <Text color="secondary">
        Display multiple Lottie animations with different configurations.
      </Text>

      <View direction="row" gap="md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <View style={{ alignItems: 'center' }}>
          <Lottie
            source={SAMPLE_ANIMATIONS.loading}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
          <Text typography="caption" color="secondary">Loading</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Lottie
            source={SAMPLE_ANIMATIONS.success}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
          <Text typography="caption" color="secondary">Success</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Lottie
            source={SAMPLE_ANIMATIONS.heart}
            autoPlay
            loop
            speed={0.5}
            style={{ width: 80, height: 80 }}
          />
          <Text typography="caption" color="secondary">Heart (0.5x)</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Lottie
            source={SAMPLE_ANIMATIONS.rocket}
            autoPlay
            loop
            speed={2}
            style={{ width: 80, height: 80 }}
          />
          <Text typography="caption" color="secondary">Rocket (2x)</Text>
        </View>
      </View>
    </Card>
  );
};

// =============================================================================
// Main Screen
// =============================================================================

export const LottieExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        <Text typography="h2" weight="bold" align="center">
          Lottie Examples
        </Text>
        <Text color="secondary" align="center">
          Cross-platform Lottie animations for React and React Native
        </Text>

        <Divider />

        <BasicLottieDemo />
        <PlaybackControlsDemo />
        <SpeedDirectionDemo />
        <ProgressControlDemo />
        <MultipleAnimationsDemo />

        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">About @idealyst/lottie</Text>
          <Text color="secondary">
            Render Adobe After Effects animations exported as JSON using the Bodymovin plugin.
            Uses lottie-web on web and lottie-react-native on native platforms.
          </Text>
          <View gap="xs">
            <Text typography="caption" weight="semibold">Ref Methods:</Text>
            <Text typography="caption" color="secondary">• play(), pause(), stop(), reset()</Text>
            <Text typography="caption" color="secondary">• setProgress(0-1), goToAndStop(frame)</Text>
            <Text typography="caption" color="secondary">• setSpeed(multiplier), setDirection(1|-1)</Text>
            <Text typography="caption" color="secondary">• playSegments(start, end)</Text>
            <Text typography="caption" color="secondary">• getCurrentFrame(), getTotalFrames(), getDuration()</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default LottieExamples;
