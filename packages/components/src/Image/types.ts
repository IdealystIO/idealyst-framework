import type { ImageStyle, ImageSourcePropType } from 'react-native';

export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface ImageProps {
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
  style?: ImageStyle;
  testID?: string;
  accessibilityLabel?: string;
}
