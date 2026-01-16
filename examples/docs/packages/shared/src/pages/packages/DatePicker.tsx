import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function DatePickerPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          DatePicker
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform date and time picker components. Provides calendar-based date
          selection, time pickers, and input fields with validation.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import {
  DatePicker,
  TimePicker,
  DateInput,
  TimeInput,
  DateTimePicker,
} from '@idealyst/datepicker';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Components Overview
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              DatePicker
            </Text>
            <Text typography="body2" color="tertiary">
              Inline calendar component for selecting dates. Renders the full calendar directly.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              TimePicker
            </Text>
            <Text typography="body2" color="tertiary">
              Inline time selection component. Supports 12-hour and 24-hour formats.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              DateInput
            </Text>
            <Text typography="body2" color="tertiary">
              Text input field with a calendar popup. Users can type dates or use the picker.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              TimeInput
            </Text>
            <Text typography="body2" color="tertiary">
              Text input field with a time picker popup. Users can type times or use the picker.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              DateTimePicker
            </Text>
            <Text typography="body2" color="tertiary">
              Combined date and time input. Shows both date and time selection in one field.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          DateInput
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          A text input with an integrated calendar popup:
        </Text>

        <CodeBlock
          code={`import { DateInput } from '@idealyst/datepicker';

function DateForm() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DateInput
      value={date ?? undefined}
      onChange={setDate}
      label="Select Date"
      placeholder="MM/DD/YYYY"
    />
  );
}`}
          language="tsx"
          title="Basic DateInput"
        />

        <CodeBlock
          code={`// Restrict to a date range
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

<DateInput
  value={date}
  onChange={setDate}
  label="Future Dates Only"
  placeholder="MM/DD/YYYY"
  minDate={tomorrow}
  maxDate={nextMonth}
/>`}
          language="tsx"
          title="Date Range Restriction"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          DateInput Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="value" type="Date" description="The currently selected date." />
          <PropRow name="onChange" type="(date: Date | null) => void" description="Callback when date changes." required />
          <PropRow name="label" type="string" description="Label text above the input." />
          <PropRow name="placeholder" type="string" description="Placeholder text when empty." />
          <PropRow name="minDate" type="Date" description="Minimum selectable date." />
          <PropRow name="maxDate" type="Date" description="Maximum selectable date." />
          <PropRow name="disabled" type="boolean" description="Disable the input." />
          <PropRow name="error" type="string" description="Error message to display." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          TimeInput
        </Text>

        <CodeBlock
          code={`import { TimeInput } from '@idealyst/datepicker';

function TimeForm() {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <TimeInput
      value={time ?? undefined}
      onChange={setTime}
      label="Select Time"
      placeholder="12:00 PM"
    />
  );
}`}
          language="tsx"
          title="Basic TimeInput"
        />

        <CodeBlock
          code={`// 24-hour format with 5-minute steps
<TimeInput
  value={time}
  onChange={setTime}
  label="24-hour Time"
  placeholder="14:30"
  mode="24h"
  minuteStep={5}
/>`}
          language="tsx"
          title="24-hour Format"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          TimeInput Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="value" type="Date" description="The currently selected time (uses Date object)." />
          <PropRow name="onChange" type="(date: Date | null) => void" description="Callback when time changes." required />
          <PropRow name="label" type="string" description="Label text above the input." />
          <PropRow name="placeholder" type="string" description="Placeholder text when empty." />
          <PropRow name="mode" type="'12h' | '24h'" description="Time format. Defaults to 12h." />
          <PropRow name="minuteStep" type="number" description="Minute increment (e.g., 5 for :00, :05, :10...)." />
          <PropRow name="disabled" type="boolean" description="Disable the input." />
          <PropRow name="error" type="string" description="Error message to display." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          DateTimePicker
        </Text>

        <CodeBlock
          code={`import { DateTimePicker } from '@idealyst/datepicker';

function AppointmentForm() {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  return (
    <DateTimePicker
      value={dateTime ?? undefined}
      onChange={setDateTime}
      label="Select Date & Time"
    />
  );
}`}
          language="tsx"
          title="Combined Date & Time"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          DateTimePicker Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="value" type="Date" description="The currently selected date and time." />
          <PropRow name="onChange" type="(date: Date | null) => void" description="Callback when value changes." required />
          <PropRow name="label" type="string" description="Label text above the input." />
          <PropRow name="minDate" type="Date" description="Minimum selectable date." />
          <PropRow name="maxDate" type="Date" description="Maximum selectable date." />
          <PropRow name="timeMode" type="'12h' | '24h'" description="Time format for the time picker." />
          <PropRow name="minuteStep" type="number" description="Minute increment for time selection." />
          <PropRow name="disabled" type="boolean" description="Disable the input." />
          <PropRow name="error" type="string" description="Error message to display." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Inline DatePicker
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Display the calendar inline without a popup:
        </Text>

        <CodeBlock
          code={`import { DatePicker } from '@idealyst/datepicker';

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View>
      <DatePicker
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <Text>Selected: {selectedDate.toDateString()}</Text>
    </View>
  );
}`}
          language="tsx"
          title="Inline Calendar"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          DatePicker Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="value" type="Date" description="The currently selected date." />
          <PropRow name="onChange" type="(date: Date) => void" description="Callback when date is selected." required />
          <PropRow name="minDate" type="Date" description="Minimum selectable date." />
          <PropRow name="maxDate" type="Date" description="Maximum selectable date." />
          <PropRow name="disabled" type="boolean" description="Disable date selection." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Inline TimePicker
        </Text>

        <CodeBlock
          code={`import { TimePicker } from '@idealyst/datepicker';

function TimeSelector() {
  const [selectedTime, setSelectedTime] = useState(new Date());

  return (
    <View>
      <TimePicker
        value={selectedTime}
        onChange={setSelectedTime}
        mode="12h"
      />
      <Text>Selected: {selectedTime.toLocaleTimeString()}</Text>
    </View>
  );
}`}
          language="tsx"
          title="Inline Time Picker"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          TimePicker Props
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <PropRow name="value" type="Date" description="The currently selected time." />
          <PropRow name="onChange" type="(date: Date) => void" description="Callback when time is selected." required />
          <PropRow name="mode" type="'12h' | '24h'" description="Time format. Defaults to 12h." />
          <PropRow name="minuteStep" type="number" description="Minute increment for selection." />
          <PropRow name="disabled" type="boolean" description="Disable time selection." />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Form Example
        </Text>

        <CodeBlock
          code={`import { DateInput, TimeInput } from '@idealyst/datepicker';
import { View, Button } from '@idealyst/components';

function EventForm() {
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (eventDate && startTime && endTime) {
      // Combine date with times
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

      console.log('Event:', { start: startDateTime, end: endDateTime });
    }
  };

  return (
    <View gap="md">
      <DateInput
        value={eventDate ?? undefined}
        onChange={setEventDate}
        label="Event Date"
        placeholder="Select date"
      />
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <TimeInput
          value={startTime ?? undefined}
          onChange={setStartTime}
          label="Start Time"
          placeholder="Start"
          style={{ flex: 1 }}
        />
        <TimeInput
          value={endTime ?? undefined}
          onChange={setEndTime}
          label="End Time"
          placeholder="End"
          style={{ flex: 1 }}
        />
      </View>
      <Button onPress={handleSubmit}>Create Event</Button>
    </View>
  );
}`}
          language="tsx"
          title="Event Scheduling Form"
        />
      </View>
    </Screen>
  );
}

function PropRow({
  name,
  type,
  description,
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 140 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace' }}>
          {name}
          {required && <Text color="danger">*</Text>}
        </Text>
      </View>
      <View style={{ width: 200 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}
