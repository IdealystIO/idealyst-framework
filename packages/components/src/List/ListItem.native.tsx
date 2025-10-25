import React, { isValidElement, forwardRef, ComponentRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { useListContext } from './ListContext';

const ListItem = forwardRef<ComponentRef<typeof View> | ComponentRef<typeof TouchableOpacity>, ListItemProps>(({
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
}, ref) => {
  const listContext = useListContext();
  const isClickable = !disabled && !!onPress;

  // Use explicit size prop, fallback to context size, then default
  const effectiveSize = size ?? listContext.size ?? 'md';
  const effectiveVariant = listContext.type ?? 'default';

  // Apply types
  listStyles.useVariants({
    size: effectiveSize,
    active,
    selected,
    disabled,
    clickable: isClickable,
  });

  // Helper to render leading/trailing icons
  const renderElement = (element: typeof leading | typeof trailing, styleKey: 'leading' | 'trailingIcon') => {
    if (!element) return null;

    // If it's a string, treat it as an icon name
    if (typeof element === 'string') {
      const iconStyle = styleKey === 'leading' ? listStyles.leading : listStyles.trailingIcon;
      return (
        <MaterialCommunityIcons
          name={element}
          size={iconStyle.width}
          color={iconStyle.color}
        />
      );
    } else if (isValidElement(element)) {
      // Custom React element
      return element;
    }

    return null;
  };

  const content = (
    <>
      {leading && (
        <View style={listStyles.leading}>
          {renderElement(leading, 'leading')}
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
          {renderElement(trailing, 'trailingIcon')}
        </View>
      )}
    </>
  );

  const indentStyle = indent > 0 ? { paddingLeft: indent * 16 } : {};
  const combinedStyle = [listStyles.item, indentStyle, style];

  if (isClickable) {
    return (
      <TouchableOpacity
        ref={ref as any}
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
    <View ref={ref as any} style={combinedStyle} testID={testID}>
      {content}
    </View>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
