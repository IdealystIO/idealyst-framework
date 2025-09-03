import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { DateTimeRangePickerProps, DateTimeRange } from './types';
import { dateTimeRangePickerStyles } from './DateTimeRangePicker.styles';
import { timePickerStyles } from '../DateTimePicker/TimePicker.styles';
import { getDimensions, addEventListener } from '../DateTimePicker/utils/dimensions';

interface DateTimeRangePickerBaseProps extends DateTimeRangePickerProps {
  renderRangeCalendar: (props: {
    value: DateTimeRange;
    onChange: (range: DateTimeRange) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled: boolean;
    allowSameDay: boolean;
    maxDays?: number;
    onDateSelected?: (type: 'start' | 'end') => void;
    showTimes?: boolean;
    timeMode?: '12h' | '24h';
  }) => React.ReactNode;
  renderTimePicker: (props: {
    value: Date;
    onChange: (date: Date) => void;
    disabled: boolean;
    mode: '12h' | '24h';
    step: number;
  }) => React.ReactNode;
}

type ViewMode = 'responsive' | 'date' | 'start-time' | 'end-time';
type TimeSelection = 'start' | 'end';

export const DateTimeRangePickerBase: React.FC<DateTimeRangePickerBaseProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  timeMode = '12h',
  timeStep = 1,
  allowSameDay = true,
  maxDays,
  style,
  testID,
  renderRangeCalendar,
  renderTimePicker,
}) => {
  const [screenData, setScreenData] = useState(() => getDimensions());
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');
  const [activeTimeSelection, setActiveTimeSelection] = useState<TimeSelection>('start');

  // Listen for screen dimension changes
  useEffect(() => {
    const subscription = addEventListener(({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // Determine if we should use side-by-side layout
  const shouldUseSideBySide = screenData.width >= 700; // Wider threshold for range picker
  const canFitSideBySide = screenData.width >= 580; // Minimum for side-by-side

  // Auto-adjust view mode based on screen size
  useEffect(() => {
    if (shouldUseSideBySide) {
      setViewMode('responsive');
    } else if (viewMode === 'responsive' && !canFitSideBySide) {
      setViewMode('date');
    }
  }, [shouldUseSideBySide, canFitSideBySide, viewMode]);

  const handleDateRangeChange = useCallback((newRange: DateTimeRange) => {
    // Preserve existing times when date changes
    const updatedRange: DateTimeRange = { ...newRange };
    
    if (newRange.startDate && value?.startDate) {
      updatedRange.startDate = new Date(newRange.startDate);
      updatedRange.startDate.setHours(
        value.startDate.getHours(),
        value.startDate.getMinutes(),
        value.startDate.getSeconds()
      );
    }
    
    if (newRange.endDate && value?.endDate) {
      updatedRange.endDate = new Date(newRange.endDate);
      updatedRange.endDate.setHours(
        value.endDate.getHours(),
        value.endDate.getMinutes(),
        value.endDate.getSeconds()
      );
    }

    onChange(updatedRange.startDate || updatedRange.endDate ? updatedRange : null);
  }, [value, onChange]);

  const handleDateSelected = useCallback((type: 'start' | 'end') => {
    // Auto-focus time selection when date is selected on mobile
    if (!canFitSideBySide) {
      setActiveTimeSelection(type);
      setViewMode(type === 'start' ? 'start-time' : 'end-time');
    } else {
      // On desktop, just switch the active time tab
      setActiveTimeSelection(type);
    }
  }, [canFitSideBySide]);

  const handleStartTimeChange = useCallback((newTime: Date) => {
    if (value?.startDate) {
      const updatedDate = new Date(value.startDate);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange({ ...value, startDate: updatedDate });
    }
  }, [value, onChange]);

  const handleEndTimeChange = useCallback((newTime: Date) => {
    if (value?.endDate) {
      const updatedDate = new Date(value.endDate);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange({ ...value, endDate: updatedDate });
    }
  }, [value, onChange]);

  const formatSelectedRange = () => {
    if (!value?.startDate) return 'No date range selected';
    
    const startStr = value.startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const startTimeStr = value.startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: timeMode === '12h' 
    });
    
    if (!value.endDate) {
      return `${startStr} at ${startTimeStr} - (end date not selected)`;
    }
    
    const endStr = value.endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const endTimeStr = value.endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: timeMode === '12h' 
    });
    
    return `${startStr} ${startTimeStr} - ${endStr} ${endTimeStr}`;
  };

  // Initialize styles
  timePickerStyles.useVariants({});

  // Side-by-side layout for larger screens
  if (viewMode === 'responsive' && shouldUseSideBySide) {
    return (
      <View style={[dateTimeRangePickerStyles.container, style]} testID={testID} data-testid={testID}>
        {/* Selected Range Header */}
        <View style={dateTimeRangePickerStyles.selectedRangeHeader}>
          <Text style={dateTimeRangePickerStyles.selectedRangeLabel}>Selected Date & Time Range</Text>
          <Text style={dateTimeRangePickerStyles.selectedRangeValue}>
            {formatSelectedRange()}
          </Text>
        </View>

        {/* Side by side layout */}
        <View style={{ 
          flexDirection: 'row', 
          gap: 24, 
          alignItems: 'flex-start',
          _web: {
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
            alignItems: 'flex-start',
          }
        }}>
          {renderRangeCalendar({
            value: value || {},
            onChange: handleDateRangeChange,
            minDate,
            maxDate,
            disabled,
            allowSameDay,
            maxDays,
            onDateSelected: handleDateSelected,
            showTimes: true,
            timeMode,
          })}
          
          {/* Time Selection Panel */}
          {(value?.startDate || value?.endDate) && (
            <View style={{ minWidth: 220, flexShrink: 0 }}>
              {/* Time Selection Tabs */}
              <View style={timePickerStyles.tabBar}>
                <Button
                  onPress={() => setActiveTimeSelection('start')}
                  disabled={disabled || !value?.startDate}
                  style={[
                    timePickerStyles.tabButton,
                    activeTimeSelection === 'start' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
                  ]}
                >
                  Start Time
                </Button>
                <Button
                  onPress={() => setActiveTimeSelection('end')}
                  disabled={disabled || !value?.endDate}
                  style={[
                    timePickerStyles.tabButton,
                    activeTimeSelection === 'end' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
                  ]}
                >
                  End Time
                </Button>
              </View>

              {/* Active Time Picker */}
              {activeTimeSelection === 'start' && value?.startDate && (
                renderTimePicker({
                  value: value.startDate,
                  onChange: handleStartTimeChange,
                  disabled,
                  mode: timeMode,
                  step: timeStep,
                })
              )}

              {activeTimeSelection === 'end' && value?.endDate && (
                renderTimePicker({
                  value: value.endDate,
                  onChange: handleEndTimeChange,
                  disabled,
                  mode: timeMode,
                  step: timeStep,
                })
              )}
            </View>
          )}
        </View>
      </View>
    );
  }

  // Step-by-step layout for smaller screens
  const isDateStep = viewMode === 'date';
  const isStartTimeStep = viewMode === 'start-time';
  const isEndTimeStep = viewMode === 'end-time';

  return (
    <View style={[dateTimeRangePickerStyles.container, style]} testID={testID} data-testid={testID}>
      {/* Selected Range Header */}
      <View style={dateTimeRangePickerStyles.selectedRangeHeader}>
        <Text style={dateTimeRangePickerStyles.selectedRangeLabel}>
          {isDateStep ? 'Select Date Range' : 
           isStartTimeStep ? 'Set Start Time' : 
           isEndTimeStep ? 'Set End Time' : 'Selected Date & Time Range'}
        </Text>
        <Text style={dateTimeRangePickerStyles.selectedRangeValue}>
          {formatSelectedRange()}
        </Text>
      </View>

      {/* Step Navigation */}
      <View style={timePickerStyles.tabBar}>
        <Button
          onPress={() => setViewMode('date')}
          disabled={disabled}
          style={[
            timePickerStyles.tabButton,
            isDateStep ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
          ]}
        >
          1. Dates
        </Button>
        <Button
          onPress={() => setViewMode('start-time')}
          disabled={disabled || !value?.startDate}
          style={[
            timePickerStyles.tabButton,
            isStartTimeStep ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
          ]}
        >
          2. Start Time
        </Button>
        <Button
          onPress={() => setViewMode('end-time')}
          disabled={disabled || !value?.endDate}
          style={[
            timePickerStyles.tabButton,
            isEndTimeStep ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
          ]}
        >
          3. End Time
        </Button>
      </View>

      {/* Step Content */}
      {isDateStep && (
        <View>
          {renderRangeCalendar({
            value: value || {},
            onChange: handleDateRangeChange,
            minDate,
            maxDate,
            disabled,
            allowSameDay,
            maxDays,
            onDateSelected: handleDateSelected,
            showTimes: true,
            timeMode,
          })}
        </View>
      )}

      {isStartTimeStep && value?.startDate && (
        <View>
          {renderTimePicker({
            value: value.startDate,
            onChange: handleStartTimeChange,
            disabled,
            mode: timeMode,
            step: timeStep,
          })}
          
          {/* Navigation */}
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              size="small"
              onPress={() => setViewMode('date')}
              disabled={disabled}
            >
              ← Back to Dates
            </Button>
            {value.endDate && (
              <Button
                variant="text"
                size="small"
                onPress={() => setViewMode('end-time')}
                disabled={disabled}
              >
                End Time →
              </Button>
            )}
          </View>
        </View>
      )}

      {isEndTimeStep && value?.endDate && (
        <View>
          {renderTimePicker({
            value: value.endDate,
            onChange: handleEndTimeChange,
            disabled,
            mode: timeMode,
            step: timeStep,
          })}
          
          {/* Navigation */}
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              size="small"
              onPress={() => setViewMode('start-time')}
              disabled={disabled}
            >
              ← Start Time
            </Button>
            <Button
              variant="text"
              size="small"
              onPress={() => setViewMode('date')}
              disabled={disabled}
            >
              Back to Dates
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};