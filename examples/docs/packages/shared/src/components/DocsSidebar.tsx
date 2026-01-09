import React, { useMemo } from 'react';
import { View, Text, List, ListItem, Divider } from '@idealyst/components';
import { useNavigator, DrawerSidebarProps } from '@idealyst/navigation';
import { componentRegistry } from '@idealyst/tooling';

// Static navigation sections (non-component pages)
const staticSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/installation' },
    ],
  },
  {
    title: 'Theme',
    items: [
      { label: 'Overview', path: '/theme/overview' },
      { label: 'Style Definition', path: '/theme/style-definition' },
      { label: 'Style Extensions', path: '/theme/style-extensions' },
      { label: 'Breakpoints', path: '/theme/breakpoints' },
      { label: 'Babel Plugin', path: '/theme/babel-plugin' },
    ],
  },
];

const navigationSection = {
  title: 'Navigation',
  items: [
    { label: 'Overview', path: '/navigation/overview' },
    { label: 'Routes', path: '/navigation/routes' },
    { label: 'useNavigator', path: '/navigation/use-navigator' },
  ],
};

// Component category order and grouping
const categoryOrder = ['layout', 'form', 'display', 'navigation', 'overlay', 'data', 'other'];

export function DocsSidebar({ insets }: DrawerSidebarProps) {
  const { navigate } = useNavigator();

  // Generate component navigation items from registry
  const componentItems = useMemo(() => {
    const items = Object.entries(componentRegistry)
      .map(([name, def]) => ({
        label: name,
        path: `/components/${name.toLowerCase()}`,
        category: def.category || 'other',
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return items;
  }, []);

  // Build full navigation sections
  const navigationSections = useMemo(() => {
    return [
      ...staticSections,
      {
        title: 'Components',
        items: [
          { label: 'Overview', path: '/components/overview' },
          ...componentItems,
        ],
      },
      navigationSection,
    ];
  }, [componentItems]);

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
