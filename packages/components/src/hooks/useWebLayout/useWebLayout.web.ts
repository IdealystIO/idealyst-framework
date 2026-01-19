import { useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from './types';

/**
 * Hook that provides onLayout functionality for web components using ResizeObserver.
 * Returns a ref that should be attached to the element you want to observe.
 *
 * @param onLayout - Callback fired when layout changes, with React Native compatible event shape
 * @returns A ref to attach to the observed element
 */
export function useWebLayout<T extends HTMLElement = HTMLElement>(
  onLayout: ((event: LayoutChangeEvent) => void) | undefined
) {
  const ref = useRef<T>(null);
  // Store callback in a ref to avoid re-running effect when callback identity changes
  const onLayoutRef = useRef(onLayout);
  onLayoutRef.current = onLayout;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const fireLayoutEvent = () => {
      if (!onLayoutRef.current) return;
      const rect = element.getBoundingClientRect();
      onLayoutRef.current({
        nativeEvent: {
          layout: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
        },
      });
    };

    // Call immediately with initial layout
    fireLayoutEvent();

    // Set up ResizeObserver for subsequent changes
    const resizeObserver = new ResizeObserver(() => {
      fireLayoutEvent();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return ref;
}
