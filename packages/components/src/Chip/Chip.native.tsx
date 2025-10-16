import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { chipStyles } from './Chip.styles';
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
  const { styles } = useStyles(chipStyles, {
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

  const isClickable = (onPress && !disabled) || (selectable && !disabled);

  const content = (
    <View style={[styles.container, style]} testID={testID}>
      {icon && <View style={styles.icon}>{icon}</View>}

      <Text style={styles.label}>{label}</Text>

      {deletable && onDelete && (
        <Pressable
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={disabled}
          hitSlop={8}
          accessibilityLabel="Delete"
          accessibilityRole="button"
        >
          <Text style={styles.deleteIcon}>✕</Text>
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
