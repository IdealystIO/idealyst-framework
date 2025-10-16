import React from 'react';
import { View, Text } from '@idealyst/components';
import Video from '../Video';

export const VideoExamples: React.FC = () => {
  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Video Examples</Text>

      <View spacing="sm" style={{ padding: 12, backgroundColor: '#fff3cd', borderRadius: 8 }}>
        <Text size="small" weight="semibold">Note:</Text>
        <Text size="small">
          On React Native, this component requires react-native-video to be installed.
          The examples below use sample videos from the web.
        </Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Video with Controls</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Video with Poster</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          poster="https://picsum.photos/800/450"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Autoplay & Loop</Text>
        <Text size="small" color="secondary">
          Video plays automatically and loops continuously
        </Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          width="100%"
          aspectRatio={16 / 9}
          autoPlay={true}
          loop={true}
          muted={true}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Fixed Size</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          width={640}
          height={360}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Rounded Corners</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          width="100%"
          aspectRatio={16 / 9}
          borderRadius={16}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Different Aspect Ratios</Text>
        <View spacing="sm">
          <Text size="small" weight="medium">16:9 (Widescreen)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            width="100%"
            aspectRatio={16 / 9}
            controls={true}
          />

          <Text size="small" weight="medium">4:3 (Standard)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            width="100%"
            aspectRatio={4 / 3}
            controls={true}
          />

          <Text size="small" weight="medium">1:1 (Square)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
            width={300}
            aspectRatio={1}
            controls={true}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Without Controls</Text>
        <Text size="small" color="secondary">
          Video with controls disabled
        </Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
          width="100%"
          aspectRatio={16 / 9}
          controls={false}
          autoPlay={true}
          loop={true}
          muted={true}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Event Handlers</Text>
        <Text size="small" color="secondary">
          Check console for video events (onLoad, onPlay, onPause, onEnd)
        </Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
          onLoad={() => console.log('Video loaded')}
          onPlay={() => console.log('Video playing')}
          onPause={() => console.log('Video paused')}
          onEnd={() => console.log('Video ended')}
          onProgress={(progress) => console.log('Progress:', progress)}
        />
      </View>
    </View>
  );
};

export default VideoExamples;
