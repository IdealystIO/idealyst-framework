import { Intent } from '@idealyst/theme';
import React from 'react';
import { ViewProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

// Component-specific type aliases for future extensibility
export type SVGImageIntentVariant = Intent;
export type SVGImageResizeMode = 'contain' | 'cover' | 'stretch';

export interface SVGImageProps extends Omit<ViewProps, 'children'> {
  source: string | { uri: string } | React.FC<SvgProps>;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  color?: string;
  intent?: SVGImageIntentVariant;
  resizeMode?: SVGImageResizeMode;
}