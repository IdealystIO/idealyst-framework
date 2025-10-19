import React, { Children, cloneElement, isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
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

  const containerProps = getWebProps([listStyles.container, style]);

  // Clone children to pass down variant and size context
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      // Pass variant and size to ListItem children
      return cloneElement(child, {
        ...child.props,
        variant,
        size,
      } as any);
    }
    return child;
  });

  return (
    <div
      {...containerProps}
      role="list"
      data-testid={testID}
    >
      {enhancedChildren}
    </div>
  );
};

export default List;
