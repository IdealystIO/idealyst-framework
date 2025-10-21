import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';

const List: React.FC<ListProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  testID,
  scrollable = false,
  maxHeight,
}) => {
  // Apply variants
  listStyles.useVariants({
    variant,
    size,
    scrollable,
  });

  const containerStyle = [
    listStyles.container,
    maxHeight ? { maxHeight } : undefined,
    style,
  ];

  const containerProps = getWebProps(containerStyle);

  return (
    <ListProvider value={{ variant, size }}>
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
