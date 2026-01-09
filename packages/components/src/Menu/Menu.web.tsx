import React, { useRef, forwardRef, useMemo, useCallback, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuStyles } from './Menu.styles';
import type { MenuProps } from './types';
import MenuItem from './MenuItem.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { PositionedPortal } from '../internal/PositionedPortal';
import { getWebInteractiveAriaProps, generateAccessibilityId, MENU_KEYS } from '../utils/accessibility';

/**
 * Dropdown menu for actions and navigation triggered by a button or element.
 * Includes keyboard navigation, icons, and separator support.
 */
const Menu = forwardRef<HTMLDivElement, MenuProps>(({
  children,
  items,
  open = false,
  onOpenChange,
  placement = 'bottom-start',
  closeOnSelection = true,
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
  accessibilityExpanded,
  accessibilityControls,
  accessibilityHasPopup,
}, ref) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const focusedIndex = useRef<number>(-1);

  // Generate unique ID for menu
  const menuId = useMemo(() => id || generateAccessibilityId('menu'), [id]);

  // Get enabled items for keyboard navigation
  const enabledItems = useMemo(() =>
    items.map((item, index) => ({ ...item, index })).filter(item => !item.disabled && !item.separator),
    [items]
  );

  // Focus first menu item when menu opens
  useEffect(() => {
    if (open && enabledItems.length > 0) {
      // Small delay to ensure menu is rendered
      requestAnimationFrame(() => {
        const firstItem = menuItemRefs.current.get(enabledItems[0].index);
        if (firstItem) {
          firstItem.focus();
          focusedIndex.current = 0;
        }
      });
    } else {
      focusedIndex.current = -1;
    }
  }, [open, enabledItems]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key;

    if (MENU_KEYS.close.includes(key)) {
      e.preventDefault();
      onOpenChange?.(false);
      // Return focus to trigger
      triggerRef.current?.focus();
      return;
    }

    if (enabledItems.length === 0) return;

    let nextIndex = focusedIndex.current;

    if (MENU_KEYS.next.includes(key)) {
      e.preventDefault();
      nextIndex = focusedIndex.current < enabledItems.length - 1 ? focusedIndex.current + 1 : 0;
    } else if (MENU_KEYS.prev.includes(key)) {
      e.preventDefault();
      nextIndex = focusedIndex.current > 0 ? focusedIndex.current - 1 : enabledItems.length - 1;
    } else if (MENU_KEYS.first.includes(key)) {
      e.preventDefault();
      nextIndex = 0;
    } else if (MENU_KEYS.last.includes(key)) {
      e.preventDefault();
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex !== focusedIndex.current && nextIndex >= 0) {
      focusedIndex.current = nextIndex;
      const item = enabledItems[nextIndex];
      const button = menuItemRefs.current.get(item.index);
      button?.focus();
    }
  }, [enabledItems, onOpenChange]);

  // Generate ARIA props for menu
  const ariaProps = useMemo(() => {
    return getWebInteractiveAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'menu',
      accessibilityExpanded: accessibilityExpanded ?? open,
      accessibilityControls,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole, accessibilityExpanded, open, accessibilityControls]);

  menuStyles.useVariants({
    size,
  });

  const overlayProps = getWebProps([(menuStyles.overlay as any)({})]);
  const menuProps = getWebProps([(menuStyles.menu as any)({}), style as any]);
  const separatorProps = getWebProps([menuStyles.separator]);

  const handleTriggerClick = () => {
    onOpenChange?.(!open);
  };

  const handleItemClick = (item: typeof items[0]) => {
    if (item.disabled) return;

    item.onClick?.();

    if (closeOnSelection) {
      onOpenChange?.(false);
    }
  };

  const mergedMenuRef = useMergeRefs(ref, menuRef);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        style={{ display: 'inline-block' }}
        aria-haspopup={accessibilityHasPopup ?? 'menu'}
        aria-expanded={open}
        aria-controls={menuId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
      >
        {children}
      </div>

      {open && <div {...overlayProps} />}

      <PositionedPortal
        open={open}
        anchor={triggerRef}
        placement={placement}
        offset={4}
        onClickOutside={() => onOpenChange?.(false)}
        onEscapeKey={() => onOpenChange?.(false)}
        zIndex={1000}
      >
        <div
          {...menuProps}
          {...ariaProps}
          ref={mergedMenuRef}
          role="menu"
          id={menuId}
          data-testid={testID}
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={`separator-${index}`}
                  {...separatorProps}
                  role="separator"
                />
              );
            }

            return (
              <MenuItem
                key={item.id || index}
                item={item}
                onPress={handleItemClick}
                size={size}
                testID={testID ? `${testID}-item-${item.id || index}` : undefined}
                ref={(el) => {
                  if (el) menuItemRefs.current.set(index, el);
                }}
              />
            );
          })}
        </div>
      </PositionedPortal>
    </>
  );
});

Menu.displayName = 'Menu';

export default Menu;
