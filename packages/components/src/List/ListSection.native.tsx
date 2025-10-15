import React from 'react';
import { View, Text } from 'react-native';
import { listStyles } from './List.styles';
import type { ListSectionProps } from './types';

const ListSection: React.FC<ListSectionProps> = ({
  title,
  children,
  collapsed = false,
  style,
  testID,
}) => {
  return (
    <View style={[listStyles.section, style]} testID={testID}>
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
};

export default ListSection;
