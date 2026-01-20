import React from 'react';
import MdiIcon from '@mdi/react';
import { IconRegistry } from '../IconRegistry';

/**
 * Internal component for rendering SVG icons from the icon registry.
 * This is used internally by components like Button, Badge, etc. to render icons
 * without going through the full Icon component.
 *
 * Icons are looked up from the registry by name. The registry is populated
 * at build time by the Babel plugin.
 */
interface IconSvgProps {
  /** Icon name in canonical format (e.g., "home", "account-circle") */
  name: string;
  size?: string | number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({
  name,
  size = '1em',
  color = 'currentColor',
  style,
  className,
  'aria-label': ariaLabel,
  'data-testid': testID,
  ...rest
}) => {
  // Look up path from registry
  const path = IconRegistry.get(name);

  // Convert numeric size to pixel string to prevent @mdi/react from
  // treating it as a multiplier of the base 24px size
  const normalizedSize = typeof size === 'number' ? `${size}px` : size;

  // Warn in development if icon is not registered
  if (!path && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[IconSvg] Icon "${name}" is not registered. ` +
      `Add it to the 'icons' array in your babel config.`
    );
  }

  if (!path) {
    return null;
  }

  return (
    <MdiIcon
      style={style}
      className={className}
      path={path}
      size={normalizedSize}
      color={color}
      aria-label={ariaLabel || name}
      data-testid={testID}
      {...rest}
    />
  );
};

export default IconSvg;
