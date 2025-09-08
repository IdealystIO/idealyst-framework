import React from 'react';
import { View } from '@idealyst/components';
import { WebTabLayoutProps } from './types';

// Native implementation just passes through children
// Tab functionality is handled by React Navigation natively
const WebTabLayout: React.FC<WebTabLayoutProps> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default WebTabLayout;