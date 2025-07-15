import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { DividerProps } from './types';
import { dividerStyles } from './Divider.styles';

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  intent = 'neutral',
  length = 'full',
  spacing = 'medium',
  children,
  style,
  testID,
  accessibilityLabel,
}) => {
  // Apply variants for main divider
  dividerStyles.useVariants({
    orientation,
    thickness,
    variant: variant as any,
    intent,
    length: typeof length === 'number' ? 'auto' : length,
    spacing,
  });

  // Create style arrays
  const dividerStyleArray = [
    dividerStyles.divider,
    style,
  ].filter(Boolean);

  const containerStyleArray = [dividerStyles.container];
  const contentStyleArray = [dividerStyles.content];
  const lineStyleArray = [dividerStyles.line];

  // Generate web props
  const dividerProps = getWebProps(dividerStyleArray);
  const containerProps = getWebProps(containerStyleArray);
  const contentProps = getWebProps(contentStyleArray);
  const lineProps = getWebProps(lineStyleArray);

  // If no children, render simple divider
  if (!children) {
    return (
      <div
        {...dividerProps}
        data-testid={testID}
        aria-label={accessibilityLabel}
        role="separator"
      />
    );
  }

  // If has children, render divider with content
  return (
    <div
      {...containerProps}
      data-testid={testID}
      aria-label={accessibilityLabel}
      role="separator"
    >
      <div {...lineProps} />
      <span {...contentProps}>
        {children}
      </span>
      <div {...lineProps} />
    </div>
  );
};

export default Divider; 