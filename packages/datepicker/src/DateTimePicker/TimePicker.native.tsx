import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Input } from '@idealyst/components';
import { TouchableOpacity, TextInput } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { TimePickerProps } from './types';
import { timePickerStyles } from './TimePicker.styles';

export const TimePicker: React.FC<TimePickerProps> = ({
  value = new Date(),
  onChange,
  disabled = false,
  mode = '12h',
  showSeconds = false,
  step = 1,
  style,
  testID,
}) => {
  const [activeSelection, setActiveSelection] = useState<'hour' | 'minute'>('hour');
  const [hourInputValue, setHourInputValue] = useState(String(value.getHours() > 12 && mode === '12h' ? value.getHours() - 12 : value.getHours()));
  const [minuteInputValue, setMinuteInputValue] = useState(String(value.getMinutes()).padStart(2, '0'));
  const [hourInputFocused, setHourInputFocused] = useState(false);
  const [minuteInputFocused, setMinuteInputFocused] = useState(false);
  const hourInputRef = useRef<TextInput | null>(null);
  const minuteInputRef = useRef<TextInput | null>(null);
  
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const seconds = value.getSeconds();

  const displayHours = mode === '12h' ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;
  const ampm = mode === '12h' ? (hours >= 12 ? 'PM' : 'AM') : null;

  // Sync input values when time changes from external sources (like clock clicks)
  // Only update if the input is not currently focused
  useEffect(() => {
    if (!hourInputFocused) {
      setHourInputValue(String(displayHours));
    }
    if (!minuteInputFocused) {
      setMinuteInputValue(String(minutes).padStart(2, '0'));
    }
  }, [displayHours, minutes, hourInputFocused, minuteInputFocused]);

  const updateTime = (newHours: number, newMinutes: number, newSeconds?: number) => {
    const newDate = new Date(value);
    newDate.setHours(newHours, newMinutes, newSeconds || 0);
    onChange(newDate);
  };

  const handleHourClick = (hour: number) => {
    let hour24 = hour;
    if (mode === '12h') {
      const isPM = hours >= 12;
      if (hour === 12) hour24 = isPM ? 12 : 0;
      else hour24 = isPM ? hour + 12 : hour;
    }
    updateTime(hour24, minutes, seconds);
    setActiveSelection('minute');
  };

  const handleMinuteClick = (minute: number) => {
    updateTime(hours, minute, seconds);
  };

  const toggleAmPm = () => {
    if (mode === '12h') {
      const newHours = hours >= 12 ? hours - 12 : hours + 12;
      updateTime(newHours, minutes, seconds);
    }
  };

  // Clock configuration
  const CLOCK_SIZE = 180;
  const CENTER = CLOCK_SIZE / 2;
  const CLOCK_RADIUS = CENTER - 5;
  const NUMBER_RADIUS = CENTER - 24;
  const HOUR_HAND_LENGTH = CENTER - 44;
  const MINUTE_HAND_LENGTH = CENTER - 36;
  const CIRCLE_RADIUS = 15;

  const renderClockFace = () => {
    if (activeSelection === 'hour') {
      return (
        <View style={[timePickerStyles.clockContainer, { position: 'relative' }]}>
          <Svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={timePickerStyles.clockSvg}>
            {/* Clock face */}
            <Circle 
              cx={CENTER} 
              cy={CENTER} 
              r={CLOCK_RADIUS} 
              fill="#f9fafb" 
              stroke="#e5e7eb" 
              strokeWidth="2"
            />
            
            {/* Hour hand pointing to selected hour */}
            {(() => {
              const selectedHour = mode === '12h' ? displayHours : hours;
              const hourFor12Clock = selectedHour === 12 ? 0 : selectedHour;
              const hourAngle = (hourFor12Clock * 30) - 90;
              const handX = CENTER + HOUR_HAND_LENGTH * Math.cos(hourAngle * Math.PI / 180);
              const handY = CENTER + HOUR_HAND_LENGTH * Math.sin(hourAngle * Math.PI / 180);
              
              return (
                <Line
                  x1={CENTER}
                  y1={CENTER}
                  x2={handX}
                  y2={handY}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })()}
            
            {/* Center dot */}
            <Circle cx={CENTER} cy={CENTER} r="4" fill="#3b82f6"/>
          </Svg>
          
          {/* TouchableOpacity buttons for hour numbers */}
          {[...Array(12)].map((_, i) => {
            const hour = i === 0 ? 12 : i;
            const angle = (i * 30) - 90;
            const x = CENTER + NUMBER_RADIUS * Math.cos(angle * Math.PI / 180);
            const y = CENTER + NUMBER_RADIUS * Math.sin(angle * Math.PI / 180);
            const isSelected = (mode === '12h' ? displayHours : hours) === (hour === 12 ? (mode === '12h' ? 12 : 0) : hour);
            
            return (
              <TouchableOpacity
                key={`touch-${i}`}
                onPress={() => !disabled && handleHourClick(hour)}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  left: x - CIRCLE_RADIUS,
                  top: y - CIRCLE_RADIUS,
                  width: CIRCLE_RADIUS * 2,
                  height: CIRCLE_RADIUS * 2,
                  borderRadius: CIRCLE_RADIUS,
                  backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                  borderWidth: 1,
                  borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isSelected ? '#ffffff' : '#374151',
                  textAlign: 'center',
                }}>
                  {hour}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else {
      // Minute selection clock
      return (
        <View style={[timePickerStyles.clockContainer, { position: 'relative' }]}>
          <Svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={timePickerStyles.clockSvg}>
            {/* Clock face */}
            <Circle 
              cx={CENTER} 
              cy={CENTER} 
              r={CLOCK_RADIUS} 
              fill="#f9fafb" 
              stroke="#e5e7eb" 
              strokeWidth="2"
            />
            
            {/* Minute hand */}
            {(() => {
              const minuteAngle = (minutes * 6) - 90;
              const handX = CENTER + MINUTE_HAND_LENGTH * Math.cos(minuteAngle * Math.PI / 180);
              const handY = CENTER + MINUTE_HAND_LENGTH * Math.sin(minuteAngle * Math.PI / 180);
              
              return (
                <Line
                  x1={CENTER}
                  y1={CENTER}
                  x2={handX}
                  y2={handY}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })()}
            
            {/* Center dot */}
            <Circle cx={CENTER} cy={CENTER} r="4" fill="#3b82f6"/>
          </Svg>
          
          {/* TouchableOpacity buttons for minute numbers */}
          {[...Array(12)].map((_, i) => {
            const minute = i * 5;
            const angle = (i * 30) - 90;
            const x = CENTER + NUMBER_RADIUS * Math.cos(angle * Math.PI / 180);
            const y = CENTER + NUMBER_RADIUS * Math.sin(angle * Math.PI / 180);
            const isSelected = Math.floor(minutes / 5) * 5 === minute;
            
            return (
              <TouchableOpacity
                key={`touch-${i}`}
                onPress={() => !disabled && handleMinuteClick(minute)}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  left: x - CIRCLE_RADIUS,
                  top: y - CIRCLE_RADIUS,
                  width: CIRCLE_RADIUS * 2,
                  height: CIRCLE_RADIUS * 2,
                  borderRadius: CIRCLE_RADIUS,
                  backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                  borderWidth: 1,
                  borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isSelected ? '#ffffff' : '#374151',
                  textAlign: 'center',
                }}>
                  {String(minute).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
  };

  timePickerStyles.useVariants({});

  return (
    <View style={[timePickerStyles.container, style]} testID={testID}>
      {/* Tab bar for switching between hour and minute */}
      <View style={timePickerStyles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveSelection('hour')}
          disabled={disabled}
          style={[
            timePickerStyles.tabButton,
            activeSelection === 'hour' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
          ]}
        >
          <Text style={{ 
            color: activeSelection === 'hour' ? '#3b82f6' : '#6b7280',
            fontSize: 13,
            fontWeight: '500'
          }}>
            Hour
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveSelection('minute')}
          disabled={disabled}
          style={[
            timePickerStyles.tabButton,
            activeSelection === 'minute' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab
          ]}
        >
          <Text style={{ 
            color: activeSelection === 'minute' ? '#3b82f6' : '#6b7280',
            fontSize: 13,
            fontWeight: '500'
          }}>
            Minute
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clock face */}
      {renderClockFace()}

      {/* Digital time display */}
      <View style={timePickerStyles.timeInputRow}>
        <TouchableOpacity
          onPress={() => setActiveSelection('hour')}
          disabled={disabled}
          style={[
            timePickerStyles.timeInput,
            activeSelection === 'hour' && timePickerStyles.activeInput
          ]}
        >
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600',
            color: activeSelection === 'hour' ? '#3b82f6' : '#111827',
            textAlign: 'center'
          }}>
            {String(displayHours).padStart(2, '0')}
          </Text>
        </TouchableOpacity>
        
        <Text style={timePickerStyles.timeSeparator}>:</Text>
        
        <TouchableOpacity
          onPress={() => setActiveSelection('minute')}
          disabled={disabled}
          style={[
            timePickerStyles.timeInput,
            activeSelection === 'minute' && timePickerStyles.activeInput
          ]}
        >
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600',
            color: activeSelection === 'minute' ? '#3b82f6' : '#111827',
            textAlign: 'center'
          }}>
            {String(minutes).padStart(2, '0')}
          </Text>
        </TouchableOpacity>

        {showSeconds && (
          <>
            <Text style={timePickerStyles.timeSeparator}>:</Text>
            <View style={timePickerStyles.timeInput}>
              <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                {String(seconds).padStart(2, '0')}
              </Text>
            </View>
          </>
        )}

        {mode === '12h' && ampm && (
          <Button
            variant="outlined"
            size="small"
            onPress={toggleAmPm}
            disabled={disabled}
            style={timePickerStyles.ampmButton}
          >
            {ampm}
          </Button>
        )}
      </View>
    </View>
  );
};