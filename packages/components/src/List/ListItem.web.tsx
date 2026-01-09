import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import { getColorFromString, Intent, Theme, Color } from '@idealyst/theme';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import { useListContext } from './ListContext';

const ListItem: React.FC<ListItemProps> = ({
  id,
  label,
  children,
  leading,
  trailing,
  iconColor,
  active = false,
  selected = false,
  disabled = false,
  indent = 0,
  size,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useUnistyles() as { theme: Theme };
  const listContext = useListContext();
  const isClickable = !disabled && !!onPress;

  // Use explicit size prop, fallback to context size, then default
  const effectiveSize = size ?? listContext.size ?? 'md';
  const effectiveVariant = listContext.type ?? 'default';

  // Apply variants (for size, active, selected, disabled on label)
  listStyles.useVariants({
    size: effectiveSize,
    active,
    selected,
    disabled,
  });

  // Get dynamic styles - call as functions for theme reactivity
  const itemStyle = (listStyles.item as any)({ type: effectiveVariant, disabled, clickable: isClickable });
  const labelStyle = (listStyles.label as any)({ disabled, selected });
  const leadingStyle = (listStyles.leading as any)({});
  const trailingStyle = (listStyles.trailing as any)({});
  const trailingIconStyle = (listStyles.trailingIcon as any)({});
  const labelContainerStyle = (listStyles.labelContainer as any)({});

  const itemProps = getWebProps([itemStyle, style]);
  const labelProps = getWebProps([labelStyle]);
  const leadingProps = getWebProps([leadingStyle]);
  const trailingProps = getWebProps([trailingStyle]);
  const trailingIconProps = getWebProps([trailingStyle, trailingIconStyle]);

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Resolve icon color - check intents first, then color palette
  const resolvedIconColor = (() => {
    if (!iconColor) return undefined;
    // Check if it's an intent name
    if (iconColor in theme.intents) {
      return theme.intents[iconColor as Intent]?.primary;
    }
    // Otherwise try color palette
    return getColorFromString(theme, iconColor as Color);
  })();

  // Helper to render leading/trailing icons
  // IconSvg uses size="1em" by default, sized by container's fontSize from styles
  const renderElement = (element: typeof leading | typeof trailing, isTrailing = false) => {
    if (!element) return null;

    if (isIconName(element)) {
      // Use IconSvg with name - registry lookup happens inside
      return (
        <IconSvg
          name={element}
          color={resolvedIconColor || 'currentColor'}
          aria-label={element}
        />
      );
    } else if (isValidElement(element)) {
      return element;
    }

    return null;
  };

  const labelContainerProps = getWebProps([labelContainerStyle]);

  const content = (
    <>
      {leading && (
        <span {...leadingProps}>
          {renderElement(leading)}
        </span>
      )}

      <div {...labelContainerProps}>
        {label && (
          <span {...labelProps}>{label}</span>
        )}
        {children}
      </div>

      {trailing && (
        <div {...trailingProps}>
          {renderElement(trailing, true)}
        </div>
      )}
    </>
  );

  const indentStyle = indent > 0 ? { paddingLeft: `${indent * 16}px` } : {};

  return (
    <div
      {...itemProps}
      style={{ ...indentStyle }}
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
