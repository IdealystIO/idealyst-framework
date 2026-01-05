import { StyleSheet } from 'react-native';

/**
 * Styles for CameraPreview component.
 * Using plain StyleSheet since this is a simple component without theme variants.
 */
export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  focusIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 40,
    backgroundColor: 'transparent',
  },
});

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
