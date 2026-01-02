import React, { forwardRef } from 'react';
import { View, ScrollView } from 'react-native';
import { listStyles } from './List.styles';
import type { ListProps } from './types';
import { ListProvider } from './ListContext';

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
}, ref) => {
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
    style,
  ];

  const content = (
    <ListProvider value={{ type, size }}>
      {children}
    </ListProvider>
  );

  if (scrollable) {
    return (
      <ScrollView
        ref={ref as any}
        style={containerStyle as any}
        testID={testID}
        showsVerticalScrollIndicator={true}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View ref={ref} style={containerStyle as any} testID={testID}>
      {content}
    </View>
  );
});

List.displayName = 'List';

export default List;
