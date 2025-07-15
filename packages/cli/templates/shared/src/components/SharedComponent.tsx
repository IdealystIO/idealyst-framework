import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@idealyst/theme';

export interface SharedComponentProps {
  title: string;
  description?: string;
}

const SharedComponent: React.FC<SharedComponentProps> = ({ title, description }) => {
  const { theme } = useTheme();

  return (
    <View style={{ 
      padding: 16, 
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 16
    }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8
      }}>
        {title}
      </Text>
      {description && (
        <Text style={{ 
          fontSize: 14,
          color: theme.colors.textSecondary,
          lineHeight: 20
        }}>
          {description}
        </Text>
      )}
    </View>
  );
};

export default SharedComponent; 