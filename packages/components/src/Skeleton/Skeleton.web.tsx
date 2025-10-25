import React, { useEffect, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { skeletonStyles } from './Skeleton.styles';
import type { SkeletonProps, SkeletonGroupProps } from './types';

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  shape = 'rectangle',
  borderRadius,
  animation = 'pulse',
  style,
  testID,
}) => {
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
        style={{
          ...customStyles,
          ...animationStyles,
        }}
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
}) => {
  skeletonStyles.useVariants({});
  const groupProps = getWebProps([skeletonStyles.group, style as any]);

  return (
    <div
      {...groupProps}
      style={{
        gap: `${spacing}px`,
      }}
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
