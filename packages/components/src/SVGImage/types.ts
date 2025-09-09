import React from 'react';
import { ViewProps } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { IntentNames } from '../theme';

export interface SVGImageProps extends Omit<ViewProps, 'children'> {
  source: string | { uri: string } | React.FC<SvgProps>;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  color?: string;
  intent?: IntentNames;
  resizeMode?: 'contain' | 'cover' | 'stretch';
}