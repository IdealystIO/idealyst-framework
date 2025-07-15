import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconProps } from './types';
import iconStyles from './Icon.styles';

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  style,
  testID,
  accessibilityLabel,
}: IconProps) => {
  
  // Use Unistyles v3 with color and size variants
  const styles = iconStyles.useVariants({ color, size });
  
  // Map size variants to pixel values
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };
  const iconSize = sizeMap[size];
  
  return (
    <MaterialCommunityIcons
      name={name}
      size={iconSize}
      style={[styles.icon, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default Icon; 