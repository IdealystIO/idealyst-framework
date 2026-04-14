import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import type { Theme } from '@idealyst/theme';
import { BadgeProps } from './types';
import { badgeStyles, resolveBadgeColor } from './Badge.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Small status indicator for counts, labels, or notifications.
 * Available in filled, outlined, and dot variants with customizable colors.
 */
const Badge = forwardRef<IdealystElement, BadgeProps>((props, ref) => {
  const {
    children,
    size = 'md',
    type: typeProp,
    variant,
    intent = 'primary',
    color,
    icon,
    style,
    testID,
    id,
  } = props;

  const type = variant ?? typeProp ?? 'filled';
  const { theme } = useUnistyles() as { theme: Theme };

  badgeStyles.useVariants({ size, type, intent });

  // Resolve color prop overrides (only when color is set without explicit intent)
  const colorStyles = color && !props.intent
    ? resolveBadgeColor(theme, color, type)
    : null;

  const badgeProps = getWebProps([badgeStyles.badge as any]);
  const contentProps = getWebProps([badgeStyles.content as any]);
  const textProps = getWebProps([badgeStyles.text as any]);

  // Icon size from theme config
  const iconSize = theme.sizes.badge[size].iconSize as number;

  const renderIcon = (iconProp: typeof icon) => {
    if (typeof iconProp === 'string') {
      return (
        <IconSvg
          name={iconProp}
          size={iconSize}
          color={colorStyles?.iconColor ?? 'currentColor'}
          aria-label={iconProp}
        />
      );
    } else if (isValidElement(iconProp)) {
      return iconProp;
    }
    return null;
  };

  const mergedRef = useMergeRefs(ref, badgeProps.ref);
  const flatStyle = flattenStyle(style);
  const badgeStyle = colorStyles
    ? { ...flatStyle, ...colorStyles.badge }
    : flatStyle;

  if (type === 'dot') {
    return (
      <span
        {...badgeProps}
        style={badgeStyle as any}
        ref={mergedRef}
        id={id}
        data-testid={testID}
        role="status"
        aria-label="status indicator"
      />
    );
  }

  const hasIcon = !!icon;
  const hasChildren = !!children;

  return (
    <span
      {...badgeProps}
      style={badgeStyle as any}
      ref={mergedRef}
      id={id}
      data-testid={testID}
      role="status"
    >
      {hasIcon && hasChildren ? (
        <span {...contentProps}>
          {renderIcon(icon)}
          <span {...textProps} style={colorStyles?.text as any}>
            {children}
          </span>
        </span>
      ) : hasIcon ? (
        renderIcon(icon)
      ) : (
        <span {...textProps} style={colorStyles?.text as any}>
          {children}
        </span>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
