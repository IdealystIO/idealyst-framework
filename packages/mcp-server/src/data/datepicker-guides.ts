/**
 * DatePicker Package Guides
 *
 * Comprehensive documentation for @idealyst/datepicker.
 */

export const datepickerGuides: Record<string, string> = {
  "idealyst://datepicker/overview": `# @idealyst/datepicker

Cross-platform date and time picker components.

## Installation

\`\`\`bash
yarn add @idealyst/datepicker
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ Custom calendar/time UI |
| iOS      | ✅ Native DatePicker |
| Android  | ✅ Material DatePicker |

## Key Exports

\`\`\`typescript
import {
  DatePicker,      // Calendar date picker
  TimePicker,      // Time picker
  DateInput,       // Date text input with picker
  TimeInput,       // Time text input with picker
  DateTimePicker,  // Combined date + time picker
} from '@idealyst/datepicker';
\`\`\`

## Quick Start

\`\`\`tsx
import React, { useState } from 'react';
import { View } from '@idealyst/components';
import { DatePicker } from '@idealyst/datepicker';

function DateSelection() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <View padding="md">
      <DatePicker value={date} onChange={setDate} />
    </View>
  );
}
\`\`\`
`,

  "idealyst://datepicker/api": `# @idealyst/datepicker — API Reference

## Components

### DatePicker

Calendar-style date picker.

\`\`\`typescript
interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  style?: ViewStyle;
}
\`\`\`

---

### TimePicker

Time-only picker with 12h/24h support.

\`\`\`typescript
interface TimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  mode?: '12h' | '24h';      // Default: '12h'
  minuteStep?: number;        // Minute interval (default: 1)
  disabled?: boolean;
  style?: ViewStyle;
}
\`\`\`

---

### DateInput

Text input that opens a date picker on focus/press.

\`\`\`typescript
interface DateInputProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  size?: Size;      // From @idealyst/theme
  style?: ViewStyle;
}
\`\`\`

---

### TimeInput

Text input that opens a time picker on focus/press.

\`\`\`typescript
interface TimeInputProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  mode?: '12h' | '24h';
  minuteStep?: number;
  disabled?: boolean;
  error?: string;
  size?: Size;
  style?: ViewStyle;
}
\`\`\`

---

### DateTimePicker

Combined date and time picker.

\`\`\`typescript
interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  timeMode?: '12h' | '24h';
  minuteStep?: number;
  disabled?: boolean;
  error?: string;
  size?: Size;
  style?: ViewStyle;
}
\`\`\`
`,

  "idealyst://datepicker/examples": `# @idealyst/datepicker — Examples

## Date Input with Validation

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { DateInput } from '@idealyst/datepicker';

function BirthdayForm() {
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [error, setError] = useState<string | undefined>();

  const handleChange = (date: Date | null) => {
    setBirthday(date);
    if (date && date > new Date()) {
      setError('Birthday cannot be in the future');
    } else {
      setError(undefined);
    }
  };

  return (
    <View padding="md" gap="md">
      <DateInput
        value={birthday ?? undefined}
        onChange={handleChange}
        label="Birthday"
        placeholder="Select your birthday"
        maxDate={new Date()}
        error={error}
        size="md"
      />
    </View>
  );
}
\`\`\`

## Time Picker (24h)

\`\`\`tsx
import React, { useState } from 'react';
import { View } from '@idealyst/components';
import { TimePicker } from '@idealyst/datepicker';

function MeetingTimePicker() {
  const [time, setTime] = useState(new Date());

  return (
    <View padding="md">
      <TimePicker
        value={time}
        onChange={setTime}
        mode="24h"
        minuteStep={15}
      />
    </View>
  );
}
\`\`\`

## Date + Time Combined

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text } from '@idealyst/components';
import { DateTimePicker } from '@idealyst/datepicker';

function EventScheduler() {
  const [eventDate, setEventDate] = useState<Date | null>(null);

  return (
    <View padding="md" gap="md">
      <DateTimePicker
        value={eventDate ?? undefined}
        onChange={setEventDate}
        label="Event Date & Time"
        minDate={new Date()}
        timeMode="12h"
        minuteStep={15}
        size="md"
      />
      {eventDate && (
        <Text>Scheduled for: {eventDate.toLocaleString()}</Text>
      )}
    </View>
  );
}
\`\`\`

## Date Range (Two Pickers)

\`\`\`tsx
import React, { useState } from 'react';
import { View } from '@idealyst/components';
import { DateInput } from '@idealyst/datepicker';

function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <View padding="md" gap="md">
      <DateInput
        value={startDate ?? undefined}
        onChange={setStartDate}
        label="Start Date"
        placeholder="Select start date"
      />
      <DateInput
        value={endDate ?? undefined}
        onChange={setEndDate}
        label="End Date"
        placeholder="Select end date"
        minDate={startDate ?? undefined}
        error={endDate && startDate && endDate < startDate ? 'End must be after start' : undefined}
      />
    </View>
  );
}
\`\`\`
`,
};
