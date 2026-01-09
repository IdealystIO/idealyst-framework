import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    children,
    size = 'md',
    type = 'filled',
    color = 'blue',
    icon,
    style,
    testID,
    id,
  } = props;

  badgeStyles.useVariants({
    size,
    type,
  });

  const badgeStyle = (badgeStyles.badge as any)({ color });
  const contentStyle = badgeStyles.content;
  const textStyle = (badgeStyles.text as any)({ color });

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
