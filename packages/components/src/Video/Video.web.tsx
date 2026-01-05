import React, { useRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { videoStyles } from './Video.styles';
import type { VideoProps, VideoSource } from './types';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebAriaProps } from '../utils/accessibility';

const Video: React.FC<VideoProps> = ({
  source,
  poster,
  width,
  height,
  aspectRatio,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = true,
  preload = 'metadata',
  onLoad,
  onError,
  onPlay,
  onPause,
  onEnd,
  onProgress,
  borderRadius,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
}) => {
  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel: accessibilityLabel ?? 'Video player',
      accessibilityHint,
      accessibilityRole,
      accessibilityHidden,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityRole, accessibilityHidden]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const containerProps = getWebProps([videoStyles.container, style as any]);
  const videoProps = getWebProps([videoStyles.video]);

  const videoSource = typeof source === 'string'
    ? source
    : (source as VideoSource).uri;

  const videoType = typeof source === 'object'
    ? (source as VideoSource).type
    : undefined;

  const handleLoadedMetadata = () => {
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    onError?.(e);
  };

  const handlePlay = () => {
    onPlay?.();
  };

  const handlePause = () => {
    onPause?.();
  };

  const handleEnded = () => {
    onEnd?.();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && onProgress) {
      onProgress({
        currentTime: videoRef.current.currentTime,
        playableDuration: videoRef.current.duration || 0,
      });
    }
  };

  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
  };

  const vidStyle: React.CSSProperties = {
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
  };

  const mergedVideoRef = useMergeRefs(videoRef, videoProps.ref);

  return (
    <div
      {...containerProps}
      {...ariaProps}
      style={containerStyle}
      id={id}
      data-testid={testID}
    >
      <video
        ref={mergedVideoRef}
        className={videoProps.className}
        style={vidStyle}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoSource} type={videoType || 'video/mp4'} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
