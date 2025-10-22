import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import { useListContext } from './ListContext';

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
  size,
  onPress,
  style,
  testID,
}) => {
  const listContext = useListContext();
  const isClickable = !disabled && !!onPress;

  // Use explicit size prop, fallback to context size, then default
  const effectiveSize = size ?? listContext.size ?? 'md';
  const effectiveVariant = listContext.variant ?? 'default';

  // Apply variants
  listStyles.useVariants({
    size: effectiveSize,
    variant: effectiveVariant,
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

  return (
    <div
      {...itemProps}
      style={{ ...itemProps.style, ...indentStyle }}
      onClick={isClickable ? handleClick : undefined}
      role="listitem"
      aria-selected={selected}
      aria-disabled={disabled}
      data-testid={testID}
    >
      {content}
    </div>
  );
};

export default ListItem;
