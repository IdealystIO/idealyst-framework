import React, { useCallback, useState, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { PressableProps } from './types';
import { pressableStyles } from './Pressable.styles';
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
  const [_isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsPressed(true);
    onPressIn?.();
  }, [disabled, onPressIn]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsPressed(false);
    onPressOut?.();
  }, [disabled, onPressOut]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onPress?.();
  }, [disabled, onPress]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onPress?.();
    }
  }, [disabled, onPress]);

  // Apply spacing variants
  pressableStyles.useVariants({
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const webProps = getWebProps([(pressableStyles.pressable as any)({ disabled }), flattenStyle(style)]);

  // Merge ref from getWebProps with forwarded ref
  const mergedRef = useMergeRefs(ref as any, webProps.ref as any);

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