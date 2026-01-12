import { isValidElement, forwardRef, ComponentRef, useMemo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getColorFromString, Intent, Theme, Color } from '@idealyst/theme';
import { listStyles } from './List.styles';
import type { ListItemProps } from './types';
import { useListContext } from './ListContext';
import { getNativeSelectableAccessibilityProps } from '../utils/accessibility';

const ListItem = forwardRef<ComponentRef<typeof View> | ComponentRef<typeof Pressable>, ListItemProps & { isLast?: boolean }>(({
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
  isLast = false,
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

  // Get dynamic styles - call as functions to get theme-reactive styles
  const itemStyle = (listStyles.item as any)({ type: effectiveVariant, disabled, clickable: isClickable, isLast });
  const labelStyle = (listStyles.label as any)({ disabled, selected });
  const leadingStyle = (listStyles.leading as any)({});
  const trailingStyle = (listStyles.trailing as any)({});
  const trailingIconStyle = (listStyles.trailingIcon as any)({});
  const labelContainerStyle = (listStyles.labelContainer as any)({});

  // Resolve icon color - check intents first, then color palette
  const resolvedIconColor = useMemo(() => {
    if (!iconColor) return trailingIconStyle.color || leadingStyle.color;
    // Check if it's an intent name
    if (iconColor in theme.intents) {
      return theme.intents[iconColor as Intent]?.primary;
    }
    // Otherwise try color palette
    return getColorFromString(theme, iconColor as Color);
  }, [iconColor, theme, trailingIconStyle.color, leadingStyle.color]);

  // Helper to render leading/trailing icons
  const renderElement = (element: typeof leading | typeof trailing, styleKey: 'leading' | 'trailingIcon') => {
    if (!element) return null;

    // If it's a string, treat it as an icon name
    if (typeof element === 'string') {
      const iconSize = styleKey === 'leading' ? leadingStyle.width : trailingIconStyle.width;
      return (
        <MaterialDesignIcons
          name={element}
          size={iconSize}
          color={resolvedIconColor}
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
        <View style={leadingStyle}>
          {renderElement(leading, 'leading')}
        </View>
      )}

      <View style={labelContainerStyle}>
        {label && (
          <Text style={labelStyle}>{label}</Text>
        )}
        {children}
      </View>

      {trailing && (
        <View style={trailingStyle}>
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
