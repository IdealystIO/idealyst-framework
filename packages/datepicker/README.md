# @idealyst/datepicker

Cross-platform date and time picker components for React and React Native.

## Installation

```bash
npm install @idealyst/datepicker
# or
yarn add @idealyst/datepicker
```

## Peer Dependencies

```bash
npm install @idealyst/components @idealyst/theme react-native-unistyles
```

## Components

### DatePicker

A single date selection component with calendar popup.

```tsx
import { DatePicker } from '@idealyst/datepicker';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      label="Select Date"
      placeholder="Choose a date"
    />
  );
}
```

### Coming Soon

- **DateTimePicker**: Select date and time
- **DateRangePicker**: Select a range of dates  
- **DateTimeRangePicker**: Select a range of dates with times

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Theme integration with Unistyles
- ✅ Accessibility support
- ✅ Keyboard navigation
- ✅ Min/max date restrictions
- ✅ Multiple size variants
- ✅ Customizable date formats
- ✅ TypeScript support

## API Reference

### DatePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | - | Current selected date |
| `onChange` | `(date: Date \| null) => void` | - | Called when date changes |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `string` | `'Select date'` | Placeholder text |
| `label` | `string` | - | Label for the picker |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `format` | `string` | `'MM/dd/yyyy'` | Date display format |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant |

## Examples

See the examples directory or import examples:

```tsx
import { DatePickerExamples } from '@idealyst/datepicker/examples';
```

## License

MIT