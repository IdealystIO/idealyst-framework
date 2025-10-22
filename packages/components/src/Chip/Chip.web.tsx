import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { chipStyles } from './Chip.styles';
import type { ChipProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

const Chip = forwardRef<HTMLDivElement, ChipProps>(({
  label,
  variant = 'filled',
  intent = 'primary',
  size = 'md',
  icon,
  deletable = false,
  onDelete,
  deleteIcon = 'close',
  selectable = false,
  selected = false,
  onPress,
  disabled = false,
  style,
  testID,
}, ref) => {
  chipStyles.useVariants({
    size,
    variant,
    intent,
    selected: selectable ? selected : false,
    disabled,
  });

  const containerProps = getWebProps([chipStyles.container, style]);
  const labelProps = getWebProps([chipStyles.label]);
  const iconProps = getWebProps([chipStyles.icon]);
  const deleteButtonProps = getWebProps([chipStyles.deleteButton]);
  const deleteIconProps = getWebProps([chipStyles.deleteIcon]);

  const handleClick = () => {
    if (disabled) return;
    if (onPress) {
      onPress();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (onDelete) {
      onDelete();
    }
  };

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (isIconName(icon)) {
      const iconPath = resolveIconPath(icon);
      return (
        <IconSvg
          path={iconPath}
          {...iconProps}
          aria-label={icon}
        />
      );
    } else if (isValidElement(icon)) {
      return icon;
    }

    return null;
  };

  // Helper to render delete icon
  const renderDeleteIcon = () => {
    if (isIconName(deleteIcon)) {
      const iconPath = resolveIconPath(deleteIcon);
      return (
        <IconSvg
          path={iconPath}
          {...deleteIconProps}
          aria-label={deleteIcon}
        />
      );
    } else if (isValidElement(deleteIcon)) {
      return deleteIcon;
    }

    return null;
  };

  const isClickable = (onPress && !disabled) || (selectable && !disabled);

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <div
      className={containerProps.className}
      ref={mergedRef}
      style={{
        ...containerProps.style,
        cursor: isClickable ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleClick}
      data-testid={testID}
      role={isClickable ? 'button' : undefined}
      aria-disabled={disabled}
      aria-pressed={selectable ? selected : undefined}
    >
      {icon && (
        <span
          className={iconProps.className}
          style={{
            ...iconProps.style,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIcon()}
        </span>
      )}

      <span
        className={labelProps.className}
        style={{
          ...labelProps.style,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {label}
      </span>

      {deletable && onDelete && (
        <button
          className={deleteButtonProps.className}
          style={{
            ...deleteButtonProps.style,
            background: 'transparent',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleDelete}
          disabled={disabled}
          aria-label="Delete"
          type="button"
        >
          {renderDeleteIcon()}
        </button>
      )}
    </div>
  );
});

Chip.displayName = 'Chip';

export default Chip;
