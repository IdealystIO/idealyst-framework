import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getWebProps } from 'react-native-unistyles/web';
import { PopoverProps, PopoverPlacement } from './types';
import { popoverStyles } from './Popover.styles';

interface PopoverPosition {
  top: number;
  left: number;
  placement: PopoverPlacement;
}

const calculatePosition = (
  anchorRect: DOMRect,
  popoverSize: { width: number; height: number },
  placement: PopoverPlacement,
  offset: number,
  showArrow: boolean = false
): PopoverPosition => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  let position = { top: 0, left: 0 };
  let finalPlacement = placement;

  // Add extra offset for arrow
  const arrowSize = 6;
  const finalOffset = showArrow ? offset + arrowSize : offset;

  // Calculate initial position based on placement
  switch (placement) {
    case 'top':
      position = {
        top: anchorRect.top + viewport.scrollY - popoverSize.height - finalOffset,
        left: anchorRect.left + viewport.scrollX + anchorRect.width / 2 - popoverSize.width / 2,
      };
      break;
    case 'top-start':
      position = {
        top: anchorRect.top + viewport.scrollY - popoverSize.height - finalOffset,
        left: anchorRect.left + viewport.scrollX,
      };
      break;
    case 'top-end':
      position = {
        top: anchorRect.top + viewport.scrollY - popoverSize.height - finalOffset,
        left: anchorRect.right + viewport.scrollX - popoverSize.width,
      };
      break;
    case 'bottom':
      position = {
        top: anchorRect.bottom + viewport.scrollY + finalOffset,
        left: anchorRect.left + viewport.scrollX + anchorRect.width / 2 - popoverSize.width / 2,
      };
      break;
    case 'bottom-start':
      position = {
        top: anchorRect.bottom + viewport.scrollY + finalOffset,
        left: anchorRect.left + viewport.scrollX,
      };
      break;
    case 'bottom-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY + finalOffset,
        left: anchorRect.right + viewport.scrollX - popoverSize.width,
      };
      break;
    case 'left':
      position = {
        top: anchorRect.top + viewport.scrollY + anchorRect.height / 2 - popoverSize.height / 2,
        left: anchorRect.left + viewport.scrollX - popoverSize.width - finalOffset,
      };
      break;
    case 'left-start':
      position = {
        top: anchorRect.top + viewport.scrollY,
        left: anchorRect.left + viewport.scrollX - popoverSize.width - finalOffset,
      };
      break;
    case 'left-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY - popoverSize.height,
        left: anchorRect.left + viewport.scrollX - popoverSize.width - finalOffset,
      };
      break;
    case 'right':
      position = {
        top: anchorRect.top + viewport.scrollY + anchorRect.height / 2 - popoverSize.height / 2,
        left: anchorRect.right + viewport.scrollX + finalOffset,
      };
      break;
    case 'right-start':
      position = {
        top: anchorRect.top + viewport.scrollY,
        left: anchorRect.right + viewport.scrollX + finalOffset,
      };
      break;
    case 'right-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY - popoverSize.height,
        left: anchorRect.right + viewport.scrollX + finalOffset,
      };
      break;
  }

  // Constrain to viewport
  const padding = 8;
  position.left = Math.max(padding, Math.min(position.left, viewport.width - popoverSize.width - padding));
  position.top = Math.max(padding, Math.min(position.top, viewport.height + viewport.scrollY - popoverSize.height - padding));

  return { ...position, placement: finalPlacement };
};

const Popover: React.FC<PopoverProps> = ({
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
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0, placement });
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate position
  const updatePosition = useCallback(() => {
    if (!popoverRef.current) {
      return;
    }

    let anchorElement: Element | null = null;
    
    if (anchor && typeof anchor === 'object' && 'current' in anchor && anchor.current) {
      anchorElement = anchor.current;
    } else if (React.isValidElement(anchor)) {
      console.warn('Popover: React element anchors need to be refs for positioning');
      return;
    }

    if (!anchorElement) {
      return;
    }

    const anchorRect = anchorElement.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    const newPosition = calculatePosition(
      anchorRect,
      { width: popoverRect.width || 200, height: popoverRect.height || 100 },
      placement,
      offset,
      showArrow
    );

    setPosition(newPosition);
    setIsPositioned(true);
  }, [anchor, placement, offset, showArrow]);

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (open && !shouldRender) {
      setShouldRender(true);
      setIsPositioned(false);
      // Set visible immediately to render the DOM element
      setIsVisible(true);
    } else if (!open && shouldRender) {
      setIsVisible(false);
      setIsPositioned(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  // Position calculation after DOM is ready
  useLayoutEffect(() => {
    if (shouldRender && isVisible) {
      // Use a microtask to ensure the ref is attached
      Promise.resolve().then(() => {
        if (popoverRef.current) {
          updatePosition();
        }
      });
    }
  }, [shouldRender, isVisible, anchor, placement, offset, showArrow]);

  // Update position on scroll/resize
  useEffect(() => {
    if (shouldRender && isVisible) {
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [updatePosition, shouldRender, isVisible]);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscapeKey) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscapeKey, onOpenChange]);

  // Handle click outside
  useEffect(() => {
    if (!open || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        // Check if click was on anchor element
        let anchorElement: Element | null = null;
        if (anchor && typeof anchor === 'object' && 'current' in anchor && anchor.current) {
          anchorElement = anchor.current;
        }
        
        if (anchorElement && anchorElement.contains(event.target as Node)) {
          return; // Don't close if clicked on anchor
        }
        
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, closeOnClickOutside, onOpenChange, anchor]);

  if (!shouldRender) return null;

  // Use Unistyles with wrapper approach
  popoverStyles.useVariants({});
  
  const containerProps = getWebProps([
    popoverStyles.container,
    {
      opacity: isVisible && isPositioned ? 1 : 0,
      transform: isVisible && isPositioned ? 'scale(1)' : 'scale(0.95)',
    }
  ]);
  const contentProps = getWebProps([popoverStyles.content]);

  console.log(position)
  
  const popoverContent = (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: position.top,
        left: position.left,
      }}
      data-testid={testID}
    >
      <div {...containerProps}>
        <div {...contentProps}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
};

export default Popover;