import { useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { skeletonStyles } from './Skeleton.styles';
import type { SkeletonProps, SkeletonGroupProps } from './types';
import { getWebLiveRegionAriaProps } from '../utils/accessibility';

/**
 * Placeholder animation for loading content with customizable shapes and animations.
 * Available in pulse and wave animation styles.
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  shape = 'rectangle',
  borderRadius,
  animation = 'pulse',
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityLive,
  accessibilityBusy,
  accessibilityAtomic,
  accessibilityRelevant,
}) => {
  // Generate ARIA props for loading state
  const ariaProps = useMemo(() => {
    return getWebLiveRegionAriaProps({
      accessibilityLabel: accessibilityLabel ?? 'Loading content',
      accessibilityLive: accessibilityLive ?? 'polite',
      accessibilityBusy: accessibilityBusy ?? true,
      accessibilityAtomic,
      accessibilityRelevant,
    });
  }, [accessibilityLabel, accessibilityLive, accessibilityBusy, accessibilityAtomic, accessibilityRelevant]);
  skeletonStyles.useVariants({
    shape,
    animation,
  });

  const skeletonProps = getWebProps([skeletonStyles.skeleton, style as any]);

  // Apply custom border radius if provided and shape is 'rounded'
  const customStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...(shape === 'rounded' && borderRadius ? { borderRadius: `${borderRadius}px` } : {}),
    ...(shape === 'circle' ? { aspectRatio: '1' } : {}),
  };

  // Animation styles
  const animationStyles: React.CSSProperties = {};
  if (animation === 'pulse') {
    animationStyles.animation = 'skeleton-pulse 1.5s ease-in-out infinite';
  } else if (animation === 'wave') {
    animationStyles.position = 'relative';
    animationStyles.overflow = 'hidden';
  }

  return (
    <>
      {animation === 'pulse' && (
        <style>{`
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      )}
      {animation === 'wave' && (
        <style>{`
          @keyframes skeleton-wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
      <div
        {...skeletonProps}
        {...ariaProps}
        role="status"
        style={{
          ...customStyles,
          ...animationStyles,
        }}
        id={id}
        data-testid={testID}
      >
        {animation === 'wave' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'skeleton-wave 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </>
  );
};

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  spacing = 12,
  skeletonProps,
  style,
  testID,
  id,
}) => {
  skeletonStyles.useVariants({});
  const groupProps = getWebProps([skeletonStyles.group, style as any]);

  return (
    <div
      {...groupProps}
      style={{
        gap: `${spacing}px`,
      }}
      id={id}
      data-testid={testID}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          {...skeletonProps}
          testID={testID ? `${testID}-item-${index}` : undefined}
        />
      ))}
    </div>
  );
};

export default Skeleton;
