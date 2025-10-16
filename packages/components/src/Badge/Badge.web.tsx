import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';
import { IconSvg } from '../Icon/IconSvg.web';

// Extended props to include path props added by Babel plugin
interface InternalBadgeProps extends BadgeProps {
  iconPath?: string;
}

const Badge: React.FC<BadgeProps> = (props: InternalBadgeProps) => {
  const {
    children,
    size = 'medium',
    variant = 'filled',
    color = 'blue',
    icon,
    iconPath,
    style,
    testID,
  } = props;

  badgeStyles.useVariants({
    size,
    variant: variant as any,
    color,
  });

  const badgeStyleArray = [badgeStyles.badge, style];
  const badgeProps = getWebProps(badgeStyleArray);

  const contentProps = getWebProps([badgeStyles.content]);

  // Icon styles - size variant is applied from the badge useVariants call above
  const iconStyleArray = [badgeStyles.icon];
  const iconProps = getWebProps(iconStyleArray);

  // Helper to render icon
  const renderIcon = (iconProp: typeof icon, path?: string) => {
    if (typeof iconProp === 'string' && path) {
      // Render IconSvg directly with the path from Babel plugin
      // Don't pass size prop - let the style control the dimensions entirely
      return (
        <IconSvg
          path={path}
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

  if (variant === 'dot') {
    return (
      <span
        {...badgeProps}
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
      data-testid={testID}
      role="status"
    >
      {hasIcon ? (
        <span {...contentProps}>
          {renderIcon(icon, iconPath)}
          {children}
        </span>
      ) : (
        children
      )}
    </span>
  );
};

export default Badge; 