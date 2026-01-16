import { forwardRef, useMemo } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { IconProps } from './types';
import { iconStyles } from './Icon.styles';
import type { IdealystElement } from '../utils/refTypes';

const Icon = forwardRef<IdealystElement, IconProps>(({
  name,
  size = 'md',
  color,
  textColor,
  intent,
  style,
  testID,
  accessibilityLabel,
  id,
}: IconProps, ref) => {
  // Call dynamic style with variants - includes theme-reactive color
  const iconStyle = (iconStyles.icon as any)({ color, textColor, intent, size });

  const iconSize = useMemo(() => {
    return iconStyle.width;
  }, [iconStyle]);

  // Extract color from iconStyle for explicit color prop (RN vector icons need this)
  const iconColor = iconStyle.color;

  return (
    <MaterialDesignIcons
      ref={ref as any}
      nativeID={id}
      size={iconSize}
      name={name}
      color={iconColor}
      style={[iconStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon; 