import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';

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

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const content = (
    <>
      {leading && (
        <div {...getWebProps([listStyles.leading])}>
          {leading}
        </div>
      )}

      <div {...getWebProps([listStyles.labelContainer])}>
        {label && (
          <span {...labelProps}>{label}</span>
        )}
        {children}
      </div>

      {trailing && (
        <div {...getWebProps([listStyles.trailing])}>
          {trailing}
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
