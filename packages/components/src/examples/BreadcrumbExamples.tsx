import React from 'react';
import { Screen } from '../Screen';
import { View } from '../View';
import { Text } from '../Text';
import { Breadcrumb } from '../Breadcrumb';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import type { BreadcrumbItem } from '../Breadcrumb/types';

export const BreadcrumbExamples = () => {
  const basicItems: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Products', onPress: () => console.log('Products') },
    { label: 'Category', onPress: () => console.log('Category') },
    { label: 'Item' },
  ];

  const withIconsItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      icon: <Icon name="home" size="sm" />,
      onPress: () => console.log('Home'),
    },
    {
      label: 'Documents',
      icon: <Icon name="folder" size="sm" />,
      onPress: () => console.log('Documents'),
    },
    {
      label: 'Projects',
      icon: <Icon name="folder-open" size="sm" />,
      onPress: () => console.log('Projects'),
    },
    {
      label: 'Current File',
      icon: <Icon name="file-document" size="sm" />,
    },
  ];

  const withIconNamesItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      icon: 'home',
      onPress: () => console.log('Home'),
    },
    {
      label: 'Documents',
      icon: 'folder',
      onPress: () => console.log('Documents'),
    },
    {
      label: 'Projects',
      icon: 'folder-open',
      onPress: () => console.log('Projects'),
    },
    {
      label: 'Current File',
      icon: 'file-document',
    },
  ];

  const longPathItems: BreadcrumbItem[] = [
    { label: 'Home', onPress: () => console.log('Home') },
    { label: 'Level 1', onPress: () => console.log('Level 1') },
    { label: 'Level 2', onPress: () => console.log('Level 2') },
    { label: 'Level 3', onPress: () => console.log('Level 3') },
    { label: 'Level 4', onPress: () => console.log('Level 4') },
    { label: 'Level 5', onPress: () => console.log('Level 5') },
    { label: 'Current Page' },
  ];

  return (
    <Screen background="primary" safeArea>
      <View spacing="lg" style={{ maxWidth: 800, width: '100%', paddingHorizontal: 16, marginHorizontal: 'auto' }}>
        <Text size="xlarge" weight="bold">Breadcrumb Examples</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Basic Breadcrumb</Text>

        <Breadcrumb items={basicItems} />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">With Icons (Components)</Text>

        <Breadcrumb items={withIconsItems} />
        <Text size="small" color="secondary">Using Icon components</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">With Icons (Icon Names)</Text>

        <Breadcrumb items={withIconNamesItems} />
        <Text size="small" color="secondary">Using icon name strings (recommended)</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Custom Separator</Text>

        <Breadcrumb
          items={basicItems}
          separator=">"
        />

        <Breadcrumb
          items={basicItems}
          separator="•"
        />

        <Breadcrumb
          items={basicItems}
          separator={<Icon name="chevron-right" size="sm" />}
        />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Sizes</Text>

        <Text size="medium" weight="semibold">Small</Text>
        <Breadcrumb items={basicItems} size="small" />

        <Text size="medium" weight="semibold">Medium (Default)</Text>
        <Breadcrumb items={basicItems} size="medium" />

        <Text size="medium" weight="semibold">Large</Text>
        <Breadcrumb items={basicItems} size="large" />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Intent Colors</Text>

        <Text size="medium" weight="semibold">Primary (Default)</Text>
        <Breadcrumb items={basicItems} intent="primary" />

        <Text size="medium" weight="semibold">Neutral</Text>
        <Breadcrumb items={basicItems} intent="neutral" />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Truncation</Text>

        <Text size="small" color="secondary">Full path (7 items):</Text>
        <Breadcrumb items={longPathItems} />

        <Text size="small" color="secondary">Truncated to 4 items (shows first + last 3):</Text>
        <Breadcrumb items={longPathItems} maxItems={4} />

        <Text size="small" color="secondary">Truncated to 3 items (shows first + last 2):</Text>
        <Breadcrumb items={longPathItems} maxItems={3} />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">With Disabled Items</Text>

        <Breadcrumb
          items={[
            { label: 'Home', onPress: () => console.log('Home') },
            { label: 'Disabled Level', onPress: () => console.log('Disabled'), disabled: true },
            { label: 'Active Level', onPress: () => console.log('Active') },
            { label: 'Current Page' },
          ]}
        />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Non-clickable Items</Text>

        <Breadcrumb
          items={[
            { label: 'Home' },
            { label: 'Products' },
            { label: 'Category' },
            { label: 'Item' },
          ]}
        />
        <Text size="small" color="secondary">None of these items are clickable</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Mixed Clickable & Non-clickable</Text>

        <Breadcrumb
          items={[
            { label: 'Home', onPress: () => console.log('Home') },
            { label: 'Static Section' },
            { label: 'Products', onPress: () => console.log('Products') },
            { label: 'Current Product' },
          ]}
        />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">File System Example</Text>

        <Breadcrumb
          items={[
            {
              label: 'Root',
              icon: <Icon name="harddisk" size="sm" />,
              onPress: () => console.log('Root'),
            },
            {
              label: 'Users',
              icon: <Icon name="account-group" size="sm" />,
              onPress: () => console.log('Users'),
            },
            {
              label: 'Documents',
              icon: <Icon name="folder" size="sm" />,
              onPress: () => console.log('Documents'),
            },
            {
              label: 'project-files',
              icon: <Icon name="folder-open" size="sm" />,
              onPress: () => console.log('project-files'),
            },
            {
              label: 'index.tsx',
              icon: <Icon name="file-document" size="sm" />,
            },
          ]}
          separator="/"
        />

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">E-commerce Example</Text>

        <Breadcrumb
          items={[
            { label: 'Shop', onPress: () => console.log('Shop') },
            { label: 'Electronics', onPress: () => console.log('Electronics') },
            { label: 'Computers', onPress: () => console.log('Computers') },
            { label: 'Laptops', onPress: () => console.log('Laptops') },
            { label: 'Gaming Laptops' },
          ]}
          size="small"
        />
      </View>
    </Screen>
  );
};
