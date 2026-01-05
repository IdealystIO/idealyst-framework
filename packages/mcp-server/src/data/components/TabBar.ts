export const TabBar = {
  category: "navigation",
  description: "Tab bar navigation component with icons, layout options, and spacing variants for switching between views or sections",
      props: `
- \`items\`: TabBarItem[] - Array of tab items to display
  - \`value\`: string - Unique identifier for the tab
  - \`label\`: string - Display text for the tab
  - \`icon\`: ReactNode | ((props: { active: boolean; size: number }) => ReactNode) - Optional icon
  - \`disabled\`: boolean - Whether the tab is disabled
- \`value\`: string - The currently selected tab value (controlled)
- \`defaultValue\`: string - The default selected tab for uncontrolled usage
- \`onChange\`: function - Called when the selected tab changes
- \`type\`: 'standard' | 'pills' | 'underline' - The visual style variant
- \`size\`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' - The size variant of the tabs
- \`iconPosition\`: 'left' | 'top' - Position of icon relative to label (default: 'left')
- \`justify\`: 'start' | 'center' | 'equal' | 'space-between' - Layout justification (default: 'start')
- \`pillMode\`: 'light' | 'dark' - Mode for pills variant
- \`gap\`: Size - Space between tabs
- \`padding\`: Size - Padding on all sides
- \`paddingVertical\`: Size - Top and bottom padding
- \`paddingHorizontal\`: Size - Left and right padding
- \`margin\`: Size - Margin on all sides
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
`,
  features: [
    "Three visual variants (standard, pills, underline)",
    "Icon support with render function for active state",
    "Icon position: left (horizontal) or top (stacked)",
    "Layout justification: start, center, equal, space-between",
    "Controlled and uncontrolled modes",
    "Five sizes (xs, sm, md, lg, xl)",
    "Gap, padding, and margin variants",
    "Disabled tabs",
  ],
  bestPractices: [
    "Use 'underline' variant for page-level navigation",
    "Use 'pills' variant for contained sections",
    "Use justify='equal' with iconPosition='top' for bottom navigation style",
    "Use icon render function to change color based on active state",
    "Keep tab labels short (1-2 words)",
    "Use 3-5 tabs for optimal UX",
    "Disable tabs when content is unavailable",
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

<View gap="md">
  <TabBar items={items} type="standard" />
  <TabBar items={items} type="pills" />
  <TabBar items={items} type="underline" />
</View>`,

    "with-icons": `import { TabBar, View, Icon } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [tab, setTab] = useState('home');

  const items = [
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
  ];

  return (
    <View gap="md">
      {/* Icons on left (default) */}
      <TabBar items={items} value={tab} onChange={setTab} iconPosition="left" />

      {/* Icons on top (stacked) */}
      <TabBar items={items} value={tab} onChange={setTab} iconPosition="top" />
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
    <View gap="md">
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

    justify: `import { TabBar, View, Text } from '@idealyst/components';

const items = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

<View gap="md">
  {/* Left aligned (default) */}
  <Text typography="caption">justify="start"</Text>
  <TabBar items={items} justify="start" />

  {/* Centered */}
  <Text typography="caption">justify="center"</Text>
  <TabBar items={items} justify="center" />

  {/* Full width, equal sized tabs */}
  <Text typography="caption">justify="equal"</Text>
  <TabBar items={items} justify="equal" />

  {/* Space between tabs */}
  <Text typography="caption">justify="space-between"</Text>
  <TabBar items={items} justify="space-between" />
</View>`,

    "bottom-nav": `import { TabBar, Icon } from '@idealyst/components';
import { useState } from 'react';

// Bottom navigation style: full width with stacked icons
function BottomNav() {
  const [tab, setTab] = useState('home');

  const items = [
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
      value: 'notifications',
      label: 'Alerts',
      icon: ({ active, size }) => (
        <Icon name="bell" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: ({ active, size }) => (
        <Icon name="account" size={size} color={active ? 'primary' : 'secondary'} />
      ),
    },
  ];

  return (
    <TabBar
      items={items}
      value={tab}
      onChange={setTab}
      justify="equal"
      iconPosition="top"
    />
  );
}`,
  },
};
