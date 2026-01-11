import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

interface CellProps {
  children: React.ReactNode;
  style?: any;
}

export const Cell: React.FC<CellProps> = ({ children, style }) => {
  // Handle function-based styles (Unistyles 3) with proper theme access
  let resolvedStyle = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style((UnistylesRuntime as any).theme);
    } catch (error) {
      console.warn('Error resolving Cell style:', error);
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = style;
  }
  
  const combinedStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'stretch',
    ...resolvedStyle,
  };
  
  return (
    <div style={combinedStyle}>
      {children}
    </div>
  );
};