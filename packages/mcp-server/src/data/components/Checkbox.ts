export const Checkbox = {
  category: "form",
  description: "Form checkbox for boolean selection with label and validation support",
  props: `
- \`checked\`: boolean - Whether the checkbox is checked
- \`indeterminate\`: boolean - Whether the checkbox is in an indeterminate state
- \`disabled\`: boolean - Whether the checkbox is disabled
- \`onCheckedChange\`: (checked: boolean) => void - Called when checkbox state changes
- \`size\`: 'sm' | 'md' | 'lg' - Checkbox size
- \`intent\`: Intent - Color scheme
- \`variant\`: 'default' | 'outlined' - Visual style
- \`label\`: string - Label text to display next to checkbox
- \`children\`: ReactNode - Custom label content
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
- \`accessibilityLabel\`: string - Accessibility label
- \`required\`: boolean - Whether the checkbox is required
- \`error\`: string - Error message to display
- \`helperText\`: string - Helper text to display
`,
  features: [
    "Checked, unchecked, and indeterminate states",
    "Label support (string or custom ReactNode)",
    "Three sizes",
    "Intent-based colors",
    "Error and helper text",
    "Required field support",
    "Accessible with proper ARIA attributes",
  ],
  bestPractices: [
    "Always provide a label for accessibility",
    "Use indeterminate state for parent checkboxes with partial children selection",
    "Show error messages inline",
    "Use helperText to clarify checkbox meaning",
    "Group related checkboxes visually",
  ],
  usage: `
import { Checkbox } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      label="Accept terms and conditions"
      required
    />
  );
}
`,
  examples: {
    basic: `import { Checkbox } from '@idealyst/components';

<Checkbox label="Subscribe to newsletter" />`,

    variants: `import { Checkbox, View } from '@idealyst/components';

<View spacing="sm">
  <Checkbox label="Small" size="sm" />
  <Checkbox label="Medium" size="md" />
  <Checkbox label="Large" size="lg" />
</View>`,

    "with-icons": `import { Checkbox, View } from '@idealyst/components';

<View spacing="sm">
  <Checkbox
    label="Enable notifications"
    intent="primary"
    checked
  />
  <Checkbox
    label="Dark mode"
    intent="success"
    checked
  />
</View>`,

    interactive: `import { Checkbox, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [options, setOptions] = useState({
    email: false,
    sms: false,
    push: false,
  });

  return (
    <View spacing="md">
      <Text weight="bold">Notification Preferences</Text>
      <Checkbox
        label="Email notifications"
        checked={options.email}
        onCheckedChange={(checked) =>
          setOptions({ ...options, email: checked })
        }
      />
      <Checkbox
        label="SMS notifications"
        checked={options.sms}
        onCheckedChange={(checked) =>
          setOptions({ ...options, sms: checked })
        }
      />
      <Checkbox
        label="Push notifications"
        checked={options.push}
        onCheckedChange={(checked) =>
          setOptions({ ...options, push: checked })
        }
      />
    </View>
  );
}`,
  },
};
