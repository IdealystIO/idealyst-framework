import React, { Children, cloneElement, isValidElement, forwardRef } from 'react';
import { View } from 'react-native';
import { listStyles } from './List.styles';
import type { ListProps } from './types';

const List = forwardRef<View, ListProps>(({
  children,
  variant = 'default',
  size = 'md',
  style,
  testID,
}, ref) => {
  // Apply variants
  listStyles.useVariants({
    variant,
    size,
  });

  // Clone children to pass down variant and size context
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...child.props,
        variant,
        size,
      } as any);
    }
    return child;
  });

  return (
    <View ref={ref} style={[listStyles.container, style]} testID={testID}>
      {enhancedChildren}
    </View>
  );
});

List.displayName = 'List';

export default List;
