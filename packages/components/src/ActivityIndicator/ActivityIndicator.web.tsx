import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ActivityIndicatorProps } from './types';
import { activityIndicatorStyles } from './ActivityIndicator.styles';
import './ActivityIndicator.web.css';

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  animating = true,
  size = 'medium',
  intent = 'primary',
  color,
  style,
  testID,
  hidesWhenStopped = true,
}) => {
  // Handle numeric size
  const sizeVariant = typeof size === 'number' ? 'medium' : size;
  const customSize = typeof size === 'number' ? size : undefined;
  
  // Apply variants using the correct Unistyles 3.0 pattern
  activityIndicatorStyles.useVariants({
    size: sizeVariant as 'small' | 'medium' | 'large',
    intent: intent as 'primary' | 'success' | 'error' | 'warning' | 'neutral',
    animating: animating as boolean,
  });

  // Don't render if not animating and hidesWhenStopped is true
  if (!animating && hidesWhenStopped) {
    return null;
  }

  // Create the style array following the official documentation pattern
  const containerStyleArray = [
    activityIndicatorStyles.container,
    customSize && {
      width: customSize,
      height: customSize,
    },
    style,
  ];

  const spinnerStyleArray = [
    activityIndicatorStyles.spinner,
    customSize && {
      width: customSize,
      height: customSize,
      borderWidth: Math.max(2, customSize / 10),
    },
    color && { borderTopColor: color, borderRightColor: color },
  ];

  // Use getWebProps to generate className and ref for web
  const containerProps = getWebProps(containerStyleArray);
  const spinnerProps = getWebProps(spinnerStyleArray);

  return (
    <div {...containerProps} data-testid={testID}>
      <div {...spinnerProps} />
    </div>
  );
};

export default ActivityIndicator;