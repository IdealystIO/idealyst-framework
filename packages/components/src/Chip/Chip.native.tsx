import React, { isValidElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { chipStyles } from './Chip.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { ChipProps } from './types';

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  intent = 'primary',
  size = 'medium',
  icon,
  deletable = false,
  onDelete,
  selectable = false,
  selected = false,
  onPress,
  disabled = false,
  style,
  testID,
}) => {
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
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  const deleteIconSize = size === 'small' ? 10 : size === 'medium' ? 11 : 12;

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

  const content = (
    <View style={[chipStyles.container, style]} testID={testID}>
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
    </View>
  );

  if (isClickable) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          selected: selectable ? selected : undefined,
        }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

export default Chip;
