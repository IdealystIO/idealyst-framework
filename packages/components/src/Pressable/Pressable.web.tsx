import React, { useCallback, useState, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { PressableProps } from './types';
import { pressableStyles } from './Pressable.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Pressable = forwardRef<HTMLDivElement, PressableProps>(({
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
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    onPressIn?.();
  }, [disabled, onPressIn]);

  const handleMouseUp = useCallback(() => {
    if (disabled) return;
    setIsPressed(false);
    onPressOut?.();
  }, [disabled, onPressOut]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onPress?.();
  }, [disabled, onPress]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPress?.();
    }
  }, [disabled, onPress]);

  // Apply spacing variants
  pressableStyles.useVariants({
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const webProps = getWebProps([pressableStyles.pressable, style as any]);

  const baseStyle: React.CSSProperties = {
    cursor: disabled ? 'default' : 'pointer',
    outline: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    opacity: disabled ? 0.5 : 1,
  };

  // Merge ref from getWebProps with forwarded ref
  const mergedRef = useMergeRefs<HTMLDivElement>(
    ref,
    webProps.ref as React.Ref<HTMLDivElement>
  );

  return (
    <div
      {...webProps}
      ref={mergedRef}
      id={id}
      role={accessibilityRole}
      tabIndex={disabled ? -1 : 0}
      style={{ ...baseStyle, ...webProps.style }}
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