import React, { forwardRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconProps } from './types';
import iconStyles from './Icon.styles';

const Icon = forwardRef<any, IconProps>(({
  name,
  size = 'md',
  color,
  style,
  testID,
  accessibilityLabel,
}: IconProps, ref) => {

  // Use Unistyles v3 with color and size variants
  iconStyles.useVariants({ color, size });

  // Get fontSize from styles for numeric size prop
  const iconSize = typeof size === 'number' ? size : iconStyles.icon.fontSize;

  return (
    <MaterialCommunityIcons
      ref={ref}
      name={name}
      size={iconSize}
      style={[iconStyles.icon, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon; 