import React from 'react';
import MdiIcon from '@mdi/react';

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
  style?: React.CSSProperties;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({
  path,
  size,
  color = 'currentColor',
  style,
  'aria-label': ariaLabel,
  'data-testid': testID,
}) => {
  // Don't use the size prop - let CSS handle dimensions entirely through style
  // This gives us full control and avoids MdiIcon's size prop (which is a multiplier)
  return (
    <MdiIcon
      path={path}
      size={1}
      color={color}
      style={style}
      aria-label={ariaLabel}
      data-testid={testID}
    />
  );
};

export default IconSvg;
