import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { listStyles } from './List.styles';
import type { ListSectionProps } from './types';

const ListSection = forwardRef<View, ListSectionProps>(({
  title,
  children,
  collapsed = false,
  style,
  testID,
}, ref) => {
  return (
    <View ref={ref} style={[listStyles.section, style]} testID={testID}>
      {title && (
        <Text style={listStyles.sectionTitle}>
          {title}
        </Text>
      )}
      {!collapsed && (
        <View style={listStyles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
});

ListSection.displayName = 'ListSection';

export default ListSection;
