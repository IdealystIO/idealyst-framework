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
  size = '1em',
  color = 'currentColor',
  style,
  'aria-label': ariaLabel,
  'data-testid': testID,
  ...rest
}) => {
  return (
    <MdiIcon
      style={style}
      path={path}
      size={size}
      color={color}
      aria-label={ariaLabel}
      data-testid={testID}
      {...rest}
    />
  );
};

export default IconSvg;
