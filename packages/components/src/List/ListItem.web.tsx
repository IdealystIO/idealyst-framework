import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

const ListItem: React.FC<ListItemProps> = ({
  id,
  label,
  children,
  leading,
  trailing,
  active = false,
  selected = false,
  disabled = false,
  indent = 0,
  onPress,
  style,
  testID,
}) => {
  const isClickable = !disabled && !!onPress;

  // Apply variants
  listStyles.useVariants({
    size: 'medium', // Default size, can be overridden by parent List context
    variant: 'default',
    active,
    selected,
    disabled,
    clickable: isClickable,
  });

  const itemProps = getWebProps([listStyles.item, style]);
  const labelProps = getWebProps([listStyles.label]);
  const leadingProps = getWebProps([listStyles.leading]);
  const trailingProps = getWebProps([listStyles.trailing]);
  const trailingIconProps = getWebProps([listStyles.trailing, listStyles.trailingIcon]);

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Helper to render leading/trailing icons
  const renderElement = (element: typeof leading | typeof trailing, props: any, isTrailing = false) => {
    if (!element) return null;

    if (isIconName(element)) {
      const iconPath = resolveIconPath(element);
      // Use trailingIconProps for trailing icons to apply size constraints
      const iconPropsToUse = isTrailing ? trailingIconProps : props;
      return (
        <IconSvg
          path={iconPath}
          {...iconPropsToUse}
          aria-label={element}
        />
      );
    } else if (isValidElement(element)) {
      return element;
    }

    return null;
  };

  const content = (
    <>
      {leading && renderElement(leading, leadingProps)}

      <div {...getWebProps([listStyles.labelContainer])}>
        {label && (
          <span {...labelProps}>{label}</span>
        )}
        {children}
      </div>

      {trailing && (
        <div {...trailingProps}>
          {renderElement(trailing, trailingIconProps, true)}
        </div>
      )}
    </>
  );

  const indentStyle = indent > 0 ? { paddingLeft: `${indent * 16}px` } : {};

  if (isClickable) {
    return (
      <button
        {...itemProps}
        style={{ ...itemProps.style, ...indentStyle }}
        onClick={handleClick}
        disabled={disabled}
        role="listitem"
        aria-selected={selected}
        aria-disabled={disabled}
        data-testid={testID}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      {...itemProps}
      style={{ ...itemProps.style, ...indentStyle }}
      role="listitem"
      aria-selected={selected}
      data-testid={testID}
    >
      {content}
    </div>
  );
};

export default ListItem;
