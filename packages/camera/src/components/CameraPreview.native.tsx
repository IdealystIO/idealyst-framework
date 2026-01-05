import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet as RNStyleSheet, LayoutChangeEvent } from 'react-native';
import type { CameraPreviewProps, FocusPoint } from '../types';
import { styles } from './CameraPreview.styles';
import type { NativeCamera } from '../camera.native';

// Lazy load vision camera to handle cases where it's not installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let VisionCamera: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GestureDetector: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Gesture: any = null;

/**
 * Camera preview component for React Native platform.
 * Renders a VisionCamera component displaying the camera stream.
 */
export const CameraPreview: React.FC<CameraPreviewProps> = ({
  camera,
  style,
  aspectRatio,
  resizeMode = 'cover',
  mirror,
  enableTapToFocus = true,
  enablePinchToZoom = true,
  onReady,
  onFocus,
  testID,
  id,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  const [isVisionCameraLoaded, setIsVisionCameraLoaded] = useState(false);
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Load vision camera module
  useEffect(() => {
    const loadModules = async () => {
      try {
        const visionCameraModule = await import('react-native-vision-camera');
        VisionCamera = visionCameraModule.Camera;

        try {
          const gestureHandler = await import('react-native-gesture-handler');
          GestureDetector = gestureHandler.GestureDetector;
          Gesture = gestureHandler.Gesture;
        } catch {
          // Gesture handler not available
        }

        setIsVisionCameraLoaded(true);
      } catch {
        console.warn('@idealyst/camera: react-native-vision-camera is not installed');
      }
    };

    loadModules();
  }, []);

  // Set camera ref on native camera
  useEffect(() => {
    if (camera && cameraRef.current) {
      (camera as NativeCamera)._setCameraRef(cameraRef.current);
    }

    return () => {
      if (camera) {
        (camera as NativeCamera)._setCameraRef(null);
      }
    };
  }, [camera, isVisionCameraLoaded]);

  // Get native device from camera
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nativeDevice = camera?._getPreviewSource() as any;

  // Determine if preview should be mirrored
  const shouldMirror = mirror ?? camera?.status.activeDevice?.position === 'front';

  // Handle tap-to-focus
  const handleTapToFocus = useCallback(
    (x: number, y: number) => {
      if (!enableTapToFocus || !camera || containerSize.width === 0) return;

      const normalizedX = x / containerSize.width;
      const normalizedY = y / containerSize.height;

      // Show focus indicator
      setFocusPoint({ x: x - 40, y: y - 40 });
      setTimeout(() => setFocusPoint(null), 1000);

      // Trigger focus
      camera.focusOnPoint(normalizedX, normalizedY);
      onFocus?.({ x: normalizedX, y: normalizedY });
    },
    [enableTapToFocus, camera, containerSize, onFocus]
  );

  // Handle pinch-to-zoom
  const handlePinchZoom = useCallback(
    (scale: number) => {
      if (!enablePinchToZoom || !camera) return;

      const device = camera.status.activeDevice;
      const minZoom = device?.minZoom ?? 1;
      const maxZoom = device?.maxZoom ?? 10;

      const newZoom = Math.max(minZoom, Math.min(maxZoom, scale));
      camera.setZoom(newZoom);
    },
    [enablePinchToZoom, camera]
  );

  // Container layout handler
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  // Container style
  const containerStyle = [
    styles.container,
    style,
    aspectRatio ? { aspectRatio } : null,
  ];

  // If vision camera is not loaded or no device, show placeholder
  if (!isVisionCameraLoaded || !VisionCamera || !nativeDevice) {
    return (
      <View
        style={containerStyle}
        onLayout={handleLayout}
        testID={testID}
        accessibilityLabel={id}
      />
    );
  }

  // Common camera props
  const cameraProps = {
    ref: cameraRef,
    device: nativeDevice,
    isActive: camera?.status.isActive ?? false,
    photo: true,
    video: true,
    audio: camera?.status.config.enableAudio ?? true,
    zoom: camera?.status.zoom ?? 1,
    torch: camera?.status.torchActive ? 'on' : 'off',
    resizeMode: resizeMode,
    onInitialized: onReady,
  };

  // Create gesture handlers if available
  let gestureContent: React.ReactNode = null;

  if (GestureDetector && Gesture) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tapGesture = Gesture.Tap().onEnd((event: any) => {
      handleTapToFocus(event.x, event.y);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pinchGesture = Gesture.Pinch().onUpdate((event: any) => {
      handlePinchZoom(event.scale * (camera?.status.zoom ?? 1));
    });

    const composedGesture = Gesture.Race(tapGesture, pinchGesture);

    gestureContent = (
      <GestureDetector gesture={composedGesture}>
        <View style={RNStyleSheet.absoluteFill}>
          <VisionCamera {...cameraProps} style={RNStyleSheet.absoluteFill} />

          {/* Focus indicator */}
          {focusPoint && (
            <View
              style={[
                styles.focusIndicator,
                { left: focusPoint.x, top: focusPoint.y },
              ]}
            />
          )}
        </View>
      </GestureDetector>
    );
  } else {
    // Without gesture handler, just render camera
    gestureContent = (
      <View style={RNStyleSheet.absoluteFill}>
        <VisionCamera {...cameraProps} style={RNStyleSheet.absoluteFill} />
      </View>
    );
  }

  return (
    <View
      style={containerStyle}
      onLayout={handleLayout}
      testID={testID}
      accessibilityLabel={id}
    >
      {gestureContent}
    </View>
  );
};

export default CameraPreview;
