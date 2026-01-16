import { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { listStyles } from './List.styles';
import type { ListSectionProps } from './types';
import type { IdealystElement } from '../utils/refTypes';

const ListSection = forwardRef<IdealystElement, ListSectionProps>(({
  title,
  children,
  collapsed = false,
  style,
  testID,
}, ref) => {
  return (
    <View ref={ref as any} style={[listStyles.section, style]} testID={testID}>
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
