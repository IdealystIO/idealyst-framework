import React, { forwardRef, useMemo, Children, isValidElement, cloneElement } from 'react';
import { View, ScrollView } from 'react-native';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';
import { getNativeAccessibilityProps } from '../utils/accessibility';

const List = forwardRef<View, ListProps>(({
  children,
  type = 'default',
  size = 'md',
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  scrollable = false,
  maxHeight,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'list',
      accessibilityHidden,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityRole, accessibilityHidden]);
  // Apply variants
  listStyles.useVariants({
    size,
    scrollable,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Call container style as function to get theme-reactive styles
  const containerBaseStyle = (listStyles.container as any)({ type, scrollable });

  const containerStyle = [
    containerBaseStyle,
    maxHeight ? { maxHeight } : undefined,
    style,
  ];

  // Process children to add isLast prop to the last child
  const childArray = Children.toArray(children);
  const processedChildren = childArray.map((child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        isLast: index === childArray.length - 1,
      } as Record<string, unknown>);
    }
    return child;
  });

  const content = (
    <ListProvider value={{ type, size }}>
      {processedChildren}
    </ListProvider>
  );

  if (scrollable) {
    return (
      <ScrollView
        ref={ref as any}
        nativeID={id}
        style={containerStyle as any}
        testID={testID}
        showsVerticalScrollIndicator={true}
        {...nativeA11yProps}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View ref={ref} nativeID={id} style={containerStyle as any} testID={testID} {...nativeA11yProps}>
      {content}
    </View>
  );
});

List.displayName = 'List';

export default List;
