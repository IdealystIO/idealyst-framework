import React, { useState } from 'react';
import { Screen, View, Text, Icon } from '@idealyst/components';
import TabBar from '../TabBar';
import type { TabBarItem } from '../TabBar/types';

export const TabBarExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [variantTab, setVariantTab] = useState('home');
  const [pillTab, setPillTab] = useState('tab1');
  const [iconTab, setIconTab] = useState('home');
  const [justifyTab, setJustifyTab] = useState('tab1');

  const basicTabs: TabBarItem[] = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  const variantTabs: TabBarItem[] = [
    { value: 'home', label: 'Home' },
    { value: 'search', label: 'Search' },
    { value: 'settings', label: 'Settings' },
  ];

  const disabledTabs: TabBarItem[] = [
    { value: 'tab1', label: 'Enabled' },
    { value: 'tab2', label: 'Disabled', disabled: true },
    { value: 'tab3', label: 'Enabled' },
  ];

  // Tabs with icons using render function
  const iconTabs: TabBarItem[] = [
    {
      value: 'home',
      label: 'Home',
      icon: ({ active, size }) => (
        <Icon name="home" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
    {
      value: 'search',
      label: 'Search',
      icon: ({ active, size }) => (
        <Icon name="magnify" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: ({ active, size }) => (
        <Icon name="account" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: ({ active, size }) => (
        <Icon name="cog" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
  ];

  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">TabBar Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic TabBar</Text>
        <TabBar
          items={basicTabs}
          value={activeTab}
          onChange={setActiveTab}
        />
        <Text typography="caption" color="secondary">
          Active tab: {activeTab}
        </Text>
      </View>

      <View gap="md">
        <Text typography="h5">Variants</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Standard</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              type="standard"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Pills</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              type="pills"
              pillMode="light"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Underline</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              type="underline"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="sm"
          />
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="md"
          />
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="lg"
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Pill Modes</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Light Mode (dark pill on light background)</Text>
            <TabBar
              items={basicTabs}
              value={pillTab}
              onChange={setPillTab}
              type="pills"
              pillMode="light"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Dark Mode (light pill on dark background)</Text>
            <TabBar
              items={basicTabs}
              value={pillTab}
              onChange={setPillTab}
              type="pills"
              pillMode="dark"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Disabled Tabs</Text>
        <TabBar
          items={disabledTabs}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <View gap="md">
        <Text typography="h5">With Icons</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Icons Left (default)</Text>
            <TabBar
              items={iconTabs}
              value={iconTab}
              onChange={setIconTab}
              iconPosition="left"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Icons Top (stacked)</Text>
            <TabBar
              items={iconTabs}
              value={iconTab}
              onChange={setIconTab}
              iconPosition="top"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Pills with Icons</Text>
            <TabBar
              items={iconTabs}
              value={iconTab}
              onChange={setIconTab}
              type="pills"
              iconPosition="left"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Layout Justification</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Start (default)</Text>
            <TabBar
              items={basicTabs}
              value={justifyTab}
              onChange={setJustifyTab}
              justify="start"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Center</Text>
            <TabBar
              items={basicTabs}
              value={justifyTab}
              onChange={setJustifyTab}
              justify="center"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Equal (full width, equal tabs)</Text>
            <TabBar
              items={basicTabs}
              value={justifyTab}
              onChange={setJustifyTab}
              justify="equal"
            />
          </View>
          <View gap="xs">
            <Text typography="body2">Space Between</Text>
            <TabBar
              items={basicTabs}
              value={justifyTab}
              onChange={setJustifyTab}
              justify="space-between"
            />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Full Width with Icons</Text>
        <TabBar
          items={iconTabs}
          value={iconTab}
          onChange={setIconTab}
          justify="equal"
          iconPosition="top"
        />
      </View>
    </View>
    </Screen>
  );
};

export default TabBarExamples;
