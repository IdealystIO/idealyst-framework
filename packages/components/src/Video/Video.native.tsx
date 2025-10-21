import React from 'react';
import { View, StyleSheet } from 'react-native';
import { videoStyles } from './Video.styles';
import type { VideoProps, VideoSource } from './types';

// Import react-native-video - it's a peer dependency
let RNVideo: any;
try {
  const videoModule = require('react-native-video');
  // Try default export first (v5 and earlier), then named export (v6+)
  RNVideo = videoModule.default || videoModule.Video || videoModule;
} catch (e) {
  console.warn('react-native-video not installed. Video component will not work on native.');
}

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
  onLoad,
  onError,
  onPlay,
  onPause,
  onEnd,
  onProgress,
  borderRadius,
  style,
  testID,
}) => {
  // Apply variants
  videoStyles.useVariants({});

  if (!RNVideo) {
    return (
      <View style={[videoStyles.container, { width, height, aspectRatio, borderRadius }, style]} testID={testID}>
        <View style={videoStyles.fallback}>
          {/* Fallback when react-native-video is not installed */}
        </View>
      </View>
    );
  }

  const videoSource = typeof source === 'string'
    ? { uri: source }
    : source;

  const containerStyle = [
    videoStyles.container,
    {
      width: width || '100%',
      height: height || undefined,
      aspectRatio: aspectRatio || undefined,
      borderRadius: borderRadius || undefined,
    },
    style,
  ];

  const handleLoad = (data: any) => {
    onLoad?.();
  };

  const handleError = (error: any) => {
    onError?.(error);
  };

  const handleProgress = (data: any) => {
    if (onProgress) {
      onProgress({
        currentTime: data.currentTime,
        playableDuration: data.playableDuration,
      });
    }
  };

  const handleEnd = () => {
    onEnd?.();
  };

  return (
    <View style={containerStyle} testID={testID}>
      <RNVideo
        source={videoSource}
        poster={poster}
        style={[videoStyles.video, { borderRadius }]}
        controls={controls}
        paused={!autoPlay}
        repeat={loop}
        muted={muted}
        resizeMode="contain"
        // Support both v5 and v6+ event names
        onLoad={handleLoad}
        onReadyForDisplay={handleLoad}
        onError={handleError}
        onProgress={handleProgress}
        onEnd={handleEnd}
      />
    </View>
  );
};

export default Video;
