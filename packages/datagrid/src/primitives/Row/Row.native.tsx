import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface RowProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const Row: React.FC<RowProps> = ({ children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  return (
    <Wrapper 
      style={[{ flexDirection: 'row' }, style]}
      onPress={onPress}
    >
      {children}
    </Wrapper>
  );
};