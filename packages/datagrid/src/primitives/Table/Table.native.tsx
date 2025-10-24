import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
  
  return (
    <View style={[
      { flex: 1 },
      resolvedStyle,
      // If width is specified, don't flex
      resolvedStyle?.width ? { flex: 0 } : {}
    ]}>
      {children}
    </View>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
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
  
  // Ensure flexDirection is always 'row' - force it with !important-like behavior
  const finalStyle = [resolvedStyle, { flexDirection: 'row', display: 'flex' }];
  
  return (
    <Wrapper 
      style={finalStyle}
      onPress={onPress}
    >
      {children}
    </Wrapper>
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
  const flexValue = colSpan ? colSpan : 1;
  const Wrapper = onPress ? TouchableOpacity : View;

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

  const combinedStyle = [
    { justifyContent: 'center' },
    width ? { width, flex: 0 } : { flex: flexValue },
    resolvedStyle
  ];

  return (
    <Wrapper style={combinedStyle} onPress={onPress}>
      {children}
    </Wrapper>
  );
};