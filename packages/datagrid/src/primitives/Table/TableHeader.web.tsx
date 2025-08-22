import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

interface TableHeaderProps {
  children: React.ReactNode;
  style?: any;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, style }) => {
  let resolvedStyle = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style(UnistylesRuntime.theme);
    } catch (error) {
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = style;
  }
  
  return (
    <thead style={resolvedStyle}>
      {children}
    </thead>
  );
};