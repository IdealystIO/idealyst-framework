import React, { Children, cloneElement, isValidElement } from 'react';
import { View } from 'react-native';
import { listStyles } from './List.styles';
import type { ListProps } from './types';

const List: React.FC<ListProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  testID,
}) => {
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
    <View style={[listStyles.container, style]} testID={testID}>
      {enhancedChildren}
    </View>
  );
};

export default List;
