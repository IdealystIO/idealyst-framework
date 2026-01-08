import React from 'react';
import MdiIcon from '@mdi/react';

/**
 * Internal component for rendering SVG icons directly from MDI paths.
 * The path prop should be provided by the Babel plugin transformation.
 */
interface IconSvgProps {
  path?: string;
  size?: string | number;
  color?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({
  path,
  size = '1em',
  color = 'currentColor',
  style,
  'aria-label': ariaLabel,
}) => {
  return (
    <MdiIcon
      style={style}
      path={path}
      size={size}
      color={color}
      aria-label={ariaLabel}
    />
  );
};

export default IconSvg;
