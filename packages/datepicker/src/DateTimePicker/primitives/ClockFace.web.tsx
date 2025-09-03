import React from 'react';
import { View } from '@idealyst/components';
import { timePickerStyles } from '../TimePicker.styles';

interface ClockFaceProps {
  activeSelection: 'hour' | 'minute';
  hours: number;
  minutes: number;
  displayHours: number;
  mode: '12h' | '24h';
  disabled: boolean;
  onHourClick: (hour: number) => void;
  onMinuteClick: (minute: number) => void;
}

export const ClockFace: React.FC<ClockFaceProps> = ({
  activeSelection,
  hours,
  minutes,
  displayHours,
  mode,
  disabled,
  onHourClick,
  onMinuteClick,
}) => {
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
      <View style={timePickerStyles.clockContainer}>
        <svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={timePickerStyles.clockSvg}>
          {/* Clock face */}
          <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2"/>
          
          {/* Hour numbers - clickable */}
          {[...Array(12)].map((_, i) => {
            const hour = i === 0 ? 12 : i;
            const angle = (i * 30) - 90;
            const x = CENTER + NUMBER_RADIUS * Math.cos(angle * Math.PI / 180);
            const y = CENTER + NUMBER_RADIUS * Math.sin(angle * Math.PI / 180);
            const isSelected = (mode === '12h' ? displayHours : hours) === (hour === 12 ? (mode === '12h' ? 12 : 0) : hour);
            
            return (
              <g key={i} onClick={() => !disabled && onHourClick(hour)}>
                <circle
                  cx={x}
                  cy={y}
                  r={CIRCLE_RADIUS}
                  fill={isSelected ? '#3b82f6' : 'transparent'}
                  stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                  strokeWidth="1"
                  style={{ cursor: disabled ? 'default' : 'pointer' }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="14"
                  fill={isSelected ? '#ffffff' : '#374151'}
                  fontWeight="500"
                  style={{ cursor: disabled ? 'default' : 'pointer', userSelect: 'none', pointerEvents: 'none' }}
                >
                  {hour}
                </text>
              </g>
            );
          })}
          
          {/* Hour hand pointing to selected hour */}
          {(() => {
            const selectedHour = mode === '12h' ? displayHours : hours;
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
      </View>
    );
  } else {
    return (
      <View style={timePickerStyles.clockContainer}>
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
              <g key={i} onClick={() => !disabled && onMinuteClick(minute)}>
                <circle
                  cx={x}
                  cy={y}
                  r={CIRCLE_RADIUS}
                  fill={isSelected ? '#3b82f6' : 'transparent'}
                  stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                  strokeWidth="1"
                  style={{ cursor: disabled ? 'default' : 'pointer' }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill={isSelected ? '#ffffff' : '#374151'}
                  fontWeight="500"
                  style={{ cursor: disabled ? 'default' : 'pointer', userSelect: 'none', pointerEvents: 'none' }}
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
      </View>
    );
  }
};