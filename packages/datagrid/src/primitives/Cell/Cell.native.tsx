import React from 'react';
import { View } from 'react-native';

interface CellProps {
  children: React.ReactNode;
  style?: any;
}

export const Cell: React.FC<CellProps> = ({ children, style }) => {
  return (
    <View style={[{ justifyContent: 'center' }, style]}>
      {children}
    </View>
  );
};