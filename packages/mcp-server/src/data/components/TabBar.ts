export const TabBar = {
  category: "navigation",
  description: "Tab bar navigation component for switching between views or sections",
  props: `
- \`items\`: TabBarItem[] - Array of tab items
  - \`value\`: string - Unique tab value
  - \`label\`: string - Tab label text
  - \`disabled\`: boolean - Whether tab is disabled
- \`value\`: string - Currently active tab value
- \`defaultValue\`: string - Default tab (uncontrolled)
- \`onChange\`: (value: string) => void - Tab change handler
- \`variant\`: 'default' | 'pills' | 'underline' - Visual style
- \`size\`: 'small' | 'medium' | 'large' - Tab size
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`style\`: ViewStyle - Additional styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Three visual variants",
    "Controlled and uncontrolled modes",
    "Three sizes",
    "Five intent colors",
    "Disabled tabs",
    "Simple configuration",
  ],
  bestPractices: [
    "Use 'underline' variant for page-level navigation",
    "Use 'pills' variant for contained sections",
    "Keep tab labels short (1-2 words)",
    "Use 3-5 tabs for optimal UX",
    "Disable tabs when content is unavailable",
    "Preload tab content for smooth transitions",
  ],
  usage: `
import { TabBar } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [activeTab, setActiveTab] = useState('home');

  const items = [
    { value: 'home', label: 'Home' },
    { value: 'profile', label: 'Profile' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <TabBar
      items={items}
      value={activeTab}
      onChange={setActiveTab}
      variant="underline"
    />
  );
}
`,
  examples: {
    basic: `import { TabBar } from '@idealyst/components';

const items = [
  { value: '1', label: 'Tab 1' },
  { value: '2', label: 'Tab 2' },
];

<TabBar items={items} defaultValue="1" />`,

    variants: `import { TabBar, View } from '@idealyst/components';

const items = [
  { value: 'a', label: 'First' },
  { value: 'b', label: 'Second' },
];

<View spacing="md">
  <TabBar items={items} variant="default" />
  <TabBar items={items} variant="pills" />
  <TabBar items={items} variant="underline" />
</View>`,

    "with-icons": `import { TabBar, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [tab, setTab] = useState('overview');

  const items = [
    { value: 'overview', label: 'Overview' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'reports', label: 'Reports' },
  ];

  return (
    <View spacing="md">
      <TabBar
        items={items}
        value={tab}
        onChange={setTab}
        variant="underline"
        intent="primary"
      />
      <Text>{tab} content here</Text>
    </View>
  );
}`,

    interactive: `import { TabBar, View, Text, Card } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [activeTab, setActiveTab] = useState('personal');

  const items = [
    { value: 'personal', label: 'Personal Info' },
    { value: 'security', label: 'Security' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'billing', label: 'Billing', disabled: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <Text>Personal information settings</Text>;
      case 'security':
        return <Text>Security and privacy settings</Text>;
      case 'notifications':
        return <Text>Notification preferences</Text>;
      default:
        return null;
    }
  };

  return (
    <View spacing="md">
      <TabBar
        items={items}
        value={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />
      <Card variant="outlined" padding="medium">
        {renderContent()}
      </Card>
    </View>
  );
}`,
  },
};
