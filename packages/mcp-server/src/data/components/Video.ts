export const Video = {
  category: "media",
  description: "Video player component with playback controls and event handlers",
      props: `
- \`source\`: VideoSource | string - The video source URL or source object with uri and type
- \`poster\`: string - URL of the poster image to display before playback
- \`width\`: number | string - The width of the video player
- \`height\`: number | string - The height of the video player
- \`aspectRatio\`: number - The aspect ratio of the video (e.g., 16/9, 4/3)
- \`controls\`: boolean - Whether to show native playback controls
- \`autoPlay\`: boolean - Whether to automatically start playing when loaded
- \`loop\`: boolean - Whether to loop the video playback
- \`muted\`: boolean - Whether to mute the audio
- \`playsInline\`: boolean - Whether to play inline on mobile devices (prevents fullscreen)
- \`preload\`: 'auto' | 'metadata' | 'none' - How much of the video to preload
- \`onLoad\`: function - Called when the video has loaded
- \`onError\`: function - Called when an error occurs during playback
- \`onPlay\`: function - Called when the video starts playing
- \`onPause\`: function - Called when the video is paused
- \`onEnd\`: function - Called when the video playback ends
- \`onProgress\`: function - Called periodically during playback with progress information
- \`borderRadius\`: number - The border radius of the video player
`,
  features: [
    "Remote and local video sources",
    "Poster image support",
    "Playback controls",
    "Auto-play and loop",
    "Multiple event callbacks",
    "Progress tracking",
    "Aspect ratio control",
    "Border radius support",
  ],
  bestPractices: [
    "Always provide a poster image",
    "Use appropriate video formats for cross-platform",
    "Enable controls for user control",
    "Avoid autoPlay with audio (UX best practice)",
    "Use playsInline for better mobile experience",
    "Provide onError fallback",
    "Set explicit dimensions or aspect ratio",
    "Use preload: 'metadata' for better performance",
  ],
  usage: `
import { Video } from '@idealyst/components';

<Video
  source={{ uri: 'https://example.com/video.mp4', type: 'video/mp4' }}
  poster="https://example.com/poster.jpg"
  width="100%"
  aspectRatio={16/9}
  controls
  playsInline
  onLoad={() => console.log('Video loaded')}
  onError={(error) => console.error('Video error:', error)}
/>
`,
  examples: {
    basic: `import { Video } from '@idealyst/components';

<Video
  source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  width={640}
  height={360}
  controls
/>`,

    variants: `import { Video, View } from '@idealyst/components';

<View spacing="md">
  {/* With controls */}
  <Video
    source={{ uri: 'https://example.com/video.mp4' }}
    width="100%"
    aspectRatio={16/9}
    controls
  />

  {/* Auto-play, looped, muted */}
  <Video
    source={{ uri: 'https://example.com/video.mp4' }}
    width="100%"
    aspectRatio={16/9}
    autoPlay
    loop
    muted
    controls={false}
  />
</View>`,

    "with-icons": `import { Video, Card, View, Text } from '@idealyst/components';

<Card type="elevated" padding="none">
  <Video
    source="https://example.com/video.mp4"
    poster="https://example.com/poster.jpg"
    width="100%"
    aspectRatio={16/9}
    controls
    borderRadius={8}
  />
  <View spacing="sm" style={{ padding: 16 }}>
    <Text weight="bold">Video Title</Text>
    <Text size="sm">Video description and details</Text>
  </View>
</Card>`,

    interactive: `import { Video, View, Text, Button } from '@idealyst/components';
import { useState, useRef } from 'react';

function Example() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handleProgress = ({ currentTime, playableDuration }) => {
    if (playableDuration > 0) {
      setProgress((currentTime / playableDuration) * 100);
    }
  };

  return (
    <View spacing="md">
      <Video
        ref={videoRef}
        source={{ uri: 'https://example.com/video.mp4' }}
        poster="https://example.com/poster.jpg"
        width="100%"
        aspectRatio={16/9}
        controls
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onProgress={handleProgress}
        onError={(error) => console.error('Video error:', error)}
      />

      <View spacing="sm">
        <Text>
          Status: {playing ? 'Playing' : 'Paused'} | Progress: {progress.toFixed(1)}%
        </Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            size="sm"
            type="outlined"
            onPress={() => videoRef.current?.play()}
          >
            Play
          </Button>
          <Button
            size="sm"
            type="outlined"
            onPress={() => videoRef.current?.pause()}
          >
            Pause
          </Button>
        </View>
      </View>
    </View>
  );
}`,
  },
};
