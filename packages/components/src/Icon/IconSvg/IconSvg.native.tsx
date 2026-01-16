import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { IdealystElement } from '../../utils/refTypes';

/**
 * Internal component for rendering SVG icons directly from MDI paths.
 * This is used internally by components like Button, Badge, etc. to render icons
 * without going through the full Icon component.
 *
 * The path prop should be provided by the Babel plugin transformation.
 */
interface IconSvgProps {
  path?: string; // MDI icon path, provided by Babel plugin
  size?: string | number;
  color?: string;
  style?: any;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const IconSvg = React.forwardRef<IdealystElement, IconSvgProps>(({
  path,
  size = 24,
  color = 'currentColor',
  style,
  'data-testid': testID,
}, ref) => {
  // Convert size to number if it's a string
  const sizeNum = typeof size === 'string' ? parseFloat(size) : size;

  return (
    <View ref={ref as any} style={[{ width: sizeNum, height: sizeNum }, style]} testID={testID}>
      <Svg viewBox="0 0 24 24" width={sizeNum} height={sizeNum}>
        <Path d={path} fill={color} />
      </Svg>
    </View>
  );
});

IconSvg.displayName = 'IconSvg';

export default IconSvg;
