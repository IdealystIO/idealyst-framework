export const Tabs = {
  category: "navigation",
  description: "Tabs component with content panels for organizing information into tabbed sections",
  props: `
Tab Props:
- \`value\`: string - Unique tab identifier
- \`label\`: string - Tab label text
- \`disabled\`: boolean - Whether tab is disabled
- \`children\`: ReactNode - Tab panel content

Tabs Props:
- \`value\`: string - Currently active tab value
- \`defaultValue\`: string - Default tab (uncontrolled)
- \`onChange\`: (value: string) => void - Tab change handler
- \`variant\`: 'default' | 'pills' | 'underline' - Visual style
- \`size\`: 'small' | 'medium' | 'large' - Tab size
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`style\`: ViewStyle - Additional styles
- \`testID\`: string - Test identifier
- \`children\`: ReactNode - Tab components
`,
  features: [
    "Integrated tab navigation and content panels",
    "Three visual variants",
    "Controlled and uncontrolled modes",
    "Three sizes",
    "Five intent colors",
    "Disabled tabs",
    "Automatic content switching",
  ],
  bestPractices: [
    "Use Tabs for content that belongs together",
    "Use TabBar for navigation without content management",
    "Keep 3-5 tabs for optimal UX",
    "Lazy load tab content if heavy",
    "Use descriptive tab labels",
    "Consider vertical tabs for many options",
  ],
  usage: `
import { Tabs, Tab, Text } from '@idealyst/components';

<Tabs defaultValue="tab1" variant="underline">
  <Tab value="tab1" label="Overview">
    <Text>Overview content</Text>
  </Tab>
  <Tab value="tab2" label="Details">
    <Text>Details content</Text>
  </Tab>
  <Tab value="tab3" label="Settings">
    <Text>Settings content</Text>
  </Tab>
</Tabs>
`,
  examples: {
    basic: `import { Tabs, Tab, Text } from '@idealyst/components';

<Tabs defaultValue="1">
  <Tab value="1" label="First">
    <Text>First tab content</Text>
  </Tab>
  <Tab value="2" label="Second">
    <Text>Second tab content</Text>
  </Tab>
</Tabs>`,

    variants: `import { Tabs, Tab, View, Text } from '@idealyst/components';

<View spacing="lg">
  <Tabs defaultValue="a" variant="default">
    <Tab value="a" label="Default"><Text>Content A</Text></Tab>
    <Tab value="b" label="Style"><Text>Content B</Text></Tab>
  </Tabs>

  <Tabs defaultValue="a" variant="pills">
    <Tab value="a" label="Pills"><Text>Content A</Text></Tab>
    <Tab value="b" label="Style"><Text>Content B</Text></Tab>
  </Tabs>

  <Tabs defaultValue="a" variant="underline">
    <Tab value="a" label="Underline"><Text>Content A</Text></Tab>
    <Tab value="b" label="Style"><Text>Content B</Text></Tab>
  </Tabs>
</View>`,

    "with-icons": `import { Tabs, Tab, View, Text, Card } from '@idealyst/components';

<Tabs defaultValue="profile" variant="pills" intent="primary">
  <Tab value="profile" label="Profile">
    <Card padding="medium">
      <View spacing="md">
        <Text weight="bold">Profile Settings</Text>
        <Text>Update your profile information</Text>
      </View>
    </Card>
  </Tab>
  <Tab value="security" label="Security">
    <Card padding="medium">
      <View spacing="md">
        <Text weight="bold">Security Settings</Text>
        <Text>Manage your security preferences</Text>
      </View>
    </Card>
  </Tab>
</Tabs>`,

    interactive: `import { Tabs, Tab, View, Text, Input, Button } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
      <Tab value="account" label="Account">
        <View spacing="md" style={{ padding: 16 }}>
          <Text weight="bold">Account Information</Text>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
          <Button intent="primary">Save Changes</Button>
        </View>
      </Tab>

      <Tab value="privacy" label="Privacy">
        <View spacing="md" style={{ padding: 16 }}>
          <Text weight="bold">Privacy Settings</Text>
          <Text>Manage your privacy preferences here</Text>
        </View>
      </Tab>

      <Tab value="notifications" label="Notifications">
        <View spacing="md" style={{ padding: 16 }}>
          <Text weight="bold">Notification Preferences</Text>
          <Text>Configure how you receive notifications</Text>
        </View>
      </Tab>
    </Tabs>
  );
}`,
  },
};
