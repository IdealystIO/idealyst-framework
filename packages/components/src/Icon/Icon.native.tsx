import { forwardRef } from 'react';
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
  id,
}: IconProps, ref) => {


  // Call dynamic style with variants
  const iconStyle = iconStyles.icon({ color, intent, size });

  // Get fontSize from styles for numeric size prop

  return (
    <MaterialCommunityIcons
      ref={ref}
      nativeID={id}
      name={name}
      style={[iconStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon; 