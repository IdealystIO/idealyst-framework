import React, { isValidElement, forwardRef, ComponentRef, useMemo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getColorFromString, Intent, Theme, Color } from '@idealyst/theme';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { useListContext } from './ListContext';
import { getNativeSelectableAccessibilityProps } from '../utils/accessibility';

const ListItem = forwardRef<ComponentRef<typeof View> | ComponentRef<typeof Pressable>, ListItemProps>(({
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
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
  accessibilitySelected,
  accessibilityDisabled,
}, ref) => {
  const { theme } = useUnistyles() as { theme: Theme };
  const listContext = useListContext();
  const isClickable = !disabled && !!onPress;

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeSelectableAccessibilityProps({
      accessibilityLabel: accessibilityLabel ?? label,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? (isClickable ? 'button' : 'none'),
      accessibilityHidden,
      accessibilitySelected: accessibilitySelected ?? selected,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
    });
  }, [accessibilityLabel, label, accessibilityHint, accessibilityRole, isClickable, accessibilityHidden, accessibilitySelected, selected, accessibilityDisabled, disabled]);

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

  // Get dynamic item style with type, disabled, and clickable props
  const itemStyle = (listStyles.item as any)({ type: effectiveVariant, disabled, clickable: isClickable });

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
  const renderElement = (element: typeof leading | typeof trailing, styleKey: 'leading' | 'trailingIcon') => {
    if (!element) return null;

    // If it's a string, treat it as an icon name
    if (typeof element === 'string') {
      const iconStyle = styleKey === 'leading' ? listStyles.leading : listStyles.trailingIcon;
      return (
        <MaterialCommunityIcons
          name={element}
          size={iconStyle.width}
          color={resolvedIconColor ?? iconStyle.color}
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
  const combinedStyle = [itemStyle, indentStyle, style];

  if (isClickable) {
    return (
      <Pressable
        ref={ref as any}
        nativeID={id}
        style={combinedStyle}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        {...nativeA11yProps}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View ref={ref as any} nativeID={id} style={combinedStyle} testID={testID} {...nativeA11yProps}>
      {content}
    </View>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
