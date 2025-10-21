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
  iconStyles.useVariants({ color, size });

  // Get fontSize from styles for numeric size prop
  const iconSize = typeof size === 'number' ? size : iconStyles.icon.fontSize;

  return (
    <MaterialCommunityIcons
      name={name}
      size={iconSize}
      style={[iconStyles.icon, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default Icon; 