import React from 'react';
import { View, Text, List, ListItem, Divider } from '@idealyst/components';
import { useNavigator, DrawerSidebarProps } from '@idealyst/navigation';
import { navigationSections } from '../navigation/DocsRouter';

export function DocsSidebar({ insets }: DrawerSidebarProps) {
  const { navigate } = useNavigator();

  return (
    <View
      style={{
        height: '100%',
        overflow: 'auto',
        paddingTop: insets?.top || 16,
        paddingBottom: insets?.bottom || 16,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {navigationSections.map((section, sectionIndex) => (
        <List key={section.title}>
          <Text
            typography="caption"
            weight="bold"
            color="secondary"
            style={{ marginBottom: 8, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {section.title}
          </Text>
          {section.items.map((item) => (
            <ListItem
              key={item.path}
              label={item.label}
              size="sm"
              onPress={() => navigate({ path: item.path })}
            />
          ))}
          {sectionIndex < navigationSections.length - 1 && (
            <Divider spacing="sm" style={{ marginTop: 8 }} />
          )}
        </List>
      ))}
    </View>
  );
}
