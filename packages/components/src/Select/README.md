# Select Component

A cross-platform Select component for choosing from a list of options.

## Features

- **Cross-platform**: Works on both web and React Native
- **iOS ActionSheet support**: Native presentation mode on iOS
- **Searchable**: Optional search/filter functionality
- **Keyboard navigation**: Full keyboard support on web
- **Customizable styling**: Variants, intents, and sizes
- **Accessibility**: Proper ARIA attributes and screen reader support

## Basic Usage

```tsx
import { Select } from '@idealyst/components';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Select
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Choose a fruit"
    />
  );
}
```

## With Icons

```tsx
const options = [
  {
    value: 'user',
    label: 'User Profile',
    icon: <Icon name="user" />
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: <Icon name="settings" />
  },
];

<Select
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Choose an option"
/>
```

## Searchable Select

```tsx
<Select
  options={largeOptionsList}
  value={value}
  onValueChange={setValue}
  searchable
  placeholder="Search and select..."
/>
```

## iOS ActionSheet (Native only)

```tsx
<Select
  options={options}
  value={value}
  onValueChange={setValue}
  presentationMode="actionSheet" // iOS only
  label="Choose an option"
/>
```

## Form Integration

```tsx
<View spacing="md">
  <Select
    label="Country"
    options={countryOptions}
    value={country}
    onValueChange={setCountry}
    error={!!errors.country}
    helperText={errors.country || "Select your country"}
    variant="outlined"
    intent="primary"
  />
</View>
```

## API Reference

### SelectProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | - | Array of options to display |
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Called when selection changes |
| `placeholder` | `string` | `"Select an option"` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `error` | `boolean` | `false` | Whether to show error state |
| `helperText` | `string` | - | Helper text below select |
| `label` | `string` | - | Label text above select |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant |
| `intent` | `IntentVariant` | `'neutral'` | Color scheme |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size |
| `searchable` | `boolean` | `false` | Enable search functionality |
| `filterOption` | `(option, searchTerm) => boolean` | - | Custom filter function |
| `presentationMode` | `'dropdown' \| 'actionSheet'` | `'dropdown'` | Native presentation mode (iOS) |
| `maxHeight` | `number` | `240` | Max height for dropdown |

### SelectOption

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Unique value for the option |
| `label` | `string` | Display label |
| `disabled` | `boolean` | Whether option is disabled |
| `icon` | `ReactNode` | Optional icon or custom content |

## Platform Differences

### Web
- Uses a custom dropdown overlay
- Full keyboard navigation support
- Hover effects and focus states
- Searchable with text input

### React Native
- Modal-based dropdown by default
- iOS ActionSheet support via `presentationMode="actionSheet"`
- Touch-optimized interactions
- Native keyboard handling

## Styling

The Select component uses Unistyles v3 for cross-platform styling with support for:

- Variants (`outlined`, `filled`)
- Intents (`primary`, `neutral`, `success`, `error`, `warning`, `info`)
- Sizes (`small`, `medium`, `large`)
- Error states
- Disabled states
- Focus states

## Accessibility

- Proper ARIA roles and attributes
- Keyboard navigation (web)
- Screen reader support
- Focus management
- Touch target sizing (44px minimum)