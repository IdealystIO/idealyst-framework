import React, { forwardRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconProps } from './types';
import { iconStyles } from './Icon.styles';

const Icon = forwardRef<any, IconProps>(({
  name,
  size = 'md',
  color,
  intent,
  style,
  testID,
  accessibilityLabel,
}: IconProps, ref) => {

  // Use Unistyles v3 with color and size variants
  iconStyles.useVariants({ color, size, intent });

  // Call dynamic style with variants
  const iconStyle = iconStyles.icon({ color, intent });

  // Get fontSize from styles for numeric size prop
  const iconSize = typeof size === 'number' ? size : iconStyle.fontSize;

  return (
    <MaterialCommunityIcons
      ref={ref}
      name={name}
      size={iconSize}
      style={[iconStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon; 