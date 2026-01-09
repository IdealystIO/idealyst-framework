import React, { useRef, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { PopoverProps } from './types';
import { popoverStyles } from './Popover.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { PositionedPortal } from '../internal/PositionedPortal';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';

/**
 * Floating content panel anchored to an element for contextual information or actions.
 * Supports multiple placements and automatic dismissal behaviors.
 */
const Popover = forwardRef<HTMLDivElement, PopoverProps>(({
  open,
  onOpenChange,
  anchor,
  children,
  placement = 'bottom',
  offset = 8,
  closeOnClickOutside = true,
  closeOnEscapeKey = true,
  showArrow = false,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
  accessibilityLabelledBy,
  accessibilityDescribedBy,
}, ref) => {
  // Generate unique ID for the popover
  const popoverId = useMemo(() => id || generateAccessibilityId('popover'), [id]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebInteractiveAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'dialog',
      accessibilityHidden,
      accessibilityLabelledBy,
      accessibilityDescribedBy,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityRole, accessibilityHidden, accessibilityLabelledBy, accessibilityDescribedBy]);
  const popoverRef = useRef<HTMLDivElement>(null);

  popoverStyles.useVariants({});

  const containerProps = getWebProps([(popoverStyles.container as any)({})]);
  const contentProps = getWebProps([popoverStyles.content]);

  const mergedPopoverRef = useMergeRefs(ref, popoverRef);

  // Extract anchor ref if it's a ref object
  let anchorRef: React.RefObject<HTMLElement> | undefined;
  if (anchor && typeof anchor === 'object' && 'current' in anchor) {
    anchorRef = anchor as React.RefObject<HTMLElement>;
  }

  if (!anchorRef) {
    console.warn('Popover: anchor must be a ref object');
    return null;
  }

  return (
    <PositionedPortal
      open={open}
      anchor={anchorRef}
      placement={placement}
      offset={offset}
      onClickOutside={closeOnClickOutside ? () => onOpenChange(false) : undefined}
      onEscapeKey={closeOnEscapeKey ? () => onOpenChange(false) : undefined}
      zIndex={9999}
    >
      <div
        ref={mergedPopoverRef}
        id={popoverId}
        data-testid={testID}
        {...ariaProps}
        role="dialog"
        aria-modal="false"
      >
        <div {...containerProps}>
          <div {...contentProps}>
            {children}
          </div>
        </div>
      </div>
    </PositionedPortal>
  );
});

Popover.displayName = 'Popover';

export default Popover;