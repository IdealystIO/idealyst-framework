import type { StyleProp, ViewStyle } from 'react-native';

export interface VideoSource {
  uri: string;
  type?: string;
}

export interface VideoProps {
  source: VideoSource | string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onProgress?: (progress: { currentTime: number; playableDuration: number }) => void;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
