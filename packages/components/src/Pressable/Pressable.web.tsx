import React, { useCallback, useRef, useState, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { PressableProps } from './types';
import { pressableStyles } from './Pressable.styles';
import { createPressEvent, createBaseSyntheticEvent } from '../utils/events';
import type { PressEvent } from '../utils/events';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

const Pressable = forwardRef<IdealystElement, PressableProps>(({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  // Spacing variants from PressableSpacingStyleProps
  padding,
  paddingVertical,
  paddingHorizontal,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  id,
}, ref) => {
  const internalRef = useRef<IdealystElement>(null);
  const [_isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsPressed(true);
    onPressIn?.(createPressEvent(e as React.MouseEvent<HTMLElement>, 'pressIn'));
  }, [disabled, onPressIn]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsPressed(false);
    onPressOut?.(createPressEvent(e as React.MouseEvent<HTMLElement>, 'pressOut'));
  }, [disabled, onPressOut]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onPress?.(createPressEvent(e as React.MouseEvent<HTMLElement>));
  }, [disabled, onPress]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const pressEvent: PressEvent = {
        ...createBaseSyntheticEvent(event.nativeEvent),
        type: 'press',
        targetRef: internalRef,
      };
      onPress?.(pressEvent);
    }
  }, [disabled, onPress]);

  // Apply spacing variants
  pressableStyles.useVariants({
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const webProps = getWebProps([(pressableStyles.pressable as any)({ disabled }), flattenStyle(style)]);

  // Merge ref from getWebProps with forwarded ref and internal ref
  const mergedRef = useMergeRefs(ref as any, webProps.ref as any, internalRef);

  return (
    <div
      {...webProps}
      ref={mergedRef}
      id={id}
      role={accessibilityRole}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Handle mouse leave as press out
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={testID}
      aria-label={accessibilityLabel}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
});

Pressable.displayName = 'Pressable';

export default Pressable;