import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tooltipStyles } from './Tooltip.styles';
import type { TooltipProps } from './types';
import { PositionedPortal } from '../internal/PositionedPortal';
import { getWebAriaProps, generateAccessibilityId } from '../utils/accessibility';

/**
 * Contextual popup for displaying additional information on hover or focus.
 * Supports multiple placements, delays, and keyboard accessibility.
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  intent = 'neutral',
  size = 'md',
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for tooltip
  const tooltipId = useMemo(() => id ? `${id}-tooltip` : generateAccessibilityId('tooltip'), [id]);
  const triggerId = useMemo(() => id || generateAccessibilityId('tooltip-trigger'), [id]);

  // Generate ARIA props for trigger
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

  // Apply variants - PositionedPortal handles positioning and visibility
  tooltipStyles.useVariants({
    size,
    intent,
  });

  const containerProps = getWebProps([(tooltipStyles.container as any)({}), style as any]);
  const tooltipContentProps = getWebProps([(tooltipStyles.tooltip as any)({})]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setVisible(false);
  };

  // Keyboard accessibility - show on focus, hide on blur
  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  // Handle Escape key to dismiss tooltip
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && visible) {
      setVisible(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={anchorRef}
        {...containerProps}
        {...ariaProps}
        id={triggerId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-describedby={visible ? tooltipId : undefined}
        data-testid={testID}
      >
        {children}
      </div>

      <PositionedPortal
        open={visible}
        anchor={anchorRef}
        placement={placement}
        offset={8}
        zIndex={1000}
      >
        <div
          {...tooltipContentProps}
          id={tooltipId}
          role="tooltip"
          aria-hidden={!visible}
          data-testid={`${testID}-tooltip`}
        >
          {content}
        </div>
      </PositionedPortal>
    </>
  );
};

export default Tooltip;
