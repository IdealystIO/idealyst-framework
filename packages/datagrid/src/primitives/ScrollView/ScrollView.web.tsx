import React from 'react';
import { View } from '@idealyst/components';

interface ScrollViewProps {
  children: React.ReactNode;
  horizontal?: boolean;
  style?: any;
  contentContainerStyle?: any;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  children,
  horizontal = false,
  style,
  contentContainerStyle,
  onScroll,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
  scrollEventThrottle: _scrollEventThrottle, // native property
  bounces: _bounces, // native property
  directionalLockEnabled: _directionalLockEnabled, // native property
  ...props
}) => {
  const scrollStyle = {
    ...style,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...(horizontal && { overflowY: 'hidden', overflowX: 'auto' }),
    ...(!showsHorizontalScrollIndicator && { scrollbarWidth: 'none', msOverflowStyle: 'none' }),
    ...(!showsVerticalScrollIndicator && { scrollbarWidth: 'none', msOverflowStyle: 'none' }),
  };

  return (
    <div 
      style={scrollStyle} 
      onScroll={onScroll}
      {...props}
    >
      <View style={contentContainerStyle}>
        {children}
      </View>
    </div>
  );
};