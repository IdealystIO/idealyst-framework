import React, { useState } from 'react';
import { Screen, View, Text } from '@idealyst/components';
import TabBar from '../TabBar';
import type { TabBarItem } from '../TabBar/types';

export const TabBarExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [variantTab, setVariantTab] = useState('home');
  const [pillTab, setPillTab] = useState('tab1');

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
    </View>
    </Screen>
  );
};

export default TabBarExamples;
