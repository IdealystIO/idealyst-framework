import React, { useState } from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';
import { DatePicker, TimePicker, DateInput, TimeInput, DateTimePicker } from '../index';

export const DatePickerExamples = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [inlineDate, setInlineDate] = useState(new Date());
  const [inlineTime, setInlineTime] = useState(new Date());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return (
    <Screen background="primary" padding="lg">
      <View gap="lg">
        <Text typography="h2" weight="bold" align="center">
          DatePicker Examples
        </Text>

        {/* DateInput */}
        <View gap="md">
          <Text typography="h4" weight="semibold">DateInput</Text>
          <Text typography="caption" color="secondary">
            Type a date (MM/DD/YYYY) or click the calendar button
          </Text>
          <DateInput
            value={date ?? undefined}
            onChange={setDate}
            label="Select Date"
            placeholder="MM/DD/YYYY"
          />
          {date && (
            <Text typography="caption" color="secondary">
              Selected: {date.toDateString()}
            </Text>
          )}
        </View>

        {/* TimeInput */}
        <View gap="md">
          <Text typography="h4" weight="semibold">TimeInput</Text>
          <Text typography="caption" color="secondary">
            Type a time (e.g., 2:30 PM) or click the clock button
          </Text>
          <TimeInput
            value={time ?? undefined}
            onChange={setTime}
            label="Select Time"
            placeholder="12:00 PM"
          />
          {time && (
            <Text typography="caption" color="secondary">
              Selected: {time.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* DateTimePicker */}
        <View gap="md">
          <Text typography="h4" weight="semibold">DateTimePicker</Text>
          <DateTimePicker
            value={dateTime ?? undefined}
            onChange={setDateTime}
            label="Select Date & Time"
          />
          {dateTime && (
            <Text typography="caption" color="secondary">
              Selected: {dateTime.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Date Range Restriction */}
        <View gap="md">
          <Text typography="h4" weight="semibold">With Min/Max Date</Text>
          <DateInput
            value={undefined}
            onChange={() => {}}
            label="Future Dates Only"
            placeholder="MM/DD/YYYY"
            minDate={tomorrow}
            maxDate={nextMonth}
          />
          <Text typography="caption" color="secondary">
            Only dates between tomorrow and next month
          </Text>
        </View>

        {/* Inline DatePicker */}
        <View gap="md">
          <Text typography="h4" weight="semibold">Inline DatePicker</Text>
          <DatePicker
            value={inlineDate}
            onChange={setInlineDate}
          />
          <Text typography="caption" color="secondary">
            Selected: {inlineDate.toDateString()}
          </Text>
        </View>

        {/* Inline TimePicker */}
        <View gap="md">
          <Text typography="h4" weight="semibold">Inline TimePicker</Text>
          <TimePicker
            value={inlineTime}
            onChange={setInlineTime}
            mode="12h"
          />
          <Text typography="caption" color="secondary">
            Selected: {inlineTime.toLocaleTimeString()}
          </Text>
        </View>

        {/* 24-hour Time */}
        <View gap="md">
          <Text typography="h4" weight="semibold">24-hour Format</Text>
          <TimeInput
            value={undefined}
            onChange={() => {}}
            label="24-hour Time"
            placeholder="14:30"
            mode="24h"
            minuteStep={5}
          />
        </View>

        {/* Actions */}
        <View gap="md">
          <Text typography="h4" weight="semibold">Actions</Text>
          <View gap="sm">
            <Button
              type="outlined"
              onPress={() => {
                const now = new Date();
                setDate(now);
                setTime(now);
                setDateTime(now);
              }}
            >
              Set All to Now
            </Button>
            <Button
              type="outlined"
              onPress={() => {
                setDate(null);
                setTime(null);
                setDateTime(null);
              }}
            >
              Clear All
            </Button>
          </View>
        </View>
      </View>
    </Screen>
  );
};
