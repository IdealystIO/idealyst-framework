import React, { isValidElement, forwardRef, useEffect, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { chipStyles } from './Chip.styles';
import type { ChipProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';

// Track if we've logged the onClick deprecation warning (log once per session)
let hasLoggedOnClickWarning = false;

/**
 * Compact interactive element for tags, filters, or selections.
 * Supports icons, selection state, and delete functionality.
 */
const Chip = forwardRef<IdealystElement, ChipProps>(({
  label,
  type = 'filled',
  intent = 'primary',
  size = 'md',
  icon,
  deletable = false,
  onDelete,
  deleteIcon = 'close',
  selectable = false,
  selected = false,
  onPress,
  onClick,
  disabled = false,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityChecked,
}, ref) => {
  const hasWarnedRef = useRef(false);

  // Warn about onClick usage (deprecated)
  useEffect(() => {
    if (onClick && !hasWarnedRef.current && !hasLoggedOnClickWarning) {
      hasWarnedRef.current = true;
      hasLoggedOnClickWarning = true;
      console.warn(
        '[Chip] onClick is deprecated. Use onPress instead.\n' +
        'Chip is a cross-platform component that follows React Native conventions.\n' +
        'onClick will be removed in a future version.\n\n' +
        'Migration: Replace onClick={handler} with onPress={handler}'
      );
    }
  }, [onClick]);

  // Compute actual selected state
  const isSelected = selectable ? selected : false;

  // Compute dynamic styles
  const containerProps = getWebProps([(chipStyles.container as any)({ size, intent, type, selected: isSelected, disabled }), style as any]);
  const labelProps = getWebProps([(chipStyles.label as any)({ size, intent, type, selected: isSelected })]);
  const iconProps = getWebProps([(chipStyles.icon as any)({ size, intent, type, selected: isSelected })]);
  const deleteButtonProps = getWebProps([(chipStyles.deleteButton as any)({ size })]);
  const deleteIconProps = getWebProps([(chipStyles.deleteIcon as any)({ size, intent, type, selected: isSelected })]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    // Prefer onPress, fall back to deprecated onClick
    const handler = onPress ?? onClick;
    if (handler) {
      handler();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
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
      return (
        <IconSvg
          name={icon}
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
      return (
        <IconSvg
          name={deleteIcon}
          {...deleteIconProps}
          aria-label={deleteIcon}
        />
      );
    } else if (isValidElement(deleteIcon)) {
      return deleteIcon;
    }

    return null;
  };

  const isClickable = ((onPress || onClick) && !disabled) || (selectable && !disabled);

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <div
      {...containerProps}
      ref={mergedRef}
      id={id}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleClick}
      data-testid={testID}
      role={isClickable ? 'button' : undefined}
      aria-label={accessibilityLabel ?? label}
      aria-disabled={disabled}
      aria-pressed={accessibilityChecked ?? (selectable ? selected : undefined)}
    >
      {icon && (
        <span
          {...iconProps}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIcon()}
        </span>
      )}

      <span
        {...labelProps}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {label}
      </span>

      {deletable && onDelete && (
        <button
          {...deleteButtonProps}
          style={{
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
