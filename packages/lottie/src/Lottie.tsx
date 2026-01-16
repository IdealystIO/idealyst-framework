/**
 * Lottie - Web implementation
 *
 * Uses lottie-web for rendering Lottie animations on the web.
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import type { LottieProps, LottieRef, LottieJSON } from './types';

/**
 * Lottie animation component for web.
 *
 * @example
 * ```tsx
 * import { Lottie } from '@idealyst/lottie';
 *
 * // With imported JSON
 * import animationData from './animation.json';
 * <Lottie source={animationData} autoPlay loop />
 *
 * // With URL
 * <Lottie source="https://example.com/animation.json" autoPlay />
 *
 * // With ref for control
 * const lottieRef = useRef<LottieRef>(null);
 * <Lottie ref={lottieRef} source={animationData} />
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

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert loop prop to lottie-web format
  const loopValue = typeof loop === 'number' ? loop : loop;

  // Load animation
  useEffect(() => {
    if (!containerRef.current || !visible) return;

    const loadAnimation = async () => {
      try {
        // Determine animation data
        let animationData: LottieJSON | undefined;
        let path: string | undefined;

        if (typeof source === 'string') {
          // URL string
          path = source;
        } else if (typeof source === 'object' && 'uri' in source) {
          // { uri: string } format
          path = source.uri;
        } else {
          // Direct JSON object
          animationData = source as LottieJSON;
        }

        // Destroy previous animation if exists
        if (animationRef.current) {
          animationRef.current.destroy();
        }

        // Create new animation
        const anim = lottie.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop: loopValue,
          autoplay: autoPlay,
          animationData,
          path,
          rendererSettings: {
            preserveAspectRatio:
              resizeMode === 'cover'
                ? 'xMidYMid slice'
                : resizeMode === 'contain'
                  ? 'xMidYMid meet'
                  : 'xMidYMid meet',
          },
        });

        animationRef.current = anim;

        // Set speed
        anim.setSpeed(speed);

        // Set initial progress if provided
        if (progress !== undefined) {
          const frame = progress * anim.totalFrames;
          anim.goToAndStop(frame, true);
        }

        // Event handlers
        anim.addEventListener('DOMLoaded', () => {
          setIsLoaded(true);
          onLoad?.();
        });

        anim.addEventListener('complete', () => {
          onComplete?.();
        });

        anim.addEventListener('loopComplete', () => {
          // For loop counts, onComplete is called when all loops finish
          if (typeof loop === 'number') {
            // lottie-web handles loop count internally
          }
        });

        anim.addEventListener('enterFrame', (e: any) => {
          onAnimationUpdate?.(e.currentTime);
        });

        anim.addEventListener('data_failed', () => {
          onError?.(new Error('Failed to load animation data'));
        });
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    loadAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [source, visible]);

  // Update loop when it changes
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.loop = loopValue;
    }
  }, [loopValue]);

  // Update speed when it changes
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Update progress when it changes
  useEffect(() => {
    if (animationRef.current && progress !== undefined && isLoaded) {
      const frame = progress * animationRef.current.totalFrames;
      animationRef.current.goToAndStop(frame, true);
    }
  }, [progress, isLoaded]);

  // Imperative handle for ref methods
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        animationRef.current?.play();
      },
      pause: () => {
        animationRef.current?.pause();
      },
      stop: () => {
        animationRef.current?.stop();
      },
      reset: () => {
        animationRef.current?.goToAndStop(0, true);
      },
      setProgress: (value: number) => {
        if (animationRef.current) {
          const frame = value * animationRef.current.totalFrames;
          animationRef.current.goToAndStop(frame, true);
        }
      },
      goToAndStop: (frame: number, isFrame = true) => {
        animationRef.current?.goToAndStop(frame, isFrame);
      },
      goToAndPlay: (frame: number, isFrame = true) => {
        animationRef.current?.goToAndPlay(frame, isFrame);
      },
      setSpeed: (value: number) => {
        animationRef.current?.setSpeed(value);
      },
      setDirection: (direction: 1 | -1) => {
        animationRef.current?.setDirection(direction);
      },
      playSegments: (startFrame: number, endFrame: number, forceFlag = false) => {
        animationRef.current?.playSegments([startFrame, endFrame], forceFlag);
      },
      getCurrentFrame: () => {
        return animationRef.current?.currentFrame ?? 0;
      },
      getTotalFrames: () => {
        return animationRef.current?.totalFrames ?? 0;
      },
      getDuration: () => {
        if (!animationRef.current) return 0;
        return animationRef.current.totalFrames / animationRef.current.frameRate;
      },
      isPlaying: () => {
        return animationRef.current ? !animationRef.current.isPaused : false;
      },
      destroy: () => {
        animationRef.current?.destroy();
        animationRef.current = null;
      },
    }),
    []
  );

  if (!visible) {
    return null;
  }

  // Convert ViewStyle to CSSProperties for web
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    ...(style as React.CSSProperties),
  };

  return <div ref={containerRef} style={containerStyle} data-testid={testID} />;
});

Lottie.displayName = 'Lottie';
