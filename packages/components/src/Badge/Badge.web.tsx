import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Small status indicator for counts, labels, or notifications.
 * Available in filled, outlined, and dot variants with customizable colors.
 *
 * Supports both `intent` (semantic colors) and `color` (raw palette colors).
 * If both are provided, `intent` takes precedence.
 */
const Badge = forwardRef<IdealystElement, BadgeProps>((props, ref) => {
  const {
    children,
    size = 'md',
    type: typeProp,
    variant,
    intent,
    color,
    icon,
    style,
    testID,
    id,
  } = props;

  // variant is an alias for type - variant takes precedence if both are set
  const type = variant ?? typeProp ?? 'filled';

  // Default to 'primary' intent if neither intent nor color is provided
  const effectiveColor = intent ? undefined : (color ?? 'primary');

  badgeStyles.useVariants({
    size,
    type,
  });

  const badgeStyle = (badgeStyles.badge as any)({ intent, color: effectiveColor });
  const contentStyle = badgeStyles.content as any;
  const textStyle = (badgeStyles.text as any)({ intent, color: effectiveColor });

  const badgeProps = getWebProps([badgeStyle]);
  const contentProps = getWebProps([contentStyle]);
  const textProps = getWebProps([textStyle]);
  const iconProps = getWebProps([badgeStyles.icon, textStyle]);

  // Helper to render icon
  const renderIcon = (iconProp: typeof icon) => {
    if (typeof iconProp === 'string') {
      // Render IconSvg with the icon name - registry lookup happens inside
      return (
        <IconSvg
          name={iconProp}
          {...iconProps}
          aria-label={iconProp}
        />
      );
    } else if (isValidElement(iconProp)) {
      // Render custom component as-is
      return iconProp;
    }
    return null;
  };

  const mergedRef = useMergeRefs(ref, badgeProps.ref);

  if (type === 'dot') {
    return (
      <span
        {...badgeProps}
        style={style as React.CSSProperties}
        ref={mergedRef}
        id={id}
        data-testid={testID}
        role="status"
        aria-label="status indicator"
      />
    );
  }

  const hasIcon = !!icon;

  return (
    <span
      {...badgeProps}
      style={style as React.CSSProperties}
      ref={mergedRef}
      id={id}
      data-testid={testID}
      role="status"
    >
      {hasIcon ? (
        <span {...contentProps}>
          {renderIcon(icon)}
          <span {...textProps}>
            {children}
            </span>
          </span>
      ) : (
        <span {...textProps}>
          {children}
        </span>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
