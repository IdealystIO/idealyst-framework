/**
 * Breadcrumb Component Examples
 *
 * These examples are type-checked against the actual BreadcrumbProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Breadcrumb, View, Text, Icon } from '@idealyst/components';
import type { BreadcrumbItem } from '@idealyst/components';

// Example 1: Basic Breadcrumb
export function BasicBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Products', onPress: () => console.log('Products') },
    { label: 'Electronics', onPress: () => console.log('Electronics') },
    { label: 'Laptops' },
  ];

  return <Breadcrumb items={items} />;
}

// Example 2: Breadcrumb with Icons
export function BreadcrumbWithIcons() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', icon: 'home', onPress: () => console.log('Home') },
    { label: 'Documents', icon: 'folder', onPress: () => console.log('Documents') },
    { label: 'Projects', icon: 'folder-open', onPress: () => console.log('Projects') },
    { label: 'Report.pdf', icon: 'file-document' },
  ];

  return <Breadcrumb items={items} />;
}

// Example 3: Breadcrumb with Custom Icons
export function BreadcrumbWithCustomIcons() {
  const items: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      icon: <Icon name="view-dashboard" size="sm" />,
      onPress: () => console.log('Dashboard'),
    },
    {
      label: 'Analytics',
      icon: <Icon name="chart-line" size="sm" />,
      onPress: () => console.log('Analytics'),
    },
    {
      label: 'Reports',
      icon: <Icon name="file-chart" size="sm" />,
    },
  ];

  return <Breadcrumb items={items} />;
}

// Example 4: Breadcrumb Sizes
export function BreadcrumbSizes() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => {} },
    { label: 'Category', onPress: () => {} },
    { label: 'Subcategory' },
  ];

  return (
    <View spacing="lg">
      <View spacing="sm">
        <Text weight="semibold">Extra Small</Text>
        <Breadcrumb items={items} size="xs" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Small</Text>
        <Breadcrumb items={items} size="sm" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Medium</Text>
        <Breadcrumb items={items} size="md" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Large</Text>
        <Breadcrumb items={items} size="lg" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Extra Large</Text>
        <Breadcrumb items={items} size="xl" />
      </View>
    </View>
  );
}

// Example 5: Breadcrumb with Custom Separator
export function BreadcrumbWithCustomSeparator() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => {} },
    { label: 'Products', onPress: () => {} },
    { label: 'Item' },
  ];

  return (
    <View spacing="md">
      <Breadcrumb items={items} separator=">" />
      <Breadcrumb items={items} separator="-" />
      <Breadcrumb items={items} separator="•" />
      <Breadcrumb items={items} separator={<Icon name="chevron-right" size="sm" />} />
    </View>
  );
}

// Example 6: Breadcrumb with Intent Colors
export function BreadcrumbWithIntent() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => {} },
    { label: 'Settings', onPress: () => {} },
    { label: 'Profile' },
  ];

  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Primary Intent</Text>
        <Breadcrumb items={items} intent="primary" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Neutral Intent</Text>
        <Breadcrumb items={items} intent="neutral" />
      </View>
    </View>
  );
}

// Example 7: Breadcrumb with Max Items
export function BreadcrumbWithMaxItems() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => {} },
    { label: 'Level 1', onPress: () => {} },
    { label: 'Level 2', onPress: () => {} },
    { label: 'Level 3', onPress: () => {} },
    { label: 'Level 4', onPress: () => {} },
    { label: 'Current Page' },
  ];

  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">All Items (6 total)</Text>
        <Breadcrumb items={items} />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Max 4 Items</Text>
        <Breadcrumb items={items} maxItems={4} />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Max 3 Items</Text>
        <Breadcrumb items={items} maxItems={3} />
      </View>
    </View>
  );
}

// Example 8: Breadcrumb with Disabled Items
export function BreadcrumbWithDisabledItems() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Restricted', disabled: true },
    { label: 'Current Page' },
  ];

  return (
    <View spacing="md">
      <Breadcrumb items={items} />
      <Text size="sm" >
        The "Restricted" item is disabled
      </Text>
    </View>
  );
}

// Example 9: Responsive Breadcrumb
export function ResponsiveBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', icon: 'home', onPress: () => {} },
    { label: 'Products', onPress: () => {} },
    { label: 'Electronics', onPress: () => {} },
    { label: 'Laptops', onPress: () => {} },
    { label: 'Gaming Laptops' },
  ];

  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Responsive (collapses on narrow screens)</Text>
        <Breadcrumb items={items} responsive minVisibleItems={3} />
      </View>
      <Text size="sm" >
        Try resizing the window to see the breadcrumb collapse
      </Text>
    </View>
  );
}

// Example 10: File System Navigation
export function FileSystemBreadcrumb() {
  const [path, setPath] = React.useState(['Users', 'john', 'Documents', 'Projects']);

  const items: BreadcrumbItem[] = [
    {
      label: 'Root',
      icon: 'harddisk',
      onPress: () => setPath([]),
    },
    ...path.map((folder, index) => ({
      label: folder,
      icon: index === path.length - 1 ? 'folder-open' : 'folder',
      onPress:
        index < path.length - 1
          ? () => setPath(path.slice(0, index + 1))
          : undefined,
    })),
  ];

  return (
    <View spacing="md">
      <Breadcrumb items={items} separator="/" />
      <Text size="sm" >
        Current path: /{path.join('/')}
      </Text>
    </View>
  );
}

// Example 11: E-commerce Breadcrumb
export function EcommerceBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { label: 'Home', icon: 'home', onPress: () => console.log('Navigate to home') },
    { label: 'Electronics', onPress: () => console.log('Navigate to electronics') },
    { label: 'Computers', onPress: () => console.log('Navigate to computers') },
    { label: 'Laptops', onPress: () => console.log('Navigate to laptops') },
    { label: 'Gaming Laptops' },
  ];

  return (
    <View spacing="lg">
      <Breadcrumb items={items} intent="primary" />
      <View spacing="md">
        <Text size="xl" weight="bold">
          Gaming Laptops
        </Text>
        <Text>Browse our selection of high-performance gaming laptops.</Text>
      </View>
    </View>
  );
}

// Example 12: Documentation Breadcrumb
export function DocumentationBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { label: 'Docs', icon: 'book-open', onPress: () => {} },
    { label: 'Components', icon: 'puzzle', onPress: () => {} },
    { label: 'Navigation', icon: 'navigation', onPress: () => {} },
    { label: 'Breadcrumb', icon: 'file-document' },
  ];

  return (
    <View spacing="lg">
      <Breadcrumb
        items={items}
        size="md"
        separator={<Icon name="chevron-right" size="xs" />}
      />
      <View spacing="md">
        <Text size="xl" weight="bold">
          Breadcrumb Component
        </Text>
        <Text>
          Learn how to use the Breadcrumb component to create hierarchical navigation in your
          application.
        </Text>
      </View>
    </View>
  );
}

// Example 13: Settings Navigation Breadcrumb
export function SettingsBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { label: 'Settings', icon: 'cog', onPress: () => {} },
    { label: 'Account', icon: 'account', onPress: () => {} },
    { label: 'Privacy', icon: 'shield-lock' },
  ];

  return (
    <View spacing="lg">
      <Breadcrumb items={items} intent="neutral" size="md" />
      <View spacing="md">
        <Text size="lg" weight="bold">
          Privacy Settings
        </Text>
        <Text>Manage your privacy preferences and data sharing options.</Text>
      </View>
    </View>
  );
}
