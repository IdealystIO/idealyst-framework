export const Video = {
  category: "media",
  description: "Video player component with playback controls and event handlers",
  props: `
- \`source\`: VideoSource | string - Video source ({ uri, type } or string URL)
- \`poster\`: string - Poster image URL (shown before playback)
- \`width\`: number | string - Video width
- \`height\`: number | string - Video height
- \`aspectRatio\`: number - Aspect ratio (width/height)
- \`controls\`: boolean - Show playback controls (default: true)
- \`autoPlay\`: boolean - Start playing automatically
- \`loop\`: boolean - Loop playback
- \`muted\`: boolean - Mute audio
- \`playsInline\`: boolean - Play inline (not fullscreen on mobile)
- \`preload\`: 'auto' | 'metadata' | 'none' - Preload strategy (web)
- \`onLoad\`: () => void - Called when video loads
- \`onError\`: (error: any) => void - Called on load error
- \`onPlay\`: () => void - Called when playback starts
- \`onPause\`: () => void - Called when playback pauses
- \`onEnd\`: () => void - Called when playback ends
- \`onProgress\`: (progress) => void - Called during playback with current time
- \`borderRadius\`: number - Border radius in pixels
- \`style\`: ViewStyle - Additional styles
- \`testID\`: string - Test identifier
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

<Card variant="elevated" padding="none">
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
            variant="outlined"
            onPress={() => videoRef.current?.play()}
          >
            Play
          </Button>
          <Button
            size="sm"
            variant="outlined"
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
