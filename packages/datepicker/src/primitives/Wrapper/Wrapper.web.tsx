import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';

interface WrapperProps {
  style?: any;
  children?: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const Wrapper = React.forwardRef<HTMLDivElement, WrapperProps>(({
  style,
  children,
  onClick,
  'data-testid': testID,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      onClick={onClick}
      data-testid={testID}
      {...getWebProps(style)}
      {...props}
    >
      {children}
    </div>
  );
});

Wrapper.displayName = 'Wrapper';