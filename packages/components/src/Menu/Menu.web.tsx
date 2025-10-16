import React, { useEffect, useRef, useState, isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuStyles } from './Menu.styles';
import type { MenuProps } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

const Menu: React.FC<MenuProps> = ({
  items,
  open = false,
  onOpenChange,
  anchor,
  placement = 'bottom-start',
  closeOnSelection = true,
  size = 'medium',
  style,
  testID,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const overlayProps = getWebProps([menuStyles.overlay]);
  const menuProps = getWebProps([menuStyles.menu, style]);
  const separatorProps = getWebProps([menuStyles.separator]);

  useEffect(() => {
    if (open && anchor.current && menuRef.current) {
      const anchorRect = anchor.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = anchorRect.top - menuRect.height - 8;
          left = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
          break;
        case 'top-start':
          top = anchorRect.top - menuRect.height - 8;
          left = anchorRect.left;
          break;
        case 'top-end':
          top = anchorRect.top - menuRect.height - 8;
          left = anchorRect.right - menuRect.width;
          break;
        case 'bottom':
          top = anchorRect.bottom + 8;
          left = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
          break;
        case 'bottom-start':
          top = anchorRect.bottom + 8;
          left = anchorRect.left;
          break;
        case 'bottom-end':
          top = anchorRect.bottom + 8;
          left = anchorRect.right - menuRect.width;
          break;
        case 'left':
          top = anchorRect.top + anchorRect.height / 2 - menuRect.height / 2;
          left = anchorRect.left - menuRect.width - 8;
          break;
        case 'right':
          top = anchorRect.top + anchorRect.height / 2 - menuRect.height / 2;
          left = anchorRect.right + 8;
          break;
      }

      // Keep menu within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 8) left = 8;
      if (left + menuRect.width > viewportWidth - 8) {
        left = viewportWidth - menuRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + menuRect.height > viewportHeight - 8) {
        top = viewportHeight - menuRect.height - 8;
      }

      setPosition({ top, left });
      setIsPositioned(true);
    }
  }, [open, anchor, placement]);

  // Reset positioned state when menu closes
  useEffect(() => {
    if (!open) {
      setIsPositioned(false);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchor.current &&
        !anchor.current.contains(event.target as Node)
      ) {
        onOpenChange?.(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [open, anchor, onOpenChange]);

  if (!open) return null;

  const handleItemClick = (item: typeof items[0]) => {
    if (item.disabled) return;

    item.onClick?.();

    if (closeOnSelection) {
      onOpenChange?.(false);
    }
  };

  return (
    <>
      <div {...overlayProps} />
      <div
        ref={menuRef}
        className={menuProps.className}
        style={{
          ...menuProps.style,
          top: position.top,
          left: position.left,
          opacity: isPositioned ? 1 : 0,
        }}
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

          // Apply item-specific variants
          const itemStylesheet = menuStyles;
          itemStylesheet.useVariants({
            size,
            disabled: Boolean(item.disabled),
            intent: item.intent || 'neutral',
          });

          const itemProps = getWebProps([menuStyles.menuItem]);
          const iconProps = getWebProps([menuStyles.menuItemIcon]);
          const labelProps = getWebProps([menuStyles.menuItemLabel]);

          // Helper to render icon
          const renderIcon = () => {
            if (!item.icon) return null;

            if (isIconName(item.icon)) {
              // Resolve icon name to path and render with IconSvg
              const iconPath = resolveIconPath(item.icon);
              return (
                <IconSvg
                  path={iconPath}
                  {...iconProps}
                  aria-label={item.icon}
                />
              );
            } else if (isValidElement(item.icon)) {
              // Render custom component as-is
              return item.icon;
            }

            return null;
          };

          return (
            <button
              key={item.id}
              className={itemProps.className}
              style={itemProps.style}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              role="menuitem"
              data-testid={`${testID}-item-${item.id}`}
            >
              {item.icon && (
                <span className={iconProps.className} style={iconProps.style}>
                  {renderIcon()}
                </span>
              )}
              <span className={labelProps.className}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Menu;
