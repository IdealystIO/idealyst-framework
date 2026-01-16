import { isValidElement, forwardRef, useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { chipStyles } from './Chip.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { ChipProps } from './types';
import type { IdealystElement } from '../utils/refTypes';

// Track if we've logged the onClick deprecation warning (log once per session)
let hasLoggedOnClickWarning = false;

const Chip = forwardRef<IdealystElement, ChipProps>(({
  label,
  type = 'filled',
  intent = 'primary',
  size = 'md',
  icon,
  deletable = false,
  onDelete,
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

  const handlePress = () => {
    if (disabled) return;
    // Prefer onPress, fall back to deprecated onClick
    const handler = onPress ?? onClick;
    if (handler) {
      handler();
    }
  };

  const handleDelete = () => {
    if (disabled) return;
    if (onDelete) {
      onDelete();
    }
  };

  // Compute actual selected state
  const isSelected = selectable ? selected : false;

  // Compute dynamic styles
  const containerStyle = (chipStyles.container as any)({ size, intent, type, selected: isSelected, disabled });
  const labelStyle = (chipStyles.label as any)({ size, intent, type, selected: isSelected });
  const iconStyle = (chipStyles.icon as any)({ size, intent, type, selected: isSelected });
  const deleteButtonStyle = (chipStyles.deleteButton as any)({ size });
  const deleteIconStyle = (chipStyles.deleteIcon as any)({ size, intent, type, selected: isSelected });

  // Map chip size to icon size
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const deleteIconSize = size === 'sm' ? 10 : size === 'md' ? 11 : 12;

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      return (
        <View style={iconStyle}>
          <MaterialDesignIcons
            name={icon}
            size={iconSize}
            style={iconStyle}
          />
        </View>
      );
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  const isClickable = ((onPress || onClick) && !disabled) || (selectable && !disabled);

  const innerContent = (
    <>
      {icon && renderIcon()}

      <Text style={labelStyle}>{label}</Text>

      {deletable && onDelete && (
        <Pressable
          style={deleteButtonStyle}
          onPress={handleDelete}
          disabled={disabled}
          hitSlop={8}
          accessibilityLabel="Delete"
          accessibilityRole="button"
        >
          <MaterialDesignIcons
            name="close"
            size={deleteIconSize}
            style={deleteIconStyle}
          />
        </Pressable>
      )}
    </>
  );

  if (isClickable) {
    return (
      <Pressable
        ref={ref as any}
        nativeID={id}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          selected: selectable ? selected : undefined,
          checked: accessibilityChecked ?? (selectable ? selected : undefined),
        }}
      >
        <View style={[containerStyle, style]} testID={testID}>
          {innerContent}
        </View>
      </Pressable>
    );
  }

  return (
    <View ref={ref as any} nativeID={id} style={[containerStyle, style]} testID={testID}>
      {innerContent}
    </View>
  );
});

Chip.displayName = 'Chip';

export default Chip;
