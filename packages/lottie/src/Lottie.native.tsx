/**
 * Lottie - Native implementation
 *
 * Uses lottie-react-native for rendering Lottie animations on React Native.
 */

import React, { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import LottieView from 'lottie-react-native';
import type { LottieProps, LottieRef, LottieJSON, LottieSource } from './types';

/**
 * Lottie animation component for React Native.
 *
 * @example
 * ```tsx
 * import { Lottie } from '@idealyst/lottie';
 *
 * // With require (recommended for native)
 * <Lottie source={require('./animation.json')} autoPlay loop />
 *
 * // With imported JSON
 * import animationData from './animation.json';
 * <Lottie source={animationData} autoPlay />
 *
 * // With URL
 * <Lottie source={{ uri: 'https://example.com/animation.json' }} autoPlay />
 *
 * // With ref for control
 * const lottieRef = useRef<LottieRef>(null);
 * <Lottie ref={lottieRef} source={require('./animation.json')} />
 * lottieRef.current?.play();
 * ```
 */
export const Lottie = forwardRef<LottieRef, LottieProps>((props, ref) => {
  const {
    source,
    autoPlay = true,
    loop = false,
    speed = 1,
    style,
    resizeMode = 'contain',
    progress,
    onComplete,
    onLoad,
    onError,
    onAnimationUpdate,
    visible = true,
    testID,
  } = props;

  const lottieRef = useRef<LottieView>(null);
  const isPlayingRef = useRef(autoPlay);
  const totalFramesRef = useRef(0);
  const frameRateRef = useRef(30);

  // Convert source to lottie-react-native format
  const getSource = (): any => {
    if (typeof source === 'string') {
      // URL string - wrap in uri object
      return { uri: source };
    }
    if (typeof source === 'object' && 'uri' in source) {
      // Already in { uri: string } format
      return source;
    }
    // Direct JSON object or require()
    return source;
  };

  // Handle animation load
  const handleLoad = useCallback(() => {
    // Try to get animation info from the ref
    // Note: lottie-react-native doesn't expose these directly in all cases
    onLoad?.();
  }, [onLoad]);

  // Handle animation finish
  const handleFinish = useCallback(
    (isCancelled: boolean) => {
      if (!isCancelled) {
        isPlayingRef.current = false;
        onComplete?.();
      }
    },
    [onComplete]
  );

  // Handle animation failure
  const handleFailure = useCallback(
    (error: any) => {
      onError?.(new Error(error?.message || 'Failed to load animation'));
    },
    [onError]
  );

  // Imperative handle for ref methods
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        isPlayingRef.current = true;
        lottieRef.current?.play();
      },
      pause: () => {
        isPlayingRef.current = false;
        lottieRef.current?.pause();
      },
      stop: () => {
        isPlayingRef.current = false;
        lottieRef.current?.reset();
      },
      reset: () => {
        lottieRef.current?.reset();
      },
      setProgress: (value: number) => {
        // lottie-react-native uses progress prop for this
        // For imperative control, we need to use play with segments
        if (lottieRef.current && totalFramesRef.current > 0) {
          const frame = Math.floor(value * totalFramesRef.current);
          lottieRef.current.play(frame, frame);
        }
      },
      goToAndStop: (frame: number, isFrame = true) => {
        isPlayingRef.current = false;
        if (lottieRef.current) {
          // Play to the frame and immediately pause
          lottieRef.current.play(frame, frame);
        }
      },
      goToAndPlay: (frame: number, isFrame = true) => {
        isPlayingRef.current = true;
        if (lottieRef.current) {
          lottieRef.current.play(frame, undefined);
        }
      },
      setSpeed: (value: number) => {
        // Speed is controlled via prop, not imperatively in lottie-react-native
        console.warn('setSpeed: Use the speed prop instead for native');
      },
      setDirection: (direction: 1 | -1) => {
        // Direction is controlled via speed sign
        console.warn('setDirection: Use negative speed for reverse playback');
      },
      playSegments: (startFrame: number, endFrame: number, forceFlag = false) => {
        isPlayingRef.current = true;
        lottieRef.current?.play(startFrame, endFrame);
      },
      getCurrentFrame: () => {
        // Not directly available in lottie-react-native
        return 0;
      },
      getTotalFrames: () => {
        return totalFramesRef.current;
      },
      getDuration: () => {
        return totalFramesRef.current / frameRateRef.current;
      },
      isPlaying: () => {
        return isPlayingRef.current;
      },
      destroy: () => {
        // React Native handles cleanup automatically
        lottieRef.current?.reset();
      },
    }),
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <LottieView
      ref={lottieRef}
      source={getSource()}
      autoPlay={autoPlay}
      loop={typeof loop === 'boolean' ? loop : true}
      speed={speed}
      style={style}
      resizeMode={resizeMode}
      progress={progress}
      onAnimationLoaded={handleLoad}
      onAnimationFinish={handleFinish}
      onAnimationFailure={handleFailure}
      testID={testID}
    />
  );
});

Lottie.displayName = 'Lottie';
