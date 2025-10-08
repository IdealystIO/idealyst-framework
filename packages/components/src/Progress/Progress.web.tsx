import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { progressStyles } from './Progress.styles';
import type { ProgressProps } from './types';

const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  variant = 'linear',
  intent = 'primary',
  size = 'medium',
  indeterminate = false,
  showLabel = false,
  label,
  rounded = true,
  style,
  testID,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Apply variants using the correct Unistyles v3 pattern
  progressStyles.useVariants({
    size,
    intent,
    rounded,
  });

  const getCircularSize = () => {
    if (size === 'small') return 32;
    if (size === 'large') return 64;
    return 48;
  };

  if (variant === 'circular') {
    const circularSize = getCircularSize();
    const strokeWidth = size === 'small' ? 3 : size === 'large' ? 5 : 4;
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = indeterminate ? circumference * 0.25 : circumference - (percentage / 100) * circumference;

    const containerProps = getWebProps([progressStyles.circularContainer, style]);
    const labelProps = getWebProps([progressStyles.circularLabel]);
    const barProps = getWebProps([progressStyles.circularBar]);

    // Get track color directly from styles
    const trackColor = progressStyles.circularTrack.stroke;

    return (
      <div {...containerProps} data-testid={testID} style={{ ...containerProps.style, display: 'inline-flex' }}>
        {/* Hidden element to extract the computed stroke color */}
        <div {...barProps} style={{ ...barProps.style, position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }} />
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
            stroke={trackColor}
          />
          {/* Progress circle (foreground) - apply the className to get intent color */}
          <circle
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className={barProps.className}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        {showLabel && (
          <span {...labelProps}>
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

  // Linear progress
  const containerProps = getWebProps([progressStyles.container, style]);
  const trackProps = getWebProps([progressStyles.linearTrack]);
  const barProps = getWebProps([progressStyles.linearBar]);
  const indeterminateProps = getWebProps([progressStyles.indeterminateBar]);
  const labelProps = getWebProps([progressStyles.label]);

  return (
    <>
      <div {...containerProps} data-testid={testID}>
        <div
          {...trackProps}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {indeterminate ? (
            <div className={`${indeterminateProps.className} progress-linear-indeterminate`} style={indeterminateProps.style} />
          ) : (
            <div className={barProps.className} style={{ ...barProps.style, width: `${percentage}%` }} />
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