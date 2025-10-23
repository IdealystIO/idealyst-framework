import React, { useRef, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuStyles } from './Menu.styles';
import type { MenuProps } from './types';
import MenuItem from './MenuItem.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { PositionedPortal } from '../internal/PositionedPortal';

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
}, ref) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  menuStyles.useVariants({
    size,
  });

  const overlayProps = getWebProps([menuStyles.overlay]);
  const menuProps = getWebProps([menuStyles.menu, style]);
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
      <div ref={triggerRef} onClick={handleTriggerClick} style={{ display: 'inline-block' }}>
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
          ref={mergedMenuRef}
          className={menuProps.className}
          style={menuProps.style}
          role="menu"
          data-testid={testID}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={`separator-${index}`}
                  className={separatorProps.className}
                  style={separatorProps.style}
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
