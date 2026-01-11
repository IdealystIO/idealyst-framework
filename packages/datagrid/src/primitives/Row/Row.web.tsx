import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

interface RowProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const Row: React.FC<RowProps> = ({ children, style, onPress }) => {
  // Handle function-based styles (Unistyles 3) with proper theme access
  let resolvedStyle = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style((UnistylesRuntime as any).theme);
    } catch (error) {
      console.warn('Error resolving Row style:', error);
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = style;
  }
  
  const combinedStyle = {
    display: 'flex',
    flexDirection: 'row' as const,
    width: '100%',
    boxSizing: 'border-box' as const,
    ...resolvedStyle,
  };
  
  return (
    <div 
      style={combinedStyle} 
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
      onKeyDown={onPress ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};