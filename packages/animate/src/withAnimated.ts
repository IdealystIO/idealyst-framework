import type { ComponentType } from 'react';

/**
 * Web implementation of withAnimated - a no-op that returns the component as-is.
 *
 * On web, CSS transitions handle animations automatically on regular elements,
 * so no HOC wrapping is needed.
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
export function withAnimated<T extends ComponentType<any>>(component: T): T {
  return component;
}
