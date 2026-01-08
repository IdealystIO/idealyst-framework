import React, { forwardRef } from 'react';
import MdiIcon from '@mdi/react';
import { IconProps } from './types';
import { iconStyles } from './Icon.styles';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getColorFromString, Intent, Color } from '@idealyst/theme';

// Internal props that include the transformed path from Babel plugin
interface InternalIconProps extends IconProps {
  path?: string; // Added by Babel plugin transformation
}

const Icon = forwardRef<HTMLSpanElement, IconProps>((props: InternalIconProps, ref) => {
  const {
    name,
    size = 'md',
    color,
    intent,
    style,
    testID,
    accessibilityLabel,
    id,
    ...restProps
  } = props;

  const { theme } = useUnistyles();

  // Check if we have a path prop (from Babel plugin transformation)
  const { path } = restProps as { path?: string };

  // Compute size from theme
  let iconSize: number;
  if (typeof size === 'number') {
    iconSize = size;
  } else {
    const themeSize = theme.sizes.icon[size as keyof typeof theme.sizes.icon];
    iconSize = typeof themeSize === 'number' ? themeSize : (themeSize?.width ?? 24);
  }

  // Compute color from intent or color prop or default
  const iconColor = intent
    ? theme.intents[intent as Intent]?.primary
    : color
      ? getColorFromString(theme, color as Color)
      : theme.colors.text.primary;

  // Use getWebProps for className generation but override with computed values
  const iconStyle = (iconStyles.icon as any)({ intent, color, size });
  const iconProps = getWebProps([iconStyle, style]);

  const mergedRef = useMergeRefs(ref, iconProps.ref);

  // Use MDI React icon when path is provided (transformed by Babel plugin)
  return (
    <span
      {...iconProps}
      ref={mergedRef}
      id={id}
      style={{
        ...iconProps.style,
        fontSize: iconSize,
        width: '1em',
        height: '1em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        lineHeight: 1,
        color: iconColor,
      }}
    >
      <MdiIcon
        path={path}
        size="1em"
        color="currentColor"
        data-testid={testID}
        aria-label={accessibilityLabel || name}
      />
    </span>
  );
});

Icon.displayName = 'Icon';

export default Icon; 