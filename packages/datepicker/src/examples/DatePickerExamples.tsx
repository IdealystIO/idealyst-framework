import { useState } from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import { DatePicker } from '../DatePicker';
import { DateTimePicker } from '../DateTimePicker';
import { DateRangePicker, DateRange } from '../DateRangePicker';
import { DateTimeRangePicker, DateTimeRange } from '../DateTimeRangePicker';

export const DatePickerExamples = () => {
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [rangeDate, setRangeDate] = useState<Date | null>(null);
  const [disabledDate, setDisabledDate] = useState<Date | null>(new Date());
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [dateTime24h, setDateTime24h] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [restrictedRange, setRestrictedRange] = useState<DateRange | null>(null);
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="large" weight="bold" align="center">
          DatePicker Examples
        </Text>
        
        {/* Basic DatePicker */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Basic DatePicker</Text>
          <DatePicker
            value={basicDate}
            onChange={setBasicDate}
            label="Select Date"
            placeholder="Choose a date"
            helperText="Pick any date"
          />
          {basicDate && (
            <Text size="small" color="secondary">
              Selected: {basicDate.toDateString()}
            </Text>
          )}
        </View>

        {/* Date Range Restricted */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Date Range Restricted</Text>
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
            <Text size="small" color="secondary">
              Selected: {rangeDate.toDateString()}
            </Text>
          )}
        </View>

        {/* Disabled DatePicker */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Disabled DatePicker</Text>
          <DatePicker
            value={disabledDate}
            onChange={setDisabledDate}
            label="Disabled"
            placeholder="Cannot select"
            disabled
            helperText="This picker is disabled"
          />
        </View>

        {/* Size Variants */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Size Variants</Text>
          <View spacing="sm">
            <DatePicker
              value={null}
              onChange={() => {}}
              label="Small"
              placeholder="Small size"
              size="small"
            />
            <DatePicker
              value={null}
              onChange={() => {}}
              label="Medium"
              placeholder="Medium size"
              size="medium"
            />
            <DatePicker
              value={null}
              onChange={() => {}}
              label="Large"
              placeholder="Large size"
              size="large"
            />
          </View>
        </View>

        {/* Actions */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Actions</Text>
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

        {/* DateTime Picker Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">DateTimePicker Examples</Text>
          
          {/* Basic DateTime */}
          <View spacing="sm">
            <Text size="small" weight="medium">12-hour format</Text>
            <DateTimePicker
              value={dateTime}
              onChange={setDateTime}
              label="Select Date & Time"
              placeholder="Choose date and time"
              helperText="12-hour format with AM/PM"
            />
            {dateTime && (
              <Text size="small" color="secondary">
                Selected: {dateTime.toLocaleString()}
              </Text>
            )}
          </View>

          {/* 24-hour format */}
          <View spacing="sm">
            <Text size="small" weight="medium">24-hour format with seconds</Text>
            <DateTimePicker
              value={dateTime24h}
              onChange={setDateTime24h}
              label="24-hour with seconds"
              placeholder="Choose date and time"
              timeMode="24h"
              showSeconds={true}
              timeStep={5}
              helperText="24-hour format with seconds, 5-minute steps"
            />
            {dateTime24h && (
              <Text size="small" color="secondary">
                Selected: {dateTime24h.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Date Range Picker Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">DateRangePicker Examples</Text>
          
          {/* Basic Range */}
          <View spacing="sm">
            <Text size="small" weight="medium">Basic range selection</Text>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              label="Select Date Range"
              placeholder="Choose start and end dates"
              helperText="Click dates to select a range"
            />
            {dateRange?.startDate && dateRange?.endDate && (
              <Text size="small" color="secondary">
                Range: {dateRange.startDate.toDateString()} to {dateRange.endDate.toDateString()}
              </Text>
            )}
          </View>

          {/* Restricted Range */}
          <View spacing="sm">
            <Text size="small" weight="medium">Max 14 days, future dates only</Text>
            <DateRangePicker
              value={restrictedRange}
              onChange={setRestrictedRange}
              label="Restricted Range"
              placeholder="Maximum 14 days"
              minDate={tomorrow}
              maxDays={14}
              helperText="Future dates only, max 14 days"
            />
            {restrictedRange?.startDate && restrictedRange?.endDate && (
              <Text size="small" color="secondary">
                Range: {restrictedRange.startDate.toDateString()} to {restrictedRange.endDate.toDateString()}
              </Text>
            )}
          </View>
        </View>

        {/* Date Time Range Picker Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">DateTimeRangePicker Examples</Text>
          
          {/* Basic DateTime Range */}
          <View spacing="sm">
            <Text size="small" weight="medium">Date and time range selection</Text>
            <DateTimeRangePicker
              value={dateTimeRange}
              onChange={setDateTimeRange}
              label="Select Date & Time Range"
              placeholder="Choose date/time range"
              helperText="Select date range first, then adjust times"
            />
            {dateTimeRange?.startDate && dateTimeRange?.endDate && (
              <Text size="small" color="secondary">
                Range: {dateTimeRange.startDate.toLocaleString()} to {dateTimeRange.endDate.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Features Description */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Features</Text>
          <View spacing="sm">
            <Text size="small" color="secondary">
              • Cross-platform calendar picker
            </Text>
            <Text size="small" color="secondary">
              • Date and time selection
            </Text>
            <Text size="small" color="secondary">
              • Date range selection
            </Text>
            <Text size="small" color="secondary">
              • Date/time range selection
            </Text>
            <Text size="small" color="secondary">
              • 12/24 hour time formats
            </Text>
            <Text size="small" color="secondary">
              • Min/max date restrictions
            </Text>
            <Text size="small" color="secondary">
              • Multiple size variants
            </Text>
            <Text size="small" color="secondary">
              • Accessible and keyboard navigable
            </Text>
            <Text size="small" color="secondary">
              • Theme-aware styling
            </Text>
            <Text size="small" color="secondary">
              • Customizable date/time formats
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};