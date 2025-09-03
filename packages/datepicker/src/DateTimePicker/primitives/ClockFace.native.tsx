import React from 'react';
import { View, Text } from '@idealyst/components';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
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
              onPressIn={() => !disabled && onHourClick(hour)}
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
              onPressIn={() => !disabled && onMinuteClick(minute)}
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