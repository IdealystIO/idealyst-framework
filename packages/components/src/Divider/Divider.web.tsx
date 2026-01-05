import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { DividerProps } from './types';
import { dividerStyles } from './Divider.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Divider = forwardRef<HTMLDivElement, DividerProps>(({
  orientation = 'horizontal',
  type = 'solid',
  thickness = 'thin',
  intent = 'neutral',
  length = 'full',
  spacing = 'md',
  children,
  style,
  testID,
  accessibilityLabel,
  id,
}, ref) => {
  // Apply variants for container, content (orientation, spacing)
  dividerStyles.useVariants({
    orientation,
    spacing,
    length: typeof length === 'number' ? 'auto' : length,
  });

  // Get dynamic divider style
  const dividerStyle = (dividerStyles.divider as any)({
    orientation,
    thickness,
    type,
    intent,
    spacing,
  });

  // Get dynamic line style
  const lineStyle = (dividerStyles.line as any)({
    orientation,
    thickness,
  });

  // Generate web props
  const dividerProps = getWebProps([dividerStyle, style as any]);
  const containerProps = getWebProps([dividerStyles.container]);
  const contentProps = getWebProps([dividerStyles.content]);
  const lineProps = getWebProps([lineStyle]);

  const mergedDividerRef = useMergeRefs(ref, dividerProps.ref);
  const mergedContainerRef = useMergeRefs(ref, containerProps.ref);

  // If no children, render simple divider
  if (!children) {
    return (
      <div
        {...dividerProps}
        ref={mergedDividerRef}
        id={id}
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
      id={id}
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