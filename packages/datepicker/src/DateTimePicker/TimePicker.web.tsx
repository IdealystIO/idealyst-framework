import React, { useState, useEffect } from 'react';
import { Button } from '@idealyst/components';
import { TimePickerProps } from './types';

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
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const seconds = value.getSeconds();

  const displayHours = mode === '12h' ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;
  const ampm = mode === '12h' ? (hours >= 12 ? 'PM' : 'AM') : null;

  // Sync input values when time changes from external sources (like clock clicks)
  // Only update if the input is not currently focused
  useEffect(() => {
    if (activeSelection !== 'hour') {
      setHourInputValue(String(displayHours));
    }
    if (activeSelection !== 'minute') {
      setMinuteInputValue(String(minutes).padStart(2, '0'));
    }
  }, [displayHours, minutes, activeSelection]);

  const updateTime = (newHours: number, newMinutes: number, newSeconds?: number) => {
    const newDate = new Date(value);
    newDate.setHours(newHours, newMinutes, newSeconds || 0);
    onChange(newDate);
  };

  const handleHourChange = (delta: number) => {
    let newHours = hours + delta;
    if (mode === '12h') {
      if (newHours < 0) newHours = 23;
      if (newHours > 23) newHours = 0;
    } else {
      if (newHours < 0) newHours = 23;
      if (newHours > 23) newHours = 0;
    }
    updateTime(newHours, minutes, seconds);
  };

  const handleMinuteChange = (delta: number) => {
    let newMinutes = minutes + (delta * step);
    let newHours = hours;
    
    if (newMinutes < 0) {
      newMinutes = 60 + newMinutes;
      newHours = hours - 1;
      if (newHours < 0) newHours = 23;
    } else if (newMinutes >= 60) {
      newMinutes = newMinutes - 60;
      newHours = hours + 1;
      if (newHours > 23) newHours = 0;
    }
    
    updateTime(newHours, newMinutes, seconds);
  };

  const handleSecondChange = (delta: number) => {
    let newSeconds = seconds + delta;
    let newMinutes = minutes;
    let newHours = hours;
    
    if (newSeconds < 0) {
      newSeconds = 59;
      newMinutes = minutes - 1;
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours = hours - 1;
        if (newHours < 0) newHours = 23;
      }
    } else if (newSeconds >= 60) {
      newSeconds = 0;
      newMinutes = minutes + 1;
      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours = hours + 1;
        if (newHours > 23) newHours = 0;
      }
    }
    
    updateTime(newHours, newMinutes, newSeconds);
  };

  const toggleAmPm = () => {
    if (mode === '12h') {
      const newHours = hours >= 12 ? hours - 12 : hours + 12;
      updateTime(newHours, minutes, seconds);
    }
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

  const renderClockFace = () => {
    // Clock configuration
    const CLOCK_SIZE = 180;
    const CENTER = CLOCK_SIZE / 2;
    const CLOCK_RADIUS = CENTER - 5;
    const NUMBER_RADIUS = CENTER - 24;
    const HOUR_HAND_LENGTH = CENTER - 44;
    const MINUTE_HAND_LENGTH = CENTER - 36;
    const CIRCLE_RADIUS = 15;

    if (activeSelection === 'hour') {
      return (
        <div style={timePickerStyles.clockContainer}>
          <svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={timePickerStyles.clockSvg}>
            {/* Clock face */}
            <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2"/>
            
            {/* Hour numbers - clickable */}
            {[...Array(12)].map((_, i) => {
              const hour = i === 0 ? 12 : i;
              const angle = (i * 30) - 90;
              const x = CENTER + NUMBER_RADIUS * Math.cos(angle * Math.PI / 180);
              const y = CENTER + NUMBER_RADIUS * Math.sin(angle * Math.PI / 180);
              const isSelected = (mode === '12h' ? displayHours : hours) === (hour === 12 ? 0 : hour);
              
              return (
                <g key={i} onClick={() => handleHourClick(hour)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={CIRCLE_RADIUS}
                    fill={isSelected ? '#3b82f6' : 'transparent'}
                    stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                    strokeWidth="1"
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="14"
                    fill={isSelected ? '#ffffff' : '#374151'}
                    fontWeight="500"
                    style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {hour}
                  </text>
                </g>
              );
            })}
            
            {/* Hour hand pointing to selected hour */}
            {(() => {
              const selectedHour = mode === '12h' ? displayHours : hours;
              // Convert 12 to 0 for angle calculation, but keep others as-is
              const hourFor12Clock = selectedHour === 12 ? 0 : selectedHour;
              const hourAngle = (hourFor12Clock * 30) - 90;
              const handX = CENTER + HOUR_HAND_LENGTH * Math.cos(hourAngle * Math.PI / 180);
              const handY = CENTER + HOUR_HAND_LENGTH * Math.sin(hourAngle * Math.PI / 180);
              
              return (
                <line
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
            <circle cx={CENTER} cy={CENTER} r="4" fill="#3b82f6"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div style={timePickerStyles.clockContainer}>
          <svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={timePickerStyles.clockSvg}>
            {/* Clock face */}
            <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2"/>
            
            {/* Minute markers - every 5 minutes */}
            {[...Array(12)].map((_, i) => {
              const minute = i * 5;
              const angle = (i * 30) - 90;
              const x = CENTER + NUMBER_RADIUS * Math.cos(angle * Math.PI / 180);
              const y = CENTER + NUMBER_RADIUS * Math.sin(angle * Math.PI / 180);
              const isSelected = Math.floor(minutes / 5) * 5 === minute;
              
              return (
                <g key={i} onClick={() => handleMinuteClick(minute)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={CIRCLE_RADIUS}
                    fill={isSelected ? '#3b82f6' : 'transparent'}
                    stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                    strokeWidth="1"
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fill={isSelected ? '#ffffff' : '#374151'}
                    fontWeight="500"
                    style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {minute.toString().padStart(2, '0')}
                  </text>
                </g>
              );
            })}
            
            {/* Minute hand pointing to selected minute */}
            {(() => {
              const minuteAngle = (minutes * 6) - 90;
              const handX = CENTER + MINUTE_HAND_LENGTH * Math.cos(minuteAngle * Math.PI / 180);
              const handY = CENTER + MINUTE_HAND_LENGTH * Math.sin(minuteAngle * Math.PI / 180);
              
              return (
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={handX}
                  y2={handY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })()}
            
            {/* Center dot */}
            <circle cx={CENTER} cy={CENTER} r="4" fill="#3b82f6"/>
          </svg>
        </div>
      );
    }
  };

  const timePickerStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: 4,
      width: 170,
      ...style,
    },
    clockContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    clockSvg: {
      cursor: 'pointer',
    },
    timeInputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    timeInput: {
      width: 32,
      height: 32,
      textAlign: 'center' as const,
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#111827',
      border: 'none',
      borderBottom: 'none',
      borderRadius: 0,
      outline: 'none',
      cursor: 'pointer',
      backgroundColor: 'transparent',
    },
    activeInput: {
      color: '#3b82f6',
      borderBottom: '2px solid #3b82f6',
      borderRadius: 0,
    },
    timeSeparator: {
      fontSize: 16,
      fontWeight: '300' as const,
      color: '#6b7280',
    },
    ampmButton: {
      padding: '4px 8px',
      borderRadius: 4,
      minWidth: 36,
      fontSize: 12,
      fontWeight: '600' as const,
    },
    tabBar: {
      display: 'flex',
      gap: 4,
      marginBottom: 4,
      padding: 2,
      backgroundColor: '#f3f4f6',
      borderRadius: 6,
    },
    tabButton: {
      flex: 1,
      padding: '6px 12px',
      fontSize: 13,
      fontWeight: '500' as const,
      borderRadius: 4,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    activeTab: {
      backgroundColor: '#ffffff',
      color: '#3b82f6',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    inactiveTab: {
      backgroundColor: 'transparent',
      color: '#6b7280',
    },
  };
  
  return (
    <div style={timePickerStyles.container} data-testid={testID}>
      {/* Tab Bar */}
      <div style={timePickerStyles.tabBar}>
        <button
          onClick={() => setActiveSelection('hour')}
          style={{
            ...timePickerStyles.tabButton,
            ...(activeSelection === 'hour' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab)
          }}
          disabled={disabled}
        >
          Hour
        </button>
        <button
          onClick={() => setActiveSelection('minute')}
          style={{
            ...timePickerStyles.tabButton,
            ...(activeSelection === 'minute' ? timePickerStyles.activeTab : timePickerStyles.inactiveTab)
          }}
          disabled={disabled}
        >
          Minute
        </button>
      </div>

      {/* Interactive Clock Face */}
      {renderClockFace()}

      {/* Time Input Row */}
      <div style={timePickerStyles.timeInputRow}>
        <input
          type="text"
          value={hourInputValue}
          onChange={(e) => {
            const value = e.target.value;
            setHourInputValue(value);
            
            // Smart focus switching: if user types 2 or higher, focus on minutes
            const num = parseInt(value);
            if (!isNaN(num) && num >= 2 && mode === '12h') {
              // Wait a moment then focus minutes
              setTimeout(() => {
                setActiveSelection('minute');
                const minuteInput = document.querySelector('input[type="text"]:nth-of-type(2)') as HTMLInputElement;
                if (minuteInput) {
                  minuteInput.focus();
                }
              }, 100);
            }
            
            // Try to update time if value is valid
            const hour = parseInt(value);
            if (!isNaN(hour)) {
              const maxHour = mode === '12h' ? 12 : 23;
              const minHour = mode === '12h' ? 1 : 0;
              
              if (hour >= minHour && hour <= maxHour) {
                let hour24 = hour;
                if (mode === '12h') {
                  const isPM = hours >= 12;
                  if (hour === 12) hour24 = isPM ? 12 : 0;
                  else hour24 = isPM ? hour + 12 : hour;
                }
                updateTime(hour24, minutes, seconds);
              }
            }
          }}
          onFocus={() => {
            setActiveSelection('hour');
            setHourInputValue(String(displayHours));
          }}
          onBlur={() => {
            // Handle 0 -> 12 conversion for 12h mode
            const hour = parseInt(hourInputValue);
            if (hour === 0 && mode === '12h') {
              const isPM = hours >= 12;
              const hour24 = isPM ? 12 : 0;
              updateTime(hour24, minutes, seconds);
            }
            setHourInputValue(String(displayHours));
          }}
          style={{
            ...timePickerStyles.timeInput,
            ...(activeSelection === 'hour' ? timePickerStyles.activeInput : {})
          }}
          disabled={disabled}
        />
        <div style={timePickerStyles.timeSeparator}>:</div>
        <input
          type="text"
          value={minuteInputValue}
          onChange={(e) => {
            const value = e.target.value;
            setMinuteInputValue(value);
            
            // Try to update time if value is valid
            const minute = parseInt(value);
            if (!isNaN(minute)) {
              if (minute >= 0 && minute <= 59) {
                updateTime(hours, minute, seconds);
              }
            }
          }}
          onFocus={() => {
            setActiveSelection('minute');
            setMinuteInputValue(String(minutes));
          }}
          onBlur={() => {
            setMinuteInputValue(String(minutes).padStart(2, '0'));
          }}
          style={{
            ...timePickerStyles.timeInput,
            ...(activeSelection === 'minute' ? timePickerStyles.activeInput : {})
          }}
          disabled={disabled}
        />
        
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
      </div>
    </div>
  );
};