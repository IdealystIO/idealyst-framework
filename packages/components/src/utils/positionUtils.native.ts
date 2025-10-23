import { Dimensions } from 'react-native';

/**
 * Calculate the maximum available height for content at a given position
 * This matches the logic in BoundedModalContent to ensure positioning is accurate
 */
export const calculateAvailableHeight = (
  top: number,
  safeAreaInsets?: SafeAreaInsets
): number => {
  const { height: windowHeight } = Dimensions.get('window');
  const padding = 12;
  const bottomSafeEdge = windowHeight - (safeAreaInsets?.bottom || 0);
  const bottomBound = bottomSafeEdge - padding;
  return Math.max(100, bottomBound - top);
};

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface Position {
  top: number;
  left: number;
  width?: number;
}

export interface AnchorMeasurements {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ContentSize {
  width: number;
  height: number;
}

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Get the opposite placement (for flipping)
 */
const getOppositePlacement = (placement: Placement): Placement => {
  const opposites: Record<Placement, Placement> = {
    'top': 'bottom',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'bottom': 'top',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left': 'right',
    'left-start': 'right-start',
    'left-end': 'right-end',
    'right': 'left',
    'right-start': 'left-start',
    'right-end': 'left-end',
  };
  return opposites[placement];
};

/**
 * Calculate position for a given placement without boundary checks
 */
const calculatePositionForPlacement = (
  anchor: AnchorMeasurements,
  contentSize: ContentSize,
  placement: Placement,
  offset: number
): Position => {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = anchor.y - contentSize.height - offset;
      left = anchor.x + anchor.width / 2 - contentSize.width / 2;
      break;
    case 'top-start':
      top = anchor.y - contentSize.height - offset;
      left = anchor.x;
      break;
    case 'top-end':
      top = anchor.y - contentSize.height - offset;
      left = anchor.x + anchor.width - contentSize.width;
      break;
    case 'bottom':
      top = anchor.y + anchor.height + offset;
      left = anchor.x + anchor.width / 2 - contentSize.width / 2;
      break;
    case 'bottom-start':
      top = anchor.y + anchor.height + offset;
      left = anchor.x;
      break;
    case 'bottom-end':
      top = anchor.y + anchor.height + offset;
      left = anchor.x + anchor.width - contentSize.width;
      break;
    case 'left':
      top = anchor.y + anchor.height / 2 - contentSize.height / 2;
      left = anchor.x - contentSize.width - offset;
      break;
    case 'left-start':
      top = anchor.y;
      left = anchor.x - contentSize.width - offset;
      break;
    case 'left-end':
      top = anchor.y + anchor.height - contentSize.height;
      left = anchor.x - contentSize.width - offset;
      break;
    case 'right':
      top = anchor.y + anchor.height / 2 - contentSize.height / 2;
      left = anchor.x + anchor.width + offset;
      break;
    case 'right-start':
      top = anchor.y;
      left = anchor.x + anchor.width + offset;
      break;
    case 'right-end':
      top = anchor.y + anchor.height - contentSize.height;
      left = anchor.x + anchor.width + offset;
      break;
  }

  return { top, left };
};

/**
 * Check if position fits within window bounds accounting for safe areas
 * Position is in window coordinates (from measureInWindow)
 */
const fitsInViewport = (
  position: Position,
  contentSize: ContentSize,
  windowSize: { width: number; height: number },
  padding: number = 12,
  safeAreaInsets?: SafeAreaInsets
): boolean => {
  const right = position.left + contentSize.width;
  const bottom = position.top + contentSize.height;

  // Calculate bounds in window coordinates
  // Respect safe areas to avoid overlapping with system UI
  const topBound = padding + (safeAreaInsets?.top || 0);
  const leftBound = padding + (safeAreaInsets?.left || 0);
  const rightBound = windowSize.width - padding - (safeAreaInsets?.right || 0);
  const bottomBound = windowSize.height - topBound - (safeAreaInsets?.bottom || 0) - padding;

  // Add a buffer to account for floating point precision and give some breathing room
  const buffer = 2;

  const fits = (
    position.left >= leftBound &&
    position.top >= topBound &&
    right <= rightBound - buffer &&
    bottom <= bottomBound - buffer
  );

  console.log(bottom, bottomBound);

  if (__DEV__) {
    console.log('[fitsInViewport]', {
      position,
      contentSize,
      windowSize,
      safeAreaInsets,
      bounds: { topBound, leftBound, rightBound, bottomBound },
      edges: { right, bottom },
      fits,
      bottomOverflow: bottom > bottomBound ? bottom - bottomBound : 0
    });
  }

  return fits;
};

