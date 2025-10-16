import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import type { VideoProps, VideoSource } from './types';

// Import react-native-video - it's a peer dependency
let RNVideo: any;
try {
  RNVideo = require('react-native-video').default;
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
  const { styles } = useStyles(stylesheet);

  if (!RNVideo) {
    return (
      <View style={[styles.container, { width, height, aspectRatio, borderRadius }, style]} testID={testID}>
        <View style={styles.fallback}>
          {/* Fallback when react-native-video is not installed */}
        </View>
      </View>
    );
  }

  const videoSource = typeof source === 'string'
    ? { uri: source }
    : source;

  const containerStyle = [
    styles.container,
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
        style={[styles.video, { borderRadius }]}
        controls={controls}
        paused={!autoPlay}
        repeat={loop}
        muted={muted}
        resizeMode="contain"
        onLoad={handleLoad}
        onError={handleError}
        onProgress={handleProgress}
        onEnd={handleEnd}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.inverse,
  },

  video: {
    width: '100%',
    height: '100%',
  },

  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.tertiary,
  },
}));

export default Video;
