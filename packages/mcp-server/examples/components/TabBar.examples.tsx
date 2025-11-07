/**
 * TabBar Component Examples
 *
 * These examples are type-checked against the actual TabBarProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { TabBar, View, Text } from '@idealyst/components';
import type { TabBarItem } from '@idealyst/components';

// Example 1: Basic TabBar
export function BasicTabBar() {
  const [value, setValue] = React.useState('home');

  const items: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'profile', label: 'Profile' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <View spacing="md">
      <TabBar items={items} value={value} onChange={setValue} />
      <Text>Selected: {value}</Text>
    </View>
  );
}

// Example 2: TabBar Types
export function TabBarTypes() {
  const [value, setValue] = React.useState('home');

  const items: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'explore', label: 'Explore' },
    { value: 'profile', label: 'Profile' },
  ];

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text weight="semibold">Standard</Text>
        <TabBar type="standard" items={items} value={value} onChange={setValue} />
      </View>
      <View spacing="md">
        <Text weight="semibold">Pills</Text>
        <TabBar type="pills" items={items} value={value} onChange={setValue} />
      </View>
      <View spacing="md">
        <Text weight="semibold">Underline</Text>
        <TabBar type="underline" items={items} value={value} onChange={setValue} />
      </View>
    </View>
  );
}

// Example 3: TabBar Sizes
export function TabBarSizes() {
  const [value, setValue] = React.useState('tab1');

  const items: TabBarItem[] = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  return (
    <View spacing="lg">
      <TabBar size="xs" items={items} value={value} onChange={setValue} />
      <TabBar size="sm" items={items} value={value} onChange={setValue} />
      <TabBar size="md" items={items} value={value} onChange={setValue} />
      <TabBar size="lg" items={items} value={value} onChange={setValue} />
      <TabBar size="xl" items={items} value={value} onChange={setValue} />
    </View>
  );
}

// Example 4: TabBar with Disabled Items
export function TabBarWithDisabledItems() {
  const [value, setValue] = React.useState('home');

  const items: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'explore', label: 'Explore', disabled: true },
    { value: 'profile', label: 'Profile' },
    { value: 'settings', label: 'Settings', disabled: true },
  ];

  return (
    <View spacing="md">
      <TabBar items={items} value={value} onChange={setValue} />
      <Text size="sm" >
        Explore and Settings tabs are disabled
      </Text>
    </View>
  );
}

// Example 5: Pills with Light/Dark Modes
export function TabBarPillModes() {
  const [value, setValue] = React.useState('tab1');

  const items: TabBarItem[] = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text weight="semibold">Light Mode (for light backgrounds)</Text>
        <TabBar
          type="pills"
          pillMode="light"
          items={items}
          value={value}
          onChange={setValue}
        />
      </View>
      <View spacing="md" backgroundColor="gray.800" radius="md">
        <Text weight="semibold" >
          Dark Mode (for dark backgrounds)
        </Text>
        <TabBar
          type="pills"
          pillMode="dark"
          items={items}
          value={value}
          onChange={setValue}
        />
      </View>
    </View>
  );
}

// Example 6: TabBar with Content
export function TabBarWithContent() {
  const [value, setValue] = React.useState('overview');

  const items: TabBarItem[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'details', label: 'Details' },
    { value: 'reviews', label: 'Reviews' },
  ];

  return (
    <View spacing="md">
      <TabBar items={items} value={value} onChange={setValue} />
      <View background="primary" spacing="lg" radius="md">
        {value === 'overview' && (
          <View spacing="sm">
            <Text size="lg" weight="bold">
              Overview
            </Text>
            <Text>This is the overview content section.</Text>
          </View>
        )}
        {value === 'details' && (
          <View spacing="sm">
            <Text size="lg" weight="bold">
              Details
            </Text>
            <Text>This is the details content section.</Text>
          </View>
        )}
        {value === 'reviews' && (
          <View spacing="sm">
            <Text size="lg" weight="bold">
              Reviews
            </Text>
            <Text>This is the reviews content section.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Example 7: TabBar with Default Value
export function TabBarWithDefaultValue() {
  const items: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'messages', label: 'Messages' },
    { value: 'notifications', label: 'Notifications' },
  ];

  return (
    <View spacing="md">
      <TabBar items={items} defaultValue="messages" />
      <Text size="sm" >
        Default value is set to "messages"
      </Text>
    </View>
  );
}

// Example 8: Navigation TabBar
export function NavigationTabBar() {
  const [activeTab, setActiveTab] = React.useState('home');

  const items: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'explore', label: 'Explore' },
    { value: 'create', label: 'Create' },
    { value: 'messages', label: 'Messages' },
    { value: 'profile', label: 'Profile' },
  ];

  return (
    <View spacing="md">
      <TabBar
        type="standard"
        items={items}
        value={activeTab}
        onChange={setActiveTab}
      />
      <View background="primary" spacing="md" radius="md">
        <Text weight="bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Screen</Text>
        <Text size="sm" >
          Content for {activeTab} goes here
        </Text>
      </View>
    </View>
  );
}

// Example 9: Settings TabBar
export function SettingsTabBar() {
  const [section, setSection] = React.useState('general');

  const items: TabBarItem[] = [
    { value: 'general', label: 'General' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'security', label: 'Security' },
    { value: 'notifications', label: 'Notifications' },
  ];

  return (
    <View spacing="lg">
      <View spacing="sm">
        <Text size="xl" weight="bold">
          Settings
        </Text>
        <Text size="sm" >
          Manage your account settings
        </Text>
      </View>
      <TabBar
        type="underline"
        items={items}
        value={section}
        onChange={setSection}
      />
      <View spacing="md">
        <Text weight="semibold" size="lg">
          {section.charAt(0).toUpperCase() + section.slice(1)} Settings
        </Text>
        <Text>Configure your {section} preferences here.</Text>
      </View>
    </View>
  );
}

// Example 10: Dashboard TabBar
export function DashboardTabBar() {
  const [period, setPeriod] = React.useState('day');

  const items: TabBarItem[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text size="xl" weight="bold">
          Analytics Dashboard
        </Text>
        <TabBar
          type="pills"
          size="sm"
          items={items}
          value={period}
          onChange={setPeriod}
        />
      </View>
      <View background="primary" spacing="lg" radius="lg">
        <Text size="lg" weight="semibold">
          Statistics for: {period.charAt(0).toUpperCase() + period.slice(1)}
        </Text>
        <View spacing="sm">
          <Text>• Visitors: 1,234</Text>
          <Text>• Page Views: 5,678</Text>
          <Text>• Conversions: 89</Text>
        </View>
      </View>
    </View>
  );
}

// Example 11: Product Details TabBar
export function ProductDetailsTabBar() {
  const [tab, setTab] = React.useState('description');

  const items: TabBarItem[] = [
    { value: 'description', label: 'Description' },
    { value: 'specs', label: 'Specifications' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'shipping', label: 'Shipping' },
  ];

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text size="xl" weight="bold">
          Product Name
        </Text>
        <Text size="lg" >
          $99.99
        </Text>
      </View>
      <TabBar
        type="underline"
        size="md"
        items={items}
        value={tab}
        onChange={setTab}
      />
      <View spacing="md">
        {tab === 'description' && (
          <Text>
            This is a detailed product description with all the information about the features
            and benefits.
          </Text>
        )}
        {tab === 'specs' && (
          <View spacing="sm">
            <Text>• Weight: 500g</Text>
            <Text>• Dimensions: 10 x 5 x 2 cm</Text>
            <Text>• Material: Aluminum</Text>
          </View>
        )}
        {tab === 'reviews' && (
          <Text>Customer reviews and ratings will be displayed here.</Text>
        )}
        {tab === 'shipping' && (
          <Text>Shipping information and delivery options.</Text>
        )}
      </View>
    </View>
  );
}
