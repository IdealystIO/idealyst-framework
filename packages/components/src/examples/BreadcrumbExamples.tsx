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
      <View gap="xl" style={{ maxWidth: 800, width: '100%', marginHorizontal: 'auto' }}>
        <Text typography="h3">Breadcrumb Examples</Text>

        <View gap="md">
          <Text typography="h5">Basic Breadcrumb</Text>
          <Breadcrumb items={basicItems} />
        </View>

        <View gap="md">
          <Text typography="h5">With Icons (Components)</Text>
          <Breadcrumb items={withIconsItems} />
          <Text typography="caption" color="secondary">Using Icon components</Text>
        </View>

        <View gap="md">
          <Text typography="h5">With Icons (Icon Names)</Text>
          <Breadcrumb items={withIconNamesItems} />
          <Text typography="caption" color="secondary">Using icon name strings (recommended)</Text>
        </View>

        <View gap="md">
          <Text typography="h5">Custom Separator</Text>
          <View gap="sm">
            <Breadcrumb items={basicItems} separator=">" />
            <Breadcrumb items={basicItems} separator="•" />
            <Breadcrumb items={basicItems} separator={<Icon name="chevron-right" size="sm" />} />
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Sizes</Text>
          <View gap="sm">
            <View gap="xs">
              <Text typography="subtitle1">Small</Text>
              <Breadcrumb items={basicItems} size="sm" />
            </View>
            <View gap="xs">
              <Text typography="subtitle1">Medium (Default)</Text>
              <Breadcrumb items={basicItems} size="md" />
            </View>
            <View gap="xs">
              <Text typography="subtitle1">Large</Text>
              <Breadcrumb items={basicItems} size="lg" />
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Intent Colors</Text>
          <View gap="sm">
            <View gap="xs">
              <Text typography="subtitle1">Primary (Default)</Text>
              <Breadcrumb items={basicItems} intent="primary" />
            </View>
            <View gap="xs">
              <Text typography="subtitle1">Neutral</Text>
              <Breadcrumb items={basicItems} intent="neutral" />
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Truncation</Text>
          <View gap="sm">
            <View gap="xs">
              <Text typography="caption" color="secondary">Full path (7 items):</Text>
              <Breadcrumb items={longPathItems} />
            </View>
            <View gap="xs">
              <Text typography="caption" color="secondary">Truncated to 4 items (shows first + last 3):</Text>
              <Breadcrumb items={longPathItems} maxItems={4} />
            </View>
            <View gap="xs">
              <Text typography="caption" color="secondary">Truncated to 3 items (shows first + last 2):</Text>
              <Breadcrumb items={longPathItems} maxItems={3} />
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">With Disabled Items</Text>
          <Breadcrumb
            items={[
              { label: 'Home', onPress: () => console.log('Home') },
              { label: 'Disabled Level', onPress: () => console.log('Disabled'), disabled: true },
              { label: 'Active Level', onPress: () => console.log('Active') },
              { label: 'Current Page' },
            ]}
          />
        </View>

        <View gap="md">
          <Text typography="h5">Non-clickable Items</Text>
          <Breadcrumb
            items={[
              { label: 'Home' },
              { label: 'Products' },
              { label: 'Category' },
              { label: 'Item' },
            ]}
          />
          <Text typography="caption" color="secondary">None of these items are clickable</Text>
        </View>

        <View gap="md">
          <Text typography="h5">Mixed Clickable & Non-clickable</Text>
          <Breadcrumb
            items={[
              { label: 'Home', onPress: () => console.log('Home') },
              { label: 'Static Section' },
              { label: 'Products', onPress: () => console.log('Products') },
              { label: 'Current Product' },
            ]}
          />
        </View>

        <View gap="md">
          <Text typography="h5">File System Example</Text>
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

        <View gap="md">
          <Text typography="h5">E-commerce Example</Text>
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

        <View gap="md">
          <Text typography="h5">Responsive Breadcrumbs</Text>
          <Text typography="caption" color="secondary">
            Automatically collapses middle items into a dropdown menu on narrow screens
          </Text>
          <View gap="sm">
            <View gap="xs">
              <Text typography="subtitle1">Default (minVisibleItems: 3)</Text>
              <Text typography="caption" color="secondary">Shows first item + dropdown + last item</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
              />
            </View>
            <View gap="xs">
              <Text typography="subtitle1">More Visible Items (minVisibleItems: 4)</Text>
              <Text typography="caption" color="secondary">Shows first item + dropdown + last 2 items</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
                minVisibleItems={4}
              />
            </View>
            <View gap="xs">
              <Text typography="subtitle1">Fewer Items (minVisibleItems: 2)</Text>
              <Text typography="caption" color="secondary">Shows first item + dropdown (all items collapsed)</Text>
              <Breadcrumb
                items={longPathItems}
                responsive
                minVisibleItems={2}
              />
            </View>
          </View>
        </View>

        <View gap="md">
          <Text typography="h5">Responsive with Icons</Text>
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
