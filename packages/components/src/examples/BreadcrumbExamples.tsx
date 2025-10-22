import React from 'react';
import { Screen, View , Text, Breadcrumb, Divider, Icon, BreadcrumbItem } from '../index';

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
    <Screen background="primary" safeArea padding="lg">
      <View spacing="xl" style={{ maxWidth: 800, width: '100%', marginHorizontal: 'auto' }}>
        <Text size="xl" weight="bold">Breadcrumb Examples</Text>

        <View spacing="md">
          <Text size="lg" weight="semibold">Basic Breadcrumb</Text>
          <Breadcrumb items={basicItems} />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">With Icons (Components)</Text>
          <Breadcrumb items={withIconsItems} />
          <Text size="sm" color="secondary">Using Icon components</Text>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">With Icons (Icon Names)</Text>
          <Breadcrumb items={withIconNamesItems} />
          <Text size="sm" color="secondary">Using icon name strings (recommended)</Text>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Custom Separator</Text>
          <View spacing="sm">
            <Breadcrumb items={basicItems} separator=">" />
            <Breadcrumb items={basicItems} separator="•" />
            <Breadcrumb items={basicItems} separator={<Icon name="chevron-right" size="sm" />} />
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Sizes</Text>
          <View spacing="sm">
            <View spacing="xs">
              <Text size="md" weight="semibold">Small</Text>
              <Breadcrumb items={basicItems} size="sm" />
            </View>
            <View spacing="xs">
              <Text size="md" weight="semibold">Medium (Default)</Text>
              <Breadcrumb items={basicItems} size="md" />
            </View>
            <View spacing="xs">
              <Text size="md" weight="semibold">Large</Text>
              <Breadcrumb items={basicItems} size="lg" />
            </View>
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Intent Colors</Text>
          <View spacing="sm">
            <View spacing="xs">
              <Text size="md" weight="semibold">Primary (Default)</Text>
              <Breadcrumb items={basicItems} intent="primary" />
            </View>
            <View spacing="xs">
              <Text size="md" weight="semibold">Neutral</Text>
              <Breadcrumb items={basicItems} intent="neutral" />
            </View>
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Truncation</Text>
          <View spacing="sm">
            <View spacing="xs">
              <Text size="sm" color="secondary">Full path (7 items):</Text>
              <Breadcrumb items={longPathItems} />
            </View>
            <View spacing="xs">
              <Text size="sm" color="secondary">Truncated to 4 items (shows first + last 3):</Text>
              <Breadcrumb items={longPathItems} maxItems={4} />
            </View>
            <View spacing="xs">
              <Text size="sm" color="secondary">Truncated to 3 items (shows first + last 2):</Text>
              <Breadcrumb items={longPathItems} maxItems={3} />
            </View>
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">With Disabled Items</Text>
          <Breadcrumb
            items={[
              { label: 'Home', onPress: () => console.log('Home') },
              { label: 'Disabled Level', onPress: () => console.log('Disabled'), disabled: true },
              { label: 'Active Level', onPress: () => console.log('Active') },
              { label: 'Current Page' },
            ]}
          />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Non-clickable Items</Text>
          <Breadcrumb
            items={[
              { label: 'Home' },
              { label: 'Products' },
              { label: 'Category' },
              { label: 'Item' },
            ]}
          />
          <Text size="sm" color="secondary">None of these items are clickable</Text>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Mixed Clickable & Non-clickable</Text>
          <Breadcrumb
            items={[
              { label: 'Home', onPress: () => console.log('Home') },
              { label: 'Static Section' },
              { label: 'Products', onPress: () => console.log('Products') },
              { label: 'Current Product' },
            ]}
          />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">File System Example</Text>
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
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">E-commerce Example</Text>
          <Breadcrumb
            items={[
              { label: 'Shop', onPress: () => console.log('Shop') },
              { label: 'Electronics', onPress: () => console.log('Electronics') },
              { label: 'Computers', onPress: () => console.log('Computers') },
              { label: 'Laptops', onPress: () => console.log('Laptops') },
              { label: 'Gaming Laptops' },
            ]}
            size="sm"
          />
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Responsive Breadcrumbs</Text>
          <Text size="sm" color="secondary">
            Automatically collapses middle items into a dropdown menu on narrow screens
          </Text>
          <View spacing="sm">
            <View spacing="xs">
              <Text size="md" weight="semibold">Default (minVisibleItems: 3)</Text>
              <Text size="sm" color="secondary">Shows first item + dropdown + last item</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
              />
            </View>
            <View spacing="xs">
              <Text size="md" weight="semibold">More Visible Items (minVisibleItems: 4)</Text>
              <Text size="sm" color="secondary">Shows first item + dropdown + last 2 items</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
                minVisibleItems={4}
              />
            </View>
            <View spacing="xs">
              <Text size="md" weight="semibold">Fewer Items (minVisibleItems: 2)</Text>
              <Text size="sm" color="secondary">Shows first item + dropdown (all items collapsed)</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
                minVisibleItems={2}
              />
            </View>
          </View>
        </View>

        <View spacing="md">
          <Text size="lg" weight="semibold">Responsive with Icons</Text>
          <Breadcrumb
            items={[
              {
                label: 'Root',
                icon: 'harddisk',
                onPress: () => console.log('Root'),
              },
              {
                label: 'Users',
                icon: 'account-group',
                onPress: () => console.log('Users'),
              },
              {
                label: 'Documents',
                icon: 'folder',
                onPress: () => console.log('Documents'),
              },
              {
                label: 'Projects',
                icon: 'folder',
                onPress: () => console.log('Projects'),
              },
              {
                label: 'Work',
                icon: 'folder',
                onPress: () => console.log('Work'),
              },
              {
                label: 'project-files',
                icon: 'folder-open',
                onPress: () => console.log('project-files'),
              },
              {
                label: 'index.tsx',
                icon: 'file-document',
              },
            ]}
            responsive
            separator="/"
          />
        </View>
      </View>
    </Screen>
  );
};
