import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

interface TableBodyProps {
  children: React.ReactNode;
  style?: any;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, style }) => {
  let resolvedStyle = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style((UnistylesRuntime as any).theme);
    } catch (error) {
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = style;
  }
  
  return (
    <tbody style={resolvedStyle}>
      {children}
    </tbody>
  );
};