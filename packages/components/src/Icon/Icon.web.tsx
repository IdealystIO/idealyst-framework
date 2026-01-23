import { forwardRef } from 'react';
import MdiIcon from '@mdi/react';
import { IconProps } from './types';
import { iconStyles } from './Icon.styles';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getColorFromString, Intent, Color, Text } from '@idealyst/theme';
import { IconRegistry } from './IconRegistry';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Vector icon display from the Material Design Icons library.
 * Supports intent-based coloring and theme-aware sizing.
 */
const Icon = forwardRef<IdealystElement, IconProps>((props, ref) => {
  const {
    name,
    size = 'md',
    color,
    textColor,
    intent,
    style,
    testID,
    accessibilityLabel,
    id,
  } = props;

  const { theme } = useUnistyles();

  // Look up the icon path from the registry
  const path = IconRegistry.get(name);

  // Warn in development if icon is not registered
  if (!path && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Icon] Icon "${name}" is not registered. ` +
      `Add it to the 'icons' array in your babel config, or ensure it's used in a way that static analysis can detect.`
    );
  }

  // Compute size from theme
  let iconSize: number;
  if (typeof size === 'number') {
    iconSize = size;
  } else {
    const themeSize = theme.sizes.icon[size as keyof typeof theme.sizes.icon];
    const rawSize = typeof themeSize === 'number' ? themeSize : themeSize?.width;
    iconSize = typeof rawSize === 'number' ? rawSize : 24;
  }

  // Compute color - priority: intent > color > textColor > default
  // color takes precedence over textColor (as per design)
  const iconColor = intent
    ? theme.intents[intent as Intent]?.primary
    : color
      ? getColorFromString(theme, color as Color)
      : textColor
        ? theme.colors.text[textColor as Text]
        : theme.colors.text.primary;

  // Use getWebProps for className generation but override with computed values
  const iconStyle = (iconStyles.icon as any)({ intent, color, textColor, size });
  const iconProps = getWebProps([iconStyle, flattenStyle(style)]);

  const mergedRef = useMergeRefs(ref, iconProps.ref);

  return (
    <span
      {...iconProps}
      ref={mergedRef}
      id={id}
      style={{
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
      {path && (
        <MdiIcon
          path={path}
          size="1em"
          color="currentColor"
          data-testid={testID}
          aria-label={accessibilityLabel || name}
        />
      )}
    </span>
  );
});

Icon.displayName = 'Icon';

export default Icon;
