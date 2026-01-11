import React, { isValidElement, forwardRef, ComponentRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { chipStyles } from './Chip.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { ChipProps } from './types';

const Chip = forwardRef<ComponentRef<typeof Pressable>, ChipProps>(({
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
  disabled = false,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityChecked,
}, ref) => {
  const handlePress = () => {
    if (disabled) return;
    if (onPress) {
      onPress();
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

  const isClickable = (onPress && !disabled) || (selectable && !disabled);

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
        ref={ref}
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
    <View ref={ref} nativeID={id} style={[containerStyle, style]} testID={testID}>
      {innerContent}
    </View>
  );
});

Chip.displayName = 'Chip';

export default Chip;
