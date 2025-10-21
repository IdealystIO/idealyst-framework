import React, { useCallback, useState, forwardRef } from 'react';
import { PressableProps } from './types';

const Pressable = forwardRef<HTMLDivElement, PressableProps>(({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
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

  const webStyle = {
    ...style,
    cursor: disabled ? 'default' : 'pointer',
    outline: 'none',
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTapHighlightColor: 'transparent',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div
      ref={ref}
      role={accessibilityRole}
      tabIndex={disabled ? -1 : 0}
      style={webStyle}
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