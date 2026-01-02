export const TabBar = {
  category: "navigation",
  description: "Tab bar navigation component with spacing variants for switching between views or sections",
      props: `
- \`items\`: TabBarItem[] - Array of tab items to display
- \`value\`: string - The currently selected tab value (controlled)
- \`defaultValue\`: string - The default selected tab for uncontrolled usage
- \`onChange\`: function - Called when the selected tab changes
- \`type\`: TabBarType - The visual style variant (default, underlined, pills)
- \`size\`: TabBarSizeVariant - The size variant of the tabs
- \`gap\`: Size - Space between tabs ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`padding\`: Size - Padding on all sides
- \`paddingVertical\`: Size - Top and bottom padding
- \`paddingHorizontal\`: Size - Left and right padding
- \`margin\`: Size - Margin on all sides
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
- \`pillMode\`: TabBarPillMode - Mode for pills variant: 'light' for light backgrounds (dark pill), 'dark' for dark backgrounds (light pill)
`,
  features: [
    "Three visual variants",
    "Controlled and uncontrolled modes",
    "Three sizes",
    "Gap, padding, and margin variants",
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
      type="underline"
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
  <TabBar items={items} type="default" />
  <TabBar items={items} type="pills" />
  <TabBar items={items} type="underline" />
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
        type="underline"
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
        type="pills"
      />
      <Card type="outlined" padding="md">
        {renderContent()}
      </Card>
    </View>
  );
}`,
  },
};
