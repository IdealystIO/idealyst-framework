import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { flattenStyle } from '../../flattenStyle';

interface TableProps {
  children: React.ReactNode;
  style?: any;
}

export const Table: React.FC<TableProps> = ({ children, style }) => {
  let resolvedStyle: React.CSSProperties = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style((UnistylesRuntime as any).theme);
    } catch (error) {
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = flattenStyle(style);
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
  let resolvedStyle: React.CSSProperties = {};
  if (typeof style === 'function') {
    try {
      resolvedStyle = style((UnistylesRuntime as any).theme);
    } catch (error) {
      resolvedStyle = {};
    }
  } else if (style) {
    resolvedStyle = flattenStyle(style);
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

  const combinedStyle = {
    verticalAlign: 'middle',
    ...(width && { width }),
    ...flattenStyle(style),
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