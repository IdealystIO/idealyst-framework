import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { DividerProps } from './types';
import { dividerStyles } from './Divider.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Divider = forwardRef<HTMLDivElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  intent = 'neutral',
  length = 'full',
  spacing = 'md',
  children,
  style,
  testID,
  accessibilityLabel,
}, ref) => {
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

  const mergedDividerRef = useMergeRefs(ref, dividerProps.ref);
  const mergedContainerRef = useMergeRefs(ref, containerProps.ref);

  // If no children, render simple divider
  if (!children) {
    return (
      <div
        {...dividerProps}
        ref={mergedDividerRef}
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
      ref={mergedContainerRef}
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
});

Divider.displayName = 'Divider';

export default Divider; 