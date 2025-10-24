import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

interface TableProps {
  children: React.ReactNode;
  style?: any;
}

export const Table: React.FC<TableProps> = ({ children, style }) => {
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
  
  const combinedStyle = {
    width: '100%',
    tableLayout: 'fixed' as const,
    borderCollapse: 'separate' as const,
    borderSpacing: 0,
    ...resolvedStyle,
  };
  
  return (
    <table style={combinedStyle}>
      {children}
    </table>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, style, onPress }) => {
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
    <tr 
      style={resolvedStyle}
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
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  style?: any;
  width?: number | string;
  colSpan?: number;
  onPress?: () => void;
}

export const TableCell: React.FC<TableCellProps> = ({ children, style, width, colSpan, onPress }) => {
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

  const combinedStyle = {
    verticalAlign: 'middle',
    ...(width && { width }),
    ...resolvedStyle,
  };

  return (
    <td
      style={combinedStyle}
      colSpan={colSpan}
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
    </td>
  );
};