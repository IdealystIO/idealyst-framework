import React, { forwardRef } from 'react';
import { View, ScrollView } from 'react-native';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';

const List = forwardRef<View, ListProps>(({
  children,
  variant = 'default',
  size = 'md',
  style,
  testID,
  scrollable = false,
  maxHeight,
}, ref) => {
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

  const content = (
    <ListProvider value={{ variant, size }}>
      {children}
    </ListProvider>
  );

  if (scrollable) {
    return (
      <ScrollView
        ref={ref as any}
        style={containerStyle}
        testID={testID}
        showsVerticalScrollIndicator={true}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View ref={ref} style={containerStyle} testID={testID}>
      {content}
    </View>
  );
});

List.displayName = 'List';

export default List;
