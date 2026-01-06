import { forwardRef, useMemo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconProps } from './types';
import { iconStyles, buildIconSize } from './Icon.styles';
import { useUnistyles } from 'react-native-unistyles';

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
  const iconStyle = (iconStyles.icon as any)({ color, intent, size });

  const { theme } = useUnistyles();

  const iconSize = useMemo(() => {
    return buildIconSize(theme, size).width;
  }, [theme, size]);

  // Get fontSize from styles for numeric size prop

  return (
    <MaterialCommunityIcons
      ref={ref}
      nativeID={id}
      size={iconSize}
      name={name}
      style={[iconStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon; 