/**
 * Calculate the best position with smart boundary detection and flipping
 */
export const calculateSmartPosition = (
  anchor: AnchorMeasurements,
  contentSize: ContentSize,
  placement: Placement,
  offset: number = 8,
  matchWidth: boolean = false,
  safeAreaInsets?: SafeAreaInsets
): Position => {
  // Use window dimensions - this is the actual visible content area
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const padding = 12;

  // Calculate actual usable space accounting for safe areas
  const topBound = padding;
  const rightBound = windowWidth - padding - (safeAreaInsets?.right || 0);
  const bottomBound = windowHeight - padding - (safeAreaInsets?.bottom || 0);
  const leftBound = padding + (safeAreaInsets?.left || 0);

  // Try original placement
  let position = calculatePositionForPlacement(anchor, contentSize, placement, offset);

  // Check if it fits using window dimensions
  const windowSize = { width: windowWidth, height: windowHeight };
  const originalFits = fitsInViewport(position, contentSize, windowSize, padding, safeAreaInsets);

  if (__DEV__) {
    console.log('[calculateSmartPosition] Original placement:', placement, 'fits:', originalFits, 'position:', position);
  }

  if (originalFits) {
    if (matchWidth) {
      position.width = anchor.width;
    }
    return position;
  }

  // Try flipping to opposite side
  const oppositePlacement = getOppositePlacement(placement);
  let flippedPosition = calculatePositionForPlacement(anchor, contentSize, oppositePlacement, offset);
  const flippedFits = fitsInViewport(flippedPosition, contentSize, windowSize, padding, safeAreaInsets);

  if (__DEV__) {
    console.log('[calculateSmartPosition] Flipped placement:', oppositePlacement, 'fits:', flippedFits, 'position:', flippedPosition);
  }

  if (flippedFits) {
    if (matchWidth) {
      flippedPosition.width = anchor.width;
    }
    return flippedPosition;
  }

  // Try alternative alignments for the original side
  const alternativePlacements: Placement[] = [];
  const basePlacement = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';

  if (placement.includes('-')) {
    // If we have an alignment, try other alignments on the same side
    alternativePlacements.push(`${basePlacement}` as Placement);
    if (!placement.endsWith('-start')) alternativePlacements.push(`${basePlacement}-start` as Placement);
    if (!placement.endsWith('-end')) alternativePlacements.push(`${basePlacement}-end` as Placement);
  }

  // Try alternative alignments
  for (const altPlacement of alternativePlacements) {
    const altPosition = calculatePositionForPlacement(anchor, contentSize, altPlacement, offset);
    if (fitsInViewport(altPosition, contentSize, windowSize, padding, safeAreaInsets)) {
      if (matchWidth) {
        altPosition.width = anchor.width;
      }
      return altPosition;
    }
  }

  // If nothing fits perfectly, constrain to viewport bounds as fallback
  // This handles when content is too large to fit anywhere
  if (__DEV__) {
    console.log('[calculateSmartPosition] Nothing fits, constraining to bounds. Original position:', position, 'bounds:', { topBound, bottomBound, leftBound, rightBound });
  }

  position.left = Math.max(leftBound, Math.min(position.left, rightBound - contentSize.width));
  position.top = Math.max(topBound, Math.min(position.top, bottomBound - contentSize.height));

  if (__DEV__) {
    console.log('[calculateSmartPosition] Constrained position:', position);
  }

  if (matchWidth) {
    position.width = anchor.width;
  }

  return position;
};
