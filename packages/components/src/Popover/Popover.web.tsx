import React, { useRef, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { PopoverProps } from './types';
import { popoverStyles } from './Popover.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { PositionedPortal } from '../internal/PositionedPortal';

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
}, ref) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  popoverStyles.useVariants({});

  const containerProps = getWebProps([popoverStyles.container]);
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
      <div ref={mergedPopoverRef} data-testid={testID}>
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