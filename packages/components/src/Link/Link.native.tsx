import React from 'react';
import { useNavigator } from '@idealyst/navigation';
import { Pressable } from '../Pressable';
import type { LinkProps } from './types';
import { Text } from 'react-native';

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
  
  console.log("Rendering Link to:", to, "children:", children);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={style}
      testID={testID}
      id={id}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="link"
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
};

export default Link;
