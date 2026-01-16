/**
 * @idealyst/lottie - Web exports
 *
 * Cross-platform Lottie animation component for React and React Native.
 *
 * @example
 * ```tsx
 * import { Lottie, LottieRef } from '@idealyst/lottie';
 *
 * // Basic usage
 * <Lottie source="https://example.com/animation.json" autoPlay loop />
 *
 * // With imported JSON
 * import animationData from './animation.json';
 * <Lottie source={animationData} autoPlay />
 *
 * // With ref for imperative control
 * const lottieRef = useRef<LottieRef>(null);
 *
 * <Lottie
 *   ref={lottieRef}
 *   source={animationData}
 *   onComplete={() => console.log('done')}
 * />
 *
 * // Control playback
 * lottieRef.current?.play();
 * lottieRef.current?.pause();
 * lottieRef.current?.setProgress(0.5);
 * ```
 */

// Type exports
export type {
  LottieProps,
  LottieRef,
  LottieJSON,
  LottieSource,
  AnimationSpeed,
  LoopConfig,
  ResizeMode,
  AnimationDirection,
} from './types';

// Component export
export { Lottie } from './Lottie';
