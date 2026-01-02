export const Checkbox = {
  category: "form",
  description: "Form checkbox with margin variants for boolean selection, label, and validation support",
      props: `
- \`checked\`: boolean - Whether the checkbox is checked
- \`indeterminate\`: boolean - Whether the checkbox is in an indeterminate state
- \`disabled\`: boolean - Whether the checkbox is disabled
- \`onCheckedChange\`: function - Called when the checkbox state changes
- \`size\`: CheckboxSizeVariant - The size of the checkbox
- \`intent\`: CheckboxIntentVariant - The intent/color scheme of the checkbox
- \`variant\`: CheckboxVariant - The visual style variant of the checkbox
- \`label\`: string - Label text to display next to the checkbox
- \`children\`: React.ReactNode - Custom label content (ReactNode)
- \`required\`: boolean - Whether the checkbox is required
- \`error\`: string - Error message to display
- \`helperText\`: string - Helper text to display
- \`margin\`: Size - Margin on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
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
