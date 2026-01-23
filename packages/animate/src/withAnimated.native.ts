import type { ComponentType } from 'react';
import Animated from 'react-native-reanimated';

/**
 * Native implementation of withAnimated - wraps a component to work with Reanimated.
 *
 * On native, components must be wrapped with Animated.createAnimatedComponent
 * to receive animated styles from useAnimatedStyle, usePresence, etc.
 *
 * @example
 * ```tsx
 * import { View } from '@idealyst/components';
 * import { withAnimated, useAnimatedStyle } from '@idealyst/animate';
 *
 * const AnimatedView = withAnimated(View);
 *
 * function MyComponent() {
 *   const style = useAnimatedStyle(
 *     { opacity: isVisible ? 1 : 0 },
 *     { duration: 'normal' }
 *   );
 *   return <AnimatedView style={style}>Content</AnimatedView>;
 * }
 * ```
 */
export function withAnimated<T extends ComponentType<any>>(
  component: T
): ReturnType<typeof Animated.createAnimatedComponent<T>> {
  return Animated.createAnimatedComponent(component);
}
