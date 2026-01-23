import React, { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getWebProps } from 'react-native-unistyles/web';
import { DialogProps } from './types';
import { dialogStyles } from './Dialog.styles';
import Icon from '../Icon';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Modal overlay dialog for focused user interactions and confirmations.
 * Handles focus trapping, escape key, and backdrop click dismissal.
 */
const Dialog = forwardRef<HTMLDivElement, DialogProps>(({
  open,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
  height,
  contentPadding = 24,
  style,
  testID,
  id,
  BackdropComponent,
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
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscapeKey, onClose]);

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
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
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
    flattenStyle(style),
    height !== undefined ? { height, display: 'flex', flexDirection: 'column' } : null,
    isVisible
      ? { opacity: 1, transform: 'scale(1) translateY(0px)' }
      : { opacity: 0, transform: 'scale(0.96) translateY(-4px)' }
  ].filter(Boolean));
  const headerProps = getWebProps([(dialogStyles.header as any)({})]);
  const titleProps = getWebProps([(dialogStyles.title as any)({})]);
  const closeButtonProps = getWebProps([(dialogStyles.closeButton as any)({})]);
  const contentProps = getWebProps([
    (dialogStyles.content as any)({}),
    height !== undefined ? { flex: 1, overflow: 'auto' } : null,
    contentPadding > 0 ? { padding: contentPadding } : null,
  ].filter(Boolean));

  const mergedBackdropRef = useMergeRefs(ref, backdropProps.ref);

  // Styles for the custom backdrop wrapper (no default backdrop styling)
  const customBackdropWrapperStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  // Styles for the custom backdrop component container (fills the entire backdrop area)
  const customBackdropStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const dialogContent = BackdropComponent ? (
    <div
      ref={mergedBackdropRef}
      style={customBackdropWrapperStyle}
      onClick={handleBackdropClick}
      data-testid={testID}
    >
      <div style={customBackdropStyle}>
        <BackdropComponent isVisible={isVisible} />
      </div>
      <div
        {...containerProps}
        {...ariaProps}
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
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
  ) : (
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