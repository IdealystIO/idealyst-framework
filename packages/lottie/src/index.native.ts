/**
 * @idealyst/lottie - Native exports
 *
 * Cross-platform Lottie animation component for React and React Native.
 *
 * @example
 * ```tsx
 * import { Lottie, LottieRef } from '@idealyst/lottie';
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
 * // With ref for imperative control
 * const lottieRef = useRef<LottieRef>(null);
 *
 * <Lottie
 *   ref={lottieRef}
 *   source={require('./animation.json')}
 *   onComplete={() => console.log('done')}
 * />
 *
 * // Control playback
 * lottieRef.current?.play();
 * lottieRef.current?.pause();
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
export { Lottie } from './Lottie.native';
