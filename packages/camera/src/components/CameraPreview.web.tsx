import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { CameraPreviewProps, FocusPoint } from '../types';
import { webStyles } from './CameraPreview.styles';
import type { WebCamera } from '../camera.web';

/**
 * Camera preview component for web platform.
 * Renders a video element displaying the camera stream.
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Determine if preview should be mirrored
  const shouldMirror = mirror ?? camera?.status.activeDevice?.position === 'front';

  // Get media stream from camera
  useEffect(() => {
    if (!camera || !videoRef.current) return;

    const stream = (camera as WebCamera)._getPreviewSource() as MediaStream | null;

    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, user interaction required
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [camera, camera?.status.isActive]);

  // Handle video ready
  const handleCanPlay = useCallback(() => {
    if (!isReady) {
      setIsReady(true);
      onReady?.();
    }
  }, [isReady, onReady]);

  // Handle tap-to-focus
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTapToFocus || !camera || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Show focus indicator
      setFocusPoint({ x: e.clientX - rect.left - 40, y: e.clientY - rect.top - 40 });
      setTimeout(() => setFocusPoint(null), 1000);

      // Trigger focus
      camera.focusOnPoint(x, y);
      onFocus?.({ x, y });
    },
    [enableTapToFocus, camera, onFocus]
  );

  // Handle pinch-to-zoom via wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enablePinchToZoom || !camera) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(1, camera.status.zoom + delta);
      camera.setZoom(newZoom);
    },
    [enablePinchToZoom, camera]
  );

  // Container styles
  const containerStyle: React.CSSProperties = {
    ...webStyles.container,
    ...(typeof style === 'object' ? (style as React.CSSProperties) : {}),
    aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
  };

  // Video styles
  const videoStyle: React.CSSProperties = {
    ...webStyles.video,
    objectFit: resizeMode,
    transform: shouldMirror ? 'scaleX(-1)' : undefined,
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onClick={handleClick}
      onWheel={handleWheel}
      data-testid={testID}
      id={id}
    >
      <video
        ref={videoRef}
        style={videoStyle}
        autoPlay
        playsInline
        muted
        onCanPlay={handleCanPlay}
      />

      {/* Focus indicator */}
      {focusPoint && (
        <div
          style={{
            ...webStyles.focusIndicator,
            left: focusPoint.x,
            top: focusPoint.y,
          }}
        />
      )}
    </div>
  );
};

export default CameraPreview;
