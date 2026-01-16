/**
 * Type definitions for @idealyst/lottie
 */

import type { ViewStyle } from 'react-native';

/**
 * Lottie animation JSON structure (simplified type)
 */
export interface LottieJSON {
  v: string; // version
  fr: number; // frame rate
  ip: number; // in point
  op: number; // out point
  w: number; // width
  h: number; // height
  nm?: string; // name
  ddd?: number; // 3D
  assets?: any[];
  layers: any[];
  markers?: any[];
}

/**
 * Animation source - can be a URL, imported JSON, or require()
 */
export type LottieSource = string | LottieJSON | { uri: string };

/**
 * Animation speed multiplier
 */
export type AnimationSpeed = number;

/**
 * Loop configuration
 */
export type LoopConfig = boolean | number;

/**
 * Resize mode for the animation
 */
export type ResizeMode = 'cover' | 'contain' | 'center';

/**
 * Direction of animation playback
 */
export type AnimationDirection = 1 | -1;

/**
 * Props for the Lottie component
 */
export interface LottieProps {
  /**
   * The animation source. Can be:
   * - A URL string to a .json file
   * - An imported JSON object
   * - A require() statement (native only)
   * - An object with { uri: string }
   */
  source: LottieSource;

  /**
   * Whether to start playing immediately on mount.
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Whether to loop the animation.
   * - true: loop infinitely
   * - false: play once
   * - number: loop that many times
   * @default false
   */
  loop?: LoopConfig;

  /**
   * Playback speed multiplier.
   * - 1 = normal speed
   * - 2 = double speed
   * - 0.5 = half speed
   * - negative values play in reverse
   * @default 1
   */
  speed?: AnimationSpeed;

  /**
   * Style to apply to the container view.
   */
  style?: ViewStyle;

  /**
   * How the animation should be resized to fit its container.
   * @default 'contain'
   */
  resizeMode?: ResizeMode;

  /**
   * Initial progress value (0-1).
   * Useful for showing a specific frame on mount.
   */
  progress?: number;

  /**
   * Callback when the animation completes a loop or finishes.
   */
  onComplete?: () => void;

  /**
   * Callback when the animation is loaded and ready to play.
   */
  onLoad?: () => void;

  /**
   * Callback when there's an error loading the animation.
   */
  onError?: (error: Error) => void;

  /**
   * Callback for animation frame updates.
   * Called with the current frame number.
   */
  onAnimationUpdate?: (frame: number) => void;

  /**
   * Whether the component should render.
   * Useful for conditional rendering without unmounting.
   * @default true
   */
  visible?: boolean;

  /**
   * Test ID for testing frameworks.
   */
  testID?: string;
}

/**
 * Ref methods available on the Lottie component
 */
export interface LottieRef {
  /**
   * Start playing the animation from the current position.
   */
  play: () => void;

  /**
   * Pause the animation at the current position.
   */
  pause: () => void;

  /**
   * Stop the animation and reset to the beginning.
   */
  stop: () => void;

  /**
   * Reset the animation to the beginning without stopping.
   */
  reset: () => void;

  /**
   * Set the animation progress (0-1).
   * @param progress - Value between 0 and 1
   */
  setProgress: (progress: number) => void;

  /**
   * Go to a specific frame.
   * @param frame - Frame number
   * @param isFrame - Whether the value is a frame number (true) or time in seconds (false)
   */
  goToAndStop: (frame: number, isFrame?: boolean) => void;

  /**
   * Go to a specific frame and start playing.
   * @param frame - Frame number
   * @param isFrame - Whether the value is a frame number (true) or time in seconds (false)
   */
  goToAndPlay: (frame: number, isFrame?: boolean) => void;

  /**
   * Set the playback speed.
   * @param speed - Speed multiplier
   */
  setSpeed: (speed: number) => void;

  /**
   * Set the playback direction.
   * @param direction - 1 for forward, -1 for reverse
   */
  setDirection: (direction: AnimationDirection) => void;

  /**
   * Play a specific segment of the animation.
   * @param startFrame - Start frame
   * @param endFrame - End frame
   * @param forceFlag - Whether to force the segment (native only)
   */
  playSegments: (startFrame: number, endFrame: number, forceFlag?: boolean) => void;

  /**
   * Get the current frame number.
   */
  getCurrentFrame: () => number;

  /**
   * Get the total number of frames.
   */
  getTotalFrames: () => number;

  /**
   * Get the animation duration in seconds.
   */
  getDuration: () => number;

  /**
   * Check if the animation is currently playing.
   */
  isPlaying: () => boolean;

  /**
   * Destroy the animation instance and clean up resources.
   */
  destroy: () => void;
}
