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
    <View spacing="lg">
      <Text size="xlarge" weight="bold">TabBar Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic TabBar</Text>
        <TabBar
          items={basicTabs}
          value={activeTab}
          onChange={setActiveTab}
        />
        <Text size="small" color="secondary">
          Active tab: {activeTab}
        </Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Variants</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="small" weight="medium">Default</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              variant="default"
            />
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Pills</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              variant="pills"
              pillMode="light"
            />
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Underline</Text>
            <TabBar
              items={variantTabs}
              value={variantTab}
              onChange={setVariantTab}
              variant="underline"
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="small"
          />
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="medium"
          />
          <TabBar
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="large"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Pill Modes</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="small" weight="medium">Light Mode (dark pill on light background)</Text>
            <TabBar
              items={basicTabs}
              value={pillTab}
              onChange={setPillTab}
              variant="pills"
              pillMode="light"
            />
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Dark Mode (light pill on dark background)</Text>
            <TabBar
              items={basicTabs}
              value={pillTab}
              onChange={setPillTab}
              variant="pills"
              pillMode="dark"
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled Tabs</Text>
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
