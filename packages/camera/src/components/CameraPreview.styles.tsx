import { StyleSheet } from 'react-native-unistyles';
import { defineStyle } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

export type CameraPreviewDynamicProps = {};

/**
 * Styles for CameraPreview component.
 */
export const cameraPreviewStyles = defineStyle('CameraPreview', () => ({
  container: (_props: CameraPreviewDynamicProps) => ({
    overflow: 'hidden' as const,
    backgroundColor: '#000',
  }),
  camera: (_props: CameraPreviewDynamicProps) => ({
    flex: 1,
  }),
  video: (_props: CameraPreviewDynamicProps) => ({
    width: '100%' as const,
    height: '100%' as const,
  }),
  focusIndicator: (_props: CameraPreviewDynamicProps) => ({
    position: 'absolute' as const,
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 40,
    backgroundColor: 'transparent',
  }),
}));

// Keep legacy export for compatibility
export const styles = cameraPreviewStyles;

/**
 * Web-specific styles (CSS-in-JS for web platform).
 */
export const webStyles = {
  container: {
    position: 'relative' as const,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  videoContain: {
    objectFit: 'contain' as const,
  },
  videoMirrored: {
    transform: 'scaleX(-1)',
  },
  focusIndicator: {
    position: 'absolute' as const,
    width: 80,
    height: 80,
    border: '2px solid white',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    transition: 'opacity 0.3s ease',
  },
};
