export const Select = {
  category: "form",
  description: "Dropdown select component for choosing from a list of options",
  props: `
- \`options\`: SelectOption[] - Array of select options
  - \`value\`: string - Unique value
  - \`label\`: string - Display label
  - \`disabled\`: boolean - Whether disabled
  - \`icon\`: ReactNode - Optional icon
- \`value\`: string - Currently selected value
- \`onValueChange\`: (value: string) => void - Selection change handler
- \`placeholder\`: string - Placeholder text when no value
- \`disabled\`: boolean - Whether the select is disabled
- \`error\`: boolean - Whether to show error state
- \`helperText\`: string - Helper text below select
- \`label\`: string - Label text above select
- \`variant\`: 'outlined' | 'filled' - Visual style
- \`intent\`: IntentVariant - Color scheme
- \`size\`: 'small' | 'medium' | 'large' - Select size
- \`searchable\`: boolean - Enable search/filter (web only)
- \`filterOption\`: (option, searchTerm) => boolean - Custom filter function
- \`presentationMode\`: 'dropdown' | 'actionSheet' - iOS presentation (native only)
- \`maxHeight\`: number - Maximum height for dropdown
- \`style\`: any - Additional styles
- \`testID\`: string - Test identifier
- \`accessibilityLabel\`: string - Accessibility label
`,
  features: [
    "Single selection from options",
    "Searchable dropdown (web)",
    "Icon support for options",
    "Two visual variants",
    "Label and helper text",
    "Error state",
    "Disabled options",
    "Custom filtering",
    "Platform-specific presentation modes",
  ],
  bestPractices: [
    "Use for 5+ options (use RadioGroup for fewer)",
    "Enable searchable for long option lists",
    "Provide clear placeholder text",
    "Group related options visually",
    "Show error states inline with helperText",
    "Consider icons for visual categorization",
  ],
  usage: `
import { Select } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [value, setValue] = useState('');

  const options = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  return (
    <Select
      label="Country"
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select a country"
    />
  );
}
`,
  examples: {
    basic: `import { Select } from '@idealyst/components';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

<Select options={options} placeholder="Choose..." />`,

    variants: `import { Select, View } from '@idealyst/components';

const options = [{ value: '1', label: 'Option' }];

<View spacing="md">
  <Select options={options} variant="outlined" size="small" />
  <Select options={options} variant="filled" size="medium" />
  <Select options={options} variant="outlined" size="large" />
</View>`,

    "with-icons": `import { Select } from '@idealyst/components';

const options = [
  { value: 'light', label: 'Light Mode', icon: <Icon name="white-balance-sunny" /> },
  { value: 'dark', label: 'Dark Mode', icon: <Icon name="weather-night" /> },
  { value: 'auto', label: 'Auto', icon: <Icon name="brightness-auto" /> },
];

<Select
  label="Theme"
  options={options}
  value={theme}
  onValueChange={setTheme}
/>`,

    interactive: `import { Select, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const handleChange = (value: string) => {
    setCountry(value);
    setError('');
  };

  const handleSubmit = () => {
    if (!country) {
      setError('Please select a country');
    }
  };

  return (
    <View spacing="md">
      <Select
        label="Country"
        options={countries}
        value={country}
        onValueChange={handleChange}
        placeholder="Select your country"
        error={!!error}
        helperText={error || 'Choose your country of residence'}
        searchable
      />
      <Button onPress={handleSubmit}>Submit</Button>
    </View>
  );
}`,
  },
};
