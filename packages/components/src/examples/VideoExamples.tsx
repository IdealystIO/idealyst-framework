import React from 'react';
import { Screen, View, Text } from '@idealyst/components';
import Video from '../Video';

export const VideoExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Video Examples</Text>

      <View spacing="sm" style={{ padding: 12, backgroundColor: '#fff3cd', borderRadius: 8 }}>
        <Text size="sm" weight="semibold">Note:</Text>
        <Text size="sm">
          On React Native, this component requires react-native-video to be installed.
          The examples below use sample videos from the web.
        </Text>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Video with Controls</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Video with Poster</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          poster="https://picsum.photos/800/450"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Autoplay & Loop</Text>
        <Text size="sm" color="secondary">
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
        <Text size="lg" weight="semibold">Fixed Size</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          width={640}
          height={360}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Rounded Corners</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          width="100%"
          aspectRatio={16 / 9}
          borderRadius={16}
          controls={true}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Different Aspect Ratios</Text>
        <View spacing="sm">
          <Text size="sm" weight="medium">16:9 (Widescreen)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            width="100%"
            aspectRatio={16 / 9}
            controls={true}
          />

          <Text size="sm" weight="medium">4:3 (Standard)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            width="100%"
            aspectRatio={4 / 3}
            controls={true}
          />

          <Text size="sm" weight="medium">1:1 (Square)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
            width={300}
            aspectRatio={1}
            controls={true}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Without Controls</Text>
        <Text size="sm" color="secondary">
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
        <Text size="lg" weight="semibold">Event Handlers</Text>
        <Text size="sm" color="secondary">
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
    </Screen>
  );
};

export default VideoExamples;
