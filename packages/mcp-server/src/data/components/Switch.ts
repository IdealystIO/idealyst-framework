export const Switch = {
  category: "form",
  description: "Toggle switch for binary on/off states",
      props: `
- \`checked\`: boolean - Whether the switch is in the on/checked state
- \`onCheckedChange\`: function - Called when the switch state changes
- \`disabled\`: boolean - Whether the switch is disabled
- \`label\`: string - Label text to display next to the switch
- \`labelPosition\`: 'left' | 'right' - Position of the label relative to the switch
- \`intent\`: SwitchIntentVariant - The intent/color scheme of the switch
- \`size\`: SwitchSizeVariant - The size variant of the switch
- \`enabledIcon\`: IconName | React.ReactNode - Icon to display when switch is on
- \`disabledIcon\`: IconName | React.ReactNode - Icon to display when switch is off
`,
  features: [
    "Binary on/off toggle",
    "Label with configurable position",
    "Three sizes",
    "Five intent colors",
    "Custom icons for states",
    "Disabled state",
    "Animated transition",
  ],
  bestPractices: [
    "Use for binary settings (on/off, enabled/disabled)",
    "Provide clear labels",
    "Use intent colors to indicate state meaning",
    "Place label on left for form layouts",
    "Use icons sparingly for clarity",
    "Immediate effect - no submit button needed",
  ],
  usage: `
import { Switch } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onCheckedChange={setEnabled}
      label="Enable notifications"
      intent="primary"
    />
  );
}
`,
  examples: {
    basic: `import { Switch } from '@idealyst/components';

<Switch label="Enable feature" />`,

    variants: `import { Switch, View } from '@idealyst/components';

<View spacing="md">
  <Switch label="Small" size="sm" checked />
  <Switch label="Medium" size="md" checked />
  <Switch label="Large" size="lg" checked />
</View>`,

    "with-icons": `import { Switch, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Switch
      checked={darkMode}
      onCheckedChange={setDarkMode}
      label="Dark Mode"
      enabledIcon="weather-night"
      disabledIcon="white-balance-sunny"
      intent="primary"
    />
  );
}`,

    interactive: `import { Switch, View, Text, Card } from '@idealyst/components';
import { useState } from 'react';

function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: true,
    location: false,
    analytics: true,
  });

  const toggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Card type="outlined" padding="md">
      <View spacing="md">
        <Text weight="bold">Privacy Settings</Text>

        <Switch
          checked={settings.notifications}
          onCheckedChange={() => toggle('notifications')}
          label="Push Notifications"
          labelPosition="left"
          intent="primary"
        />

        <Switch
          checked={settings.location}
          onCheckedChange={() => toggle('location')}
          label="Location Services"
          labelPosition="left"
          intent="warning"
        />

        <Switch
          checked={settings.analytics}
          onCheckedChange={() => toggle('analytics')}
          label="Analytics & Data"
          labelPosition="left"
          intent="neutral"
        />
      </View>
    </Card>
  );
}`,
  },
};
