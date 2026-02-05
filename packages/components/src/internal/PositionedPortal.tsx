import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface PositionedPortalProps {
  open: boolean;
  anchor: React.RefObject<HTMLElement>;
  children: ReactNode;
  placement?: Placement;
  offset?: number;
  onClickOutside?: () => void;
  onEscapeKey?: () => void;
  matchWidth?: boolean;
  zIndex?: number;
}

interface Position {
  top: number;
  left: number;
  width?: number;
}

const calculatePosition = (
  anchorRect: DOMRect,
  contentSize: { width: number; height: number },
  placement: Placement,
  offset: number,
  matchWidth: boolean
): Position => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  let position: Position = { top: 0, left: 0 };

  // Calculate initial position based on placement
  switch (placement) {
    case 'top':
      position = {
        top: anchorRect.top + viewport.scrollY - contentSize.height - offset,
        left: anchorRect.left + viewport.scrollX + anchorRect.width / 2 - contentSize.width / 2,
      };
      break;
    case 'top-start':
      position = {
        top: anchorRect.top + viewport.scrollY - contentSize.height - offset,
        left: anchorRect.left + viewport.scrollX,
      };
      break;
    case 'top-end':
      position = {
        top: anchorRect.top + viewport.scrollY - contentSize.height - offset,
        left: anchorRect.right + viewport.scrollX - contentSize.width,
      };
      break;
    case 'bottom':
      position = {
        top: anchorRect.bottom + viewport.scrollY + offset,
        left: anchorRect.left + viewport.scrollX + anchorRect.width / 2 - contentSize.width / 2,
      };
      break;
    case 'bottom-start':
      position = {
        top: anchorRect.bottom + viewport.scrollY + offset,
        left: anchorRect.left + viewport.scrollX,
      };
      break;
    case 'bottom-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY + offset,
        left: anchorRect.right + viewport.scrollX - contentSize.width,
      };
      break;
    case 'left':
      position = {
        top: anchorRect.top + viewport.scrollY + anchorRect.height / 2 - contentSize.height / 2,
        left: anchorRect.left + viewport.scrollX - contentSize.width - offset,
      };
      break;
    case 'left-start':
      position = {
        top: anchorRect.top + viewport.scrollY,
        left: anchorRect.left + viewport.scrollX - contentSize.width - offset,
      };
      break;
    case 'left-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY - contentSize.height,
        left: anchorRect.left + viewport.scrollX - contentSize.width - offset,
      };
      break;
    case 'right':
      position = {
        top: anchorRect.top + viewport.scrollY + anchorRect.height / 2 - contentSize.height / 2,
        left: anchorRect.right + viewport.scrollX + offset,
      };
      break;
    case 'right-start':
      position = {
        top: anchorRect.top + viewport.scrollY,
        left: anchorRect.right + viewport.scrollX + offset,
      };
      break;
    case 'right-end':
      position = {
        top: anchorRect.bottom + viewport.scrollY - contentSize.height,
        left: anchorRect.right + viewport.scrollX + offset,
      };
      break;
  }

  // Match anchor width if requested
  if (matchWidth) {
    position.width = anchorRect.width;
  }

  // Constrain to viewport
  const padding = 8;
  position.left = Math.max(padding, Math.min(position.left, viewport.width - contentSize.width - padding));
  position.top = Math.max(padding, Math.min(position.top, viewport.height + viewport.scrollY - contentSize.height - padding));

  return position;
};

export const PositionedPortal: React.FC<PositionedPortalProps> = ({
  open,
  anchor,
  children,
  placement = 'bottom-start',
  offset = 4,
  onClickOutside,
  onEscapeKey,
  matchWidth = false,
  zIndex = 1000,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate position
  const updatePosition = useCallback(() => {
    if (!contentRef.current || !anchor.current) {
      return;
    }

    const anchorRect = anchor.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // Use actual measured size from the DOM
    const newPosition = calculatePosition(
      anchorRect,
      { width: contentRect.width, height: contentRect.height },
      placement,
      offset,
      matchWidth
    );

    setPosition(newPosition);
    setIsPositioned(true);
  }, [anchor, placement, offset, matchWidth]);

  // Position after DOM is ready
  useLayoutEffect(() => {
    if (open) {
      // Use requestAnimationFrame to ensure ref is attached and layout is complete
      const rafId = requestAnimationFrame(() => {
        if (contentRef.current && anchor.current) {
          updatePosition();
        }
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      setIsPositioned(false);
    }
  }, [open, updatePosition]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleUpdate = () => updatePosition();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [open, updatePosition]);

  // Handle escape key
  useEffect(() => {
    if (!open || !onEscapeKey) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKey();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onEscapeKey]);

  // Handle click outside
  useEffect(() => {
    if (!open || !onClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        contentRef.current && !contentRef.current.contains(target) &&
        anchor.current && !anchor.current.contains(target)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [open, onClickOutside, anchor]);

  if (!open) return null;

  const content = (
    <div
      ref={contentRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        ...(position.width != null && { width: position.width }),
        zIndex,
        opacity: isPositioned ? 1 : 0,
        pointerEvents: isPositioned ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};
