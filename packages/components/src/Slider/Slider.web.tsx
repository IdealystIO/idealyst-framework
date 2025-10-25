import React, { useState, useRef, useCallback, isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { sliderStyles } from './Slider.styles';
import type { SliderProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

const Slider = forwardRef<HTMLDivElement, SliderProps>(({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = false,
  showMinMax = false,
  marks = [],
  intent = 'primary',
  size = 'md',
  icon,
  onValueChange,
  onValueCommit,
  style,
  testID,
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Apply variants
  sliderStyles.useVariants({
    size,
    disabled,
  });

  const containerProps = getWebProps([sliderStyles.container, style as any]);
  const wrapperProps = getWebProps([sliderStyles.sliderWrapper]);
  const trackProps = getWebProps([sliderStyles.track]);
  const thumbIconProps = getWebProps([sliderStyles.thumbIcon({ intent })]);
  const valueLabelProps = getWebProps([sliderStyles.valueLabel]);
  const minMaxLabelsProps = getWebProps([sliderStyles.minMaxLabels]);
  const minMaxLabelProps = getWebProps([sliderStyles.minMaxLabel]);
  const marksProps = getWebProps([sliderStyles.marks]);

  const clampValue = useCallback((val: number) => {
    const clampedValue = Math.min(Math.max(val, min), max);
    const steppedValue = Math.round(clampedValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  }, [min, max, step]);

  const calculateValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = min + percentage * (max - min);
    return clampValue(rawValue);
  }, [min, max, value, clampValue]);

  const updateValue = useCallback((newValue: number) => {
    const clampedValue = clampValue(newValue);

    if (controlledValue === undefined) {
      setInternalValue(clampedValue);
    }

    onValueChange?.(clampedValue);
  }, [controlledValue, clampValue, onValueChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();

    // Check if click is on the thumb
    const isThumbClick = thumbRef.current && thumbRef.current.contains(e.target as Node);

    if (isThumbClick) {
      // Clicking on thumb: only start dragging, don't update value yet
      setIsDragging(true);
      hasMoved.current = false;
    } else {
      // Clicking on track: immediately update value
      setIsDragging(true);
      hasMoved.current = true;
      const newValue = calculateValueFromPosition(e.clientX);
      updateValue(newValue);
    }
  }, [disabled, calculateValueFromPosition, updateValue]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    hasMoved.current = true;
    const newValue = calculateValueFromPosition(e.clientX);
    updateValue(newValue);
  }, [isDragging, disabled, calculateValueFromPosition, updateValue]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (hasMoved.current) {
        onValueCommit?.(value);
      }
      hasMoved.current = false;
    }
  }, [isDragging, value, onValueCommit]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = ((value - min) / (max - min)) * 100;

  // Dynamic styles with percentage
  const filledTrackProps = getWebProps([sliderStyles.filledTrack({ intent }), { width: `${percentage}%` }]);
  const thumbProps = getWebProps([
    sliderStyles.thumb({ intent, disabled }),
    isDragging && sliderStyles.thumbActive,
    { left: `${percentage}%` }
  ]);

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (isIconName(icon)) {
      // Resolve icon name to path and render with IconSvg
      const iconPath = resolveIconPath(icon);
      return (
        <IconSvg
          path={iconPath}
          {...thumbIconProps}
          aria-label={icon}
        />
      );
    } else if (isValidElement(icon)) {
      // Render custom component as-is
      return <span {...thumbIconProps}>{icon}</span>;
    }

    return null;
  };

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <div {...containerProps} ref={mergedRef} data-testid={testID}>
      {showValue && (
        <div {...valueLabelProps}>
          {value}
        </div>
      )}

      <div {...wrapperProps}>
        <div
          {...trackProps}
          ref={trackRef}
          onMouseDown={handleMouseDown}
          role="slider"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Filled track */}
          <div {...filledTrackProps} />

          {/* Marks */}
          {marks.length > 0 && (
            <div {...marksProps}>
              {marks.map((mark) => {
                const markPercentage = ((mark.value - min) / (max - min)) * 100;
                const markProps = getWebProps([sliderStyles.mark, { left: `${markPercentage}%` }]);
                const markLabelProps = getWebProps([sliderStyles.markLabel, { left: `${markPercentage}%` }]);
                return (
                  <div key={mark.value}>
                    <div {...markProps} />
                    {mark.label && (
                      <div {...markLabelProps}>
                        {mark.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Thumb */}
          <div
            ref={thumbRef}
            {...thumbProps}
          >
            {renderIcon()}
          </div>
        </div>
      </div>

      {showMinMax && (
        <div {...minMaxLabelsProps}>
          <span {...minMaxLabelProps}>{min}</span>
          <span {...minMaxLabelProps}>{max}</span>
        </div>
      )}
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;