import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import Tabs from '../Tabs';
import type { TabItem } from '../Tabs/types';

export const TabsExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [variantTab, setVariantTab] = useState('home');

  const basicTabs: TabItem[] = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];

  const iconTabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const disabledTabs: TabItem[] = [
    { id: 'enabled1', label: 'Enabled' },
    { id: 'disabled', label: 'Disabled', disabled: true },
    { id: 'enabled2', label: 'Enabled' },
  ];

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Tabs Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Tabs</Text>
        <Tabs
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
            <Tabs
              items={iconTabs}
              value={variantTab}
              onChange={setVariantTab}
              variant="default"
            />
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Pills</Text>
            <Tabs
              items={iconTabs}
              value={variantTab}
              onChange={setVariantTab}
              variant="pills"
            />
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Underline</Text>
            <Tabs
              items={iconTabs}
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
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="small"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="medium"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            size="large"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <View spacing="sm">
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="primary"
            variant="pills"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="success"
            variant="pills"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="warning"
            variant="pills"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="error"
            variant="pills"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="neutral"
            variant="pills"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Icons</Text>
        <Tabs
          items={iconTabs}
          value={variantTab}
          onChange={setVariantTab}
          variant="pills"
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled Tabs</Text>
        <Tabs
          items={disabledTabs}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent with Underline</Text>
        <View spacing="sm">
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="primary"
            variant="underline"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="success"
            variant="underline"
          />
          <Tabs
            items={basicTabs}
            value={activeTab}
            onChange={setActiveTab}
            intent="error"
            variant="underline"
          />
        </View>
      </View>
    </View>
  );
};

export default TabsExamples;
