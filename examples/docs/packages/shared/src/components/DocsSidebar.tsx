import React from 'react';
import { View, Text, List, ListItem, Divider, Screen } from '@idealyst/components';
import { useNavigator, DrawerSidebarProps } from '@idealyst/navigation';
import { navigationSections } from '../navigation/DocsRouter';

export function DocsSidebar({ insets }: DrawerSidebarProps) {
  const { navigate } = useNavigator();

  return (
    <Screen
      style={{
        height: '100%',
        padding: 16,
      }}
      contentInset={insets}
    >

      {navigationSections.map((section, sectionIndex) => (
        <List key={section.title}>
          <Text
            size="sm"
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
    </Screen>
  );
}
