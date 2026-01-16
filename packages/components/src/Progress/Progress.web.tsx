import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { progressStyles } from './Progress.styles';
import type { ProgressProps } from './types';

/**
 * Visual indicator for task completion or loading status.
 * Supports linear and circular types with determinate or indeterminate states.
 */
const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  type = 'linear',
  intent = 'primary',
  size = 'md',
  indeterminate = false,
  showLabel = false,
  label,
  rounded = true,
  style,
  testID,
  id,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Apply variants (for size, intent, and rounded)
  progressStyles.useVariants({
    size,
    intent,
    rounded,
  });

  // Linear progress
  const containerProps = getWebProps([progressStyles.container as any, style as any]);
  const trackProps = getWebProps([progressStyles.linearTrack as any]);
  const barProps = getWebProps([progressStyles.linearBar as any, { width: `${percentage}%` }]);
  const indeterminateProps = getWebProps([progressStyles.indeterminateBar as any]);
  const labelProps = getWebProps([progressStyles.label as any]);

  const getCircularSize = () => {
    if (size === 'sm') return 32;
    if (size === 'lg') return 64;
    return 48;
  };

  if (type === 'circular') {
    const circularSize = getCircularSize();
    const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = indeterminate ? circumference * 0.25 : circumference - (percentage / 100) * circumference;

    const computedContainerProps = getWebProps([
      progressStyles.circularContainer as any,
      style as any,
      { display: 'inline-flex' }
    ]);
    const circularLabelProps = getWebProps([progressStyles.circularLabel as any]);
    const trackColorProps = getWebProps([progressStyles.circularTrack as any]);
    const barColorProps = getWebProps([progressStyles.circularBar as any]);

    return (
      <div {...computedContainerProps} id={id} data-testid={testID}>
        <svg
          width={circularSize}
          height={circularSize}
          style={{ transform: 'rotate(-90deg)' }}
          className={indeterminate ? 'progress-circular-container-indeterminate' : ''}
        >
          {/* Track circle (background) */}
          <circle
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className={trackColorProps.className}
          />
          {/* Progress circle (foreground) - apply the className to get intent color */}
          <circle
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className={barColorProps.className}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        {showLabel && (
          <span {...circularLabelProps}>
            {label || `${Math.round(percentage)}%`}
          </span>
        )}
        <style>{`
          @keyframes circular-rotate {
            from { transform: rotate(-90deg); }
            to { transform: rotate(270deg); }
          }
          .progress-circular-container-indeterminate {
            animation: circular-rotate 1.4s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div {...containerProps} id={id} data-testid={testID}>
        <div
          {...trackProps}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {indeterminate ? (
            <div {...indeterminateProps} className={`${indeterminateProps.className} progress-linear-indeterminate`} />
          ) : (
            <div {...barProps} />
          )}
        </div>
        {showLabel && (
          <span {...labelProps}>
            {label || `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
      {indeterminate && (
        <style>{`
          @keyframes progress-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
          .progress-linear-indeterminate {
            animation: progress-slide 1.5s ease-in-out infinite;
          }
        `}</style>
      )}
    </>
  );
};

export default Progress;