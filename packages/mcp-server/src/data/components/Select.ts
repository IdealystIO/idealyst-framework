export const Select = {
  category: "form",
  description: "Dropdown select component with margin variants for choosing from a list of options",
      props: `
- \`options\`: SelectOption[] - Array of options to display in the select
- \`value\`: string - The currently selected value
- \`onValueChange\`: function - Called when the selected value changes
- \`placeholder\`: string - Placeholder text when no value is selected
- \`disabled\`: boolean - Whether the select is disabled
- \`error\`: boolean - Whether the select shows an error state
- \`helperText\`: string - Helper text to display below the select
- \`label\`: string - Label text to display above the select
- \`intent\`: SelectIntentVariant - The visual type of the select The intent/color scheme of the select
- \`size\`: SelectSizeVariant - The size of the select
- \`margin\`: Size - Margin on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
- \`searchable\`: boolean - Whether to show a search/filter input (web only)
- \`filterOption\`: (option: SelectOption, searchTerm: string) => boolean - Custom search filter function (used with searchable)
- \`presentationMode\`: 'dropdown' | 'actionSheet' - Native iOS presentation mode (native only)
- \`maxHeight\`: number - Maximum height for the dropdown content
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
  <Select options={options} type="outlined" size="sm" />
  <Select options={options} type="filled" size="md" />
  <Select options={options} type="outlined" size="lg" />
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
