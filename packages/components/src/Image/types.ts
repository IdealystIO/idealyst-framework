import type { StyleProp, ImageStyle, ImageSourcePropType } from 'react-native';
import { BaseProps } from '../utils/viewStyleProps';

export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface ImageProps extends BaseProps {
  source: ImageSourcePropType | string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  objectFit?: ImageObjectFit;
  loading?: 'lazy' | 'eager';
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: any) => void;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
  testID?: string;
  accessibilityLabel?: string;
}
