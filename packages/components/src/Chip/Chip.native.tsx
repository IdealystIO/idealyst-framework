import React, { isValidElement, forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { chipStyles } from './Chip.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { ChipProps } from './types';

const Chip = forwardRef<Pressable, ChipProps>(({
  label,
  variant = 'filled',
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
}, ref) => {
  chipStyles.useVariants({
    size,
    variant,
    intent,
    selected: selectable ? selected : false,
    disabled,
  });

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

  // Map chip size to icon size
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const deleteIconSize = size === 'sm' ? 10 : size === 'md' ? 11 : 12;

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      const iconColor = chipStyles.icon.color || '#000';
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={iconColor}
        />
      );
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  const isClickable = (onPress && !disabled) || (selectable && !disabled);

  const innerContent = (
    <>
      {icon && <View style={chipStyles.icon}>{renderIcon()}</View>}

      <Text style={chipStyles.label}>{label}</Text>

      {deletable && onDelete && (
        <Pressable
          style={chipStyles.deleteButton}
          onPress={handleDelete}
          disabled={disabled}
          hitSlop={8}
          accessibilityLabel="Delete"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="close"
            size={deleteIconSize}
            color={chipStyles.label.color || '#000'}
          />
        </Pressable>
      )}
    </>
  );

  if (isClickable) {
    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          selected: selectable ? selected : undefined,
        }}
      >
        <View style={[chipStyles.container, style]} testID={testID}>
          {innerContent}
        </View>
      </Pressable>
    );
  }

  return (
    <View ref={ref as any} style={[chipStyles.container, style]} testID={testID}>
      {innerContent}
    </View>
  );
});

Chip.displayName = 'Chip';

export default Chip;
