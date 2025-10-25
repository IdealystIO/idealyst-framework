import React from 'react';
import { Screen, View, Text } from '@idealyst/components';
import Image from '../Image';

export const ImageExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg">
    <View spacing="lg">
      <Text size="xl" weight="bold">Image Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Image</Text>
        <Image
          source="https://picsum.photos/400/300"
          alt="Random placeholder image"
          width={400}
          height={300}
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Object Fit Variants</Text>
        <View spacing="sm">
          <Text size="sm" weight="medium">Cover (default)</Text>
          <Image
            source="https://picsum.photos/800/400"
            alt="Cover example"
            width={300}
            height={200}
            objectFit="cover"
          />

          <Text size="sm" weight="medium">Contain</Text>
          <Image
            source="https://picsum.photos/800/400"
            alt="Contain example"
            width={300}
            height={200}
            objectFit="contain"
          />

          <Text size="sm" weight="medium">Fill</Text>
          <Image
            source="https://picsum.photos/800/400"
            alt="Fill example"
            width={300}
            height={200}
            objectFit="fill"
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Aspect Ratio</Text>
        <View spacing="sm">
          <Text size="sm" weight="medium">16:9 Aspect Ratio</Text>
          <Image
            source="https://picsum.photos/1600/900"
            alt="16:9 aspect ratio"
            width="100%"
            aspectRatio={16 / 9}
          />

          <Text size="sm" weight="medium">1:1 Square</Text>
          <Image
            source="https://picsum.photos/600/600"
            alt="Square aspect ratio"
            width={200}
            aspectRatio={1}
          />
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Border Radius</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <View spacing="xs">
            <Text size="sm" weight="medium">Rounded (8px)</Text>
            <Image
              source="https://picsum.photos/200/200?random=1"
              alt="Rounded corners"
              width={150}
              height={150}
              borderRadius={8}
            />
          </View>

          <View spacing="xs">
            <Text size="sm" weight="medium">Very Rounded (24px)</Text>
            <Image
              source="https://picsum.photos/200/200?random=2"
              alt="Very rounded corners"
              width={150}
              height={150}
              borderRadius={24}
            />
          </View>

          <View spacing="xs">
            <Text size="sm" weight="medium">Circle (50%)</Text>
            <Image
              source="https://picsum.photos/200/200?random=3"
              alt="Circle"
              width={150}
              height={150}
              borderRadius={75}
            />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Lazy Loading</Text>
        <Text size="sm" color="secondary">Images load as they scroll into view</Text>
        <View spacing="sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              source={`https://picsum.photos/400/200?random=${i + 10}`}
              alt={`Lazy loaded image ${i}`}
              width="100%"
              height={200}
              loading="lazy"
            />
          ))}
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">With Custom Placeholder</Text>
        <Image
          source="https://picsum.photos/400/300?random=20"
          alt="Custom placeholder"
          width={400}
          height={300}
          placeholder={
            <View style={{ padding: 20 }}>
              <Text>Loading custom image...</Text>
            </View>
          }
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Error Handling</Text>
        <Text size="sm" color="secondary">Image with broken URL shows fallback</Text>
        <Image
          source="https://broken-url-that-does-not-exist.com/image.jpg"
          alt="Broken image"
          width={400}
          height={300}
          fallback={
            <View style={{ padding: 20 }}>
              <Text color="primary">❌ Failed to load image</Text>
            </View>
          }
        />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Responsive Width</Text>
        <Image
          source="https://picsum.photos/1200/400"
          alt="Responsive image"
          width="100%"
          aspectRatio={3}
        />
      </View>
    </View>
    </Screen>
  );
};

export default ImageExamples;
