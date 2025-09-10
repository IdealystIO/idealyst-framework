import React, { useState, useEffect, useCallback } from 'react';
import { View, Button } from '@idealyst/components';
import { DateTimePickerProps } from './types';
import { dateTimePickerStyles } from './DateTimePicker.styles';
import { getDimensions, addEventListener } from './utils/dimensions';

interface DateTimePickerBaseProps extends DateTimePickerProps {
  renderCalendar: (props: {
    value: Date | undefined;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled: boolean;
  }) => React.ReactNode;
  renderTimePicker: (props: {
    value: Date;
    onChange: (date: Date) => void;
    disabled: boolean;
    mode: '12h' | '24h';
    step: number;
  }) => React.ReactNode;
}

type ViewMode = 'responsive' | 'date' | 'time';

export const DateTimePickerBase: React.FC<DateTimePickerBaseProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  timeMode = '12h',
  timeStep = 1,
  style,
  testID,
  renderCalendar,
  renderTimePicker,
}) => {
  const [screenData, setScreenData] = useState(() => getDimensions());
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');

  // Listen for screen dimension changes
  useEffect(() => {
    const subscription = addEventListener(({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // Determine if we should use side-by-side layout
  const shouldUseSideBySide = screenData.width >= 600; // Tablet width threshold
  const canFitSideBySide = screenData.width >= 480; // Minimum for side-by-side

  // Auto-adjust view mode based on screen size
  useEffect(() => {
    if (shouldUseSideBySide) {
      setViewMode('responsive');
    } else if (viewMode === 'responsive' && !canFitSideBySide) {
      setViewMode('date');
    }
  }, [shouldUseSideBySide, canFitSideBySide, viewMode]);

  const handleDateChange = useCallback((newDate: Date) => {
    if (value) {
      // Preserve the time from current value
      const updatedDate = new Date(newDate);
      updatedDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
      onChange(updatedDate);
    } else {
      onChange(newDate);
    }
    
    // Auto-advance to time selection on small screens after date selection
    if (!canFitSideBySide && viewMode === 'date') {
      setViewMode('time');
    }
  }, [value, onChange, canFitSideBySide, viewMode]);

  const handleTimeChange = useCallback((newTime: Date) => {
    if (value) {
      // Update time while preserving the date
      const updatedDate = new Date(value);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange(updatedDate);
    } else {
      // If no date is selected, use today's date with the new time
      const today = new Date();
      today.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange(today);
    }
  }, [value, onChange]);

  // Side-by-side layout for larger screens
  if (viewMode === 'responsive' && shouldUseSideBySide) {
    return (
      <View style={[dateTimePickerStyles.container, style]} testID={testID} data-testid={testID}>
        {/* Side by side layout */}
        <View style={{ 
          flexDirection: 'row', 
          gap: 16, 
          alignItems: 'flex-start',
          _web: {
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            alignItems: 'flex-start',
          }
        }}>
          {renderCalendar({
            value,
            onChange: handleDateChange,
            minDate,
            maxDate,
            disabled,
          })}
          
          {renderTimePicker({
            value: value || new Date(),
            onChange: handleTimeChange,
            disabled,
            mode: timeMode,
            step: timeStep,
          })}
        </View>
      </View>
    );
  }

  // Step-by-step layout for smaller screens
  const isDateStep = viewMode === 'date';
  const isTimeStep = viewMode === 'time';

  return (
    <View style={[dateTimePickerStyles.container, style]} testID={testID} data-testid={testID}>
      {/* Step Navigation */}
      <View style={{
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
        _web: {
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
        }
      }}>
        <Button
          variant={isDateStep ? 'primary' : 'outlined'}
          size="small"
          onPress={() => setViewMode('date')}
          disabled={disabled}
          style={{ flex: 1 }}
        >
          1. Date
        </Button>
        <Button
          variant={isTimeStep ? 'primary' : 'outlined'}
          size="small"
          onPress={() => setViewMode('time')}
          disabled={disabled || !value}
          style={{ flex: 1 }}
        >
          2. Time
        </Button>
      </View>

      {/* Step Content */}
      {isDateStep && (
        <View>
          {renderCalendar({
            value,
            onChange: handleDateChange,
            minDate,
            maxDate,
            disabled,
          })}
        </View>
      )}

      {isTimeStep && (
        <View>
          {renderTimePicker({
            value: value || new Date(),
            onChange: handleTimeChange,
            disabled,
            mode: timeMode,
            step: timeStep,
          })}
          
          {/* Back to Date button */}
          <View style={{ marginTop: 12, alignItems: 'flex-start' }}>
            <Button
              variant="text"
              size="small"
              onPress={() => setViewMode('date')}
              disabled={disabled}
            >
              ← Back to Date
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};