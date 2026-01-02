import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';

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

  return (
    <ListProvider value={{ type, size }}>
      <div
        {...containerProps}
        role="list"
        data-testid={testID}
      >
        {children}
      </div>
    </ListProvider>
  );
};

export default List;
