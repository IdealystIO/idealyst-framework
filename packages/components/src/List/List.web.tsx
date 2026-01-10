import React, { Children, isValidElement, cloneElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';

/**
 * Container for displaying a collection of related items in a vertical layout.
 * Provides consistent spacing and optional scrolling with ListItem children.
 */
const List: React.FC<ListProps> = ({
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
}) => {
  // Apply types
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

  const containerStyle = [
    listStyles.container,
    maxHeight ? { maxHeight } : undefined,
    style as any,
  ];

  const containerProps = getWebProps(containerStyle);

  // Process children to add isLast prop to the last child
  const childArray = Children.toArray(children);
  const processedChildren = childArray.map((child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...child.props,
        isLast: index === childArray.length - 1,
      });
    }
    return child;
  });

  return (
    <ListProvider value={{ type, size }}>
      <div
        {...containerProps}
        role="list"
        id={id}
        data-testid={testID}
      >
        {processedChildren}
      </div>
    </ListProvider>
  );
};

export default List;
