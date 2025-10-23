import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateSmartPosition, type Placement } from '../utils/positionUtils.native';

export interface UseSmartPositionOptions {
  placement?: Placement;
  offset?: number;
  maxHeight?: number;
  matchWidth?: boolean;
}

export interface SmartPosition {
  top: number;
  left: number;
  width: number;
}

export interface SmartSize {
  width: number;
  height: number;
}

export interface UseSmartPositionReturn {
  position: SmartPosition;
  size: SmartSize;
  isPositioned: boolean;
  anchorRef: React.MutableRefObject<any>;
  measureAndPosition: () => void;
  handleLayout: (event: any) => void;
  reset: () => void;
}

/**
 * Hook for smart positioning of modals/dropdowns with automatic flip detection
 * and stable measurement-based positioning.
 *
 * This hook handles the complex two-phase rendering pattern:
 * 1. Render invisible at initial position
 * 2. Measure actual content size
 * 3. Calculate final position based on measured size
 * 4. Show once positioned and measurements are stable
 */
export const useSmartPosition = ({
  placement = 'bottom-start',
  offset = 8,
  maxHeight = 300,
  matchWidth = false,
}: UseSmartPositionOptions = {}): UseSmartPositionReturn => {
  const [position, setPosition] = useState<SmartPosition>({ top: 0, left: 0, width: 0 });
  const [size, setSize] = useState<SmartSize>({ width: 0, height: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const anchorRef = useRef<any>(null);
  const anchorMeasurements = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const previousHeightRef = useRef<number>(0);
  const rafRef = useRef<any | null>(null);
  const insets = useSafeAreaInsets();

  // Calculate position based on anchor and content measurements
  const calculatePosition = (x: number, y: number, width: number, height: number) => {
    // For flip detection, use maxHeight to properly detect insufficient space
    // But once we have a measured height, use that for tighter positioning
    let heightForPositioning = maxHeight;

    if (size.height > 0) {
      // We have a measured height - use it if it's less than maxHeight
      heightForPositioning = Math.min(size.height, maxHeight);
    }

    const desiredSize = {
      width: size.width,
      height: heightForPositioning
    };

    // Calculate position with flip detection
    const calculatedPosition = calculateSmartPosition(
      { x, y, width, height },
      desiredSize,
      placement,
      offset,
      matchWidth,
      insets
    );

    setPosition({
      top: calculatedPosition.top,
      left: calculatedPosition.left,
      width: calculatedPosition.width || width,
    });
  };

  // Recalculate position when size changes
  useEffect(() => {
    if (anchorMeasurements.current && size.width > 0 && size.height > 0) {
      const { x, y, width, height } = anchorMeasurements.current;
      calculatePosition(x, y, width, height);

      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Wait for next frame to allow layout to settle before showing
      rafRef.current = setTimeout(() => {
          setIsPositioned(true);
          rafRef.current = null;
      }, 20)
    }

    return () => {
      if (rafRef.current !== null) {
        clearTimeout(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [size]);

  // Measure anchor and set initial position
  const measureAndPosition = () => {
    anchorRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      // Store anchor measurements for potential recalculation
      anchorMeasurements.current = { x, y, width, height };

      // Set initial position (will be adjusted after measurement)
      setPosition({ top: y + height + offset, left: x, width });
      setIsPositioned(false);
      previousHeightRef.current = 0;
    });
  };

  // Handle layout measurement from content
  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;

    if (__DEV__) {
      console.log('[useSmartPosition] onLayout:', { width, height, currentSize: size, isPositioned });
    }

    // Only update if size has changed significantly
    if (Math.abs(width - size.width) > 1 || Math.abs(height - size.height) > 1) {
      if (__DEV__) {
        console.log('[useSmartPosition] Size changed, updating');
      }
      previousHeightRef.current = size.height;
      setSize({ width, height });
    }
  };

  // Reset state (call when closing modal)
  const reset = () => {
    if (rafRef.current !== null) {
      clearTimeout(rafRef.current);
      rafRef.current = null;
    }
    setIsPositioned(false);
    setSize({ width: 0, height: 0 });
    previousHeightRef.current = 0;
  };

  return {
    position,
    size,
    isPositioned,
    anchorRef,
    measureAndPosition,
    handleLayout,
    reset,
  };
};
