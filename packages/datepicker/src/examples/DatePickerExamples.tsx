import { useState } from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import { DatePicker } from '../DatePicker';
import { DateTimePicker } from '../DateTimePicker';
import { DateTimeRangePicker, DateTimeRange } from '../DateTimeRangePicker';

export const DatePickerExamples = () => {
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [rangeDate, setRangeDate] = useState<Date | null>(null);
  const [disabledDate, setDisabledDate] = useState<Date | null>(new Date());
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [dateTime24h, setDateTime24h] = useState<Date | null>(null);
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="lg" weight="bold" align="center">
          DatePicker & DateTimePicker Examples
        </Text>
        
        {/* DateTime Picker Examples */}
        <View spacing="md">
          <Text size="md" weight="semibold">DateTimePicker Examples</Text>
          
          {/* Basic DateTime */}
          <View spacing="sm">
            <Text size="sm" weight="medium">Basic DateTimePicker (12-hour)</Text>
            <DateTimePicker
              value={dateTime}
              onChange={setDateTime}
              label="Select Date & Time"
              placeholder="Choose date and time"
              helperText="Responsive layout - side-by-side on large screens, step-by-step on mobile"
            />
            {dateTime && (
              <Text size="sm" color="secondary">
                Selected: {dateTime.toLocaleString()}
              </Text>
            )}
          </View>

          {/* 24-hour format */}
          <View spacing="sm">
            <Text size="sm" weight="medium">24-hour format with seconds</Text>
            <DateTimePicker
              value={dateTime24h}
              onChange={setDateTime24h}
              label="24-hour with seconds"
              placeholder="Choose date and time"
              timeMode="24h"
              timeStep={5}
              helperText="24-hour format with seconds, 5-minute steps"
            />
            {dateTime24h && (
              <Text size="sm" color="secondary">
                Selected: {dateTime24h.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Basic DatePicker */}
        <View spacing="md">
          <Text size="md" weight="semibold">Basic DatePicker</Text>
          <DatePicker
            value={basicDate}
            onChange={setBasicDate}
            label="Select Date"
            placeholder="Choose a date"
            helperText="Pick any date"
          />
          {basicDate && (
            <Text size="sm" color="secondary">
              Selected: {basicDate.toDateString()}
            </Text>
          )}
        </View>

        {/* Date Range Restricted */}
        <View spacing="md">
          <Text size="md" weight="semibold">Date Range Restricted</Text>
          <DatePicker
            value={rangeDate}
            onChange={setRangeDate}
            label="Future Dates Only"
            placeholder="Select future date"
            minDate={tomorrow}
            maxDate={nextMonth}
            helperText="Only dates between tomorrow and next month"
          />
          {rangeDate && (
            <Text size="sm" color="secondary">
              Selected: {rangeDate.toDateString()}
            </Text>
          )}
        </View>

        {/* Disabled DatePicker */}
        <View spacing="md">
          <Text size="md" weight="semibold">Disabled DatePicker</Text>
          <DatePicker
            value={disabledDate}
            onChange={setDisabledDate}
            label="Disabled"
            placeholder="Cannot select"
            disabled
            helperText="This picker is disabled"
          />
        </View>


        {/* Actions */}
        <View spacing="md">
          <Text size="md" weight="semibold">Actions</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button 
              variant="outlined" 
              onPress={() => setBasicDate(new Date())}
            >
              Set Today
            </Button>
            <Button 
              variant="outlined" 
              onPress={() => {
                setBasicDate(null);
                setRangeDate(null);
              }}
            >
              Clear All
            </Button>
          </View>
        </View>



        {/* Date Time Range Picker Examples */}
        <View spacing="md">
          <Text size="md" weight="semibold">DateTimeRangePicker Examples</Text>
          
          {/* Basic DateTime Range */}
          <View spacing="sm">
            <Text size="sm" weight="medium">Date and time range selection</Text>
            <DateTimeRangePicker
              value={dateTimeRange}
              onChange={setDateTimeRange}
              label="Select Date & Time Range"
              placeholder="Choose date/time range"
              helperText="Select date range first, then adjust times"
            />
            {dateTimeRange?.startDate && dateTimeRange?.endDate && (
              <Text size="sm" color="secondary">
                Range: {dateTimeRange.startDate.toLocaleString()} to {dateTimeRange.endDate.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Features Description */}
        <View spacing="md">
          <Text size="md" weight="semibold">Features</Text>
          <View spacing="sm">
            <Text size="sm" color="secondary">
              • Cross-platform calendar picker
            </Text>
            <Text size="sm" color="secondary">
              • Date and time selection
            </Text>
            <Text size="sm" color="secondary">
              • Date/time range selection
            </Text>
            <Text size="sm" color="secondary">
              • 12/24 hour time formats
            </Text>
            <Text size="sm" color="secondary">
              • Min/max date restrictions
            </Text>
            <Text size="sm" color="secondary">
              • Accessible and keyboard navigable
            </Text>
            <Text size="sm" color="secondary">
              • Theme-aware styling
            </Text>
            <Text size="sm" color="secondary">
              • Customizable date/time formats
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};