import React, { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getWebProps } from 'react-native-unistyles/web';
import { DialogProps } from './types';
import { dialogStyles } from './Dialog.styles';
import Icon from '../Icon';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';

const Dialog = forwardRef<HTMLDivElement, DialogProps>(({
  open,
  onOpenChange,
  title,
  children,
  size = 'md',
  type = 'standard',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityDescribedBy,
}, ref) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Generate unique IDs for accessibility
  const dialogId = useMemo(() => id || generateAccessibilityId('dialog'), [id]);
  const titleId = useMemo(() => `${dialogId}-title`, [dialogId]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebInteractiveAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'dialog',
      accessibilityDescribedBy,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole, accessibilityDescribedBy]);

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (open && !shouldRender) {
      // Opening sequence
      setShouldRender(true);
      // Use double requestAnimationFrame to ensure the DOM has fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else if (!open && shouldRender) {
      // Closing sequence
      setIsVisible(false);
      // Wait for transition to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 150); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

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

  // Handle focus management
  useEffect(() => {
    if (open) {
      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [open]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!shouldRender) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  const handleCloseClick = () => {
    onOpenChange(false);
  };

  // Apply variants
  dialogStyles.useVariants({
    size,
    type,
  });

  const backdropProps = getWebProps([
    (dialogStyles.backdrop as any)({}),
    { opacity: isVisible ? 1 : 0 }
  ]);
  const containerProps = getWebProps([
    (dialogStyles.container as any)({}),
    style as any,
    isVisible
      ? { opacity: 1, transform: 'scale(1) translateY(0px)' }
      : { opacity: 0, transform: 'scale(0.96) translateY(-4px)' }
  ]);
  const headerProps = getWebProps([(dialogStyles.header as any)({})]);
  const titleProps = getWebProps([dialogStyles.title]);
  const closeButtonProps = getWebProps([dialogStyles.closeButton]);
  const contentProps = getWebProps([(dialogStyles.content as any)({})]);

  const mergedBackdropRef = useMergeRefs(ref, backdropProps.ref);

  const dialogContent = (
    <div
      {...backdropProps}
      ref={mergedBackdropRef}
      onClick={handleBackdropClick}
      data-testid={testID}
    >
      <div
        {...containerProps}
        {...ariaProps}
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div {...headerProps}>
            {title && (
              <h2 {...titleProps} id={titleId}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                {...closeButtonProps}
                onClick={handleCloseClick}
                aria-label="Close dialog"
                type="button"
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        )}
        <div {...contentProps}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
});

Dialog.displayName = 'Dialog';

export default Dialog;