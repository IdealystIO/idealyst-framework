import React from 'react';
import { useNavigator } from '@idealyst/navigation';
import { Pressable } from '../Pressable';
import type { LinkProps } from './types';

const Link: React.FC<LinkProps> = ({
  to,
  vars,
  children,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  onPress,
  id,
}) => {
  const navigator = useNavigator();

  const handlePress = () => {
    if (disabled) return;

    onPress?.();
    navigator.navigate({ path: to, vars });
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="link"
      id={id}
    >
      {children}
    </Pressable>
  );
};

export default Link;
