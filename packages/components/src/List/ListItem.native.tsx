import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
    size: 'medium', // Default size
    variant: 'default',
    active,
    selected,
    disabled,
    clickable: isClickable,
  });

  const content = (
    <>
      {leading && (
        <View style={listStyles.leading}>
          {leading}
        </View>
      )}

      <View style={listStyles.labelContainer}>
        {label && (
          <Text style={listStyles.label}>{label}</Text>
        )}
        {children}
      </View>

      {trailing && (
        <View style={listStyles.trailing}>
          {trailing}
        </View>
      )}
    </>
  );

  const indentStyle = indent > 0 ? { paddingLeft: indent * 16 } : {};
  const combinedStyle = [listStyles.item, indentStyle, style];

  if (isClickable) {
    return (
      <TouchableOpacity
        style={combinedStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={combinedStyle} testID={testID}>
      {content}
    </View>
  );
};

export default ListItem;
