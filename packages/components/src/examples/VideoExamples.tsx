import React from 'react';
import { Screen, View, Text } from '@idealyst/components';
import Video from '../Video';

export const VideoExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">Video Examples</Text>

      <View gap="sm" style={{ padding: 12, backgroundColor: '#fff3cd', borderRadius: 8 }}>
        <Text typography="subtitle2">Note:</Text>
        <Text typography="body2">
          On React Native, this component requires react-native-video to be installed.
          The examples below use sample videos from the web.
        </Text>
      </View>

      <View gap="md">
        <Text typography="h5">Basic Video with Controls</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Video with Poster</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          poster="https://picsum.photos/800/450"
          width="100%"
          aspectRatio={16 / 9}
          controls={true}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Autoplay & Loop</Text>
        <Text typography="caption" color="secondary">
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

      <View gap="md">
        <Text typography="h5">Fixed Size</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          width={640}
          height={360}
          controls={true}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Rounded Corners</Text>
        <Video
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          width="100%"
          aspectRatio={16 / 9}
          borderRadius={16}
          controls={true}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Different Aspect Ratios</Text>
        <View gap="sm">
          <Text typography="body2">16:9 (Widescreen)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            width="100%"
            aspectRatio={16 / 9}
            controls={true}
          />

          <Text typography="body2">4:3 (Standard)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            width="100%"
            aspectRatio={4 / 3}
            controls={true}
          />

          <Text typography="body2">1:1 (Square)</Text>
          <Video
            source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
            width={300}
            aspectRatio={1}
            controls={true}
          />
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Without Controls</Text>
        <Text typography="caption" color="secondary">
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

      <View gap="md">
        <Text typography="h5">Event Handlers</Text>
        <Text typography="caption" color="secondary">
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
