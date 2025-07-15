import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';

const Badge: React.FC<BadgeProps> = ({
  children,
  size = 'medium',
  variant = 'filled',
  color = 'blue',
  style,
  testID,
}) => {
  badgeStyles.useVariants({
    size,
    variant: variant as any,
    color,
  });

  const badgeStyleArray = [badgeStyles.badge, style];
  const badgeProps = getWebProps(badgeStyleArray);

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

  return (
    <span
      {...badgeProps}
      data-testid={testID}
      role="status"
    >
      {children}
    </span>
  );
};

export default Badge; 