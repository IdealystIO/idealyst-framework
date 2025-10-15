import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import Tabs, { Tab } from '../Tabs';

export const TabsExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [variantTab, setVariantTab] = useState('home');
  const [intentTab, setIntentTab] = useState('tab1');

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Tabs Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Tabs</Text>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="tab1" label="Tab 1" />
          <Tab value="tab2" label="Tab 2" />
          <Tab value="tab3" label="Tab 3" />
        </Tabs>
        <Text size="small" color="secondary">
          Active tab: {activeTab}
        </Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Variants</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="small" weight="medium">Default</Text>
            <Tabs value={variantTab} onChange={setVariantTab} variant="default">
              <Tab value="home" label="Home" />
              <Tab value="search" label="Search" />
              <Tab value="settings" label="Settings" />
            </Tabs>
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Pills</Text>
            <Tabs value={variantTab} onChange={setVariantTab} variant="pills">
              <Tab value="home" label="Home" />
              <Tab value="search" label="Search" />
              <Tab value="settings" label="Settings" />
            </Tabs>
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Underline</Text>
            <Tabs value={variantTab} onChange={setVariantTab} variant="underline">
              <Tab value="home" label="Home" />
              <Tab value="search" label="Search" />
              <Tab value="settings" label="Settings" />
            </Tabs>
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <Tabs value={activeTab} onChange={setActiveTab} size="small">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={activeTab} onChange={setActiveTab} size="medium">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={activeTab} onChange={setActiveTab} size="large">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <View spacing="sm">
          <Tabs value={intentTab} onChange={setIntentTab} intent="primary" variant="pills">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={intentTab} onChange={setIntentTab} intent="success" variant="pills">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={intentTab} onChange={setIntentTab} intent="warning" variant="pills">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={intentTab} onChange={setIntentTab} intent="error" variant="pills">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={intentTab} onChange={setIntentTab} intent="neutral" variant="pills">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled Tabs</Text>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="tab1" label="Enabled" />
          <Tab value="tab2" label="Disabled" disabled />
          <Tab value="tab3" label="Enabled" />
        </Tabs>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent with Underline</Text>
        <View spacing="sm">
          <Tabs value={activeTab} onChange={setActiveTab} intent="primary" variant="underline">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={activeTab} onChange={setActiveTab} intent="success" variant="underline">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
          <Tabs value={activeTab} onChange={setActiveTab} intent="error" variant="underline">
            <Tab value="tab1" label="Tab 1" />
            <Tab value="tab2" label="Tab 2" />
            <Tab value="tab3" label="Tab 3" />
          </Tabs>
        </View>
      </View>
    </View>
  );
};

export default TabsExamples;
