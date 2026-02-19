/**
 * Image Component Examples
 *
 * These examples are type-checked against the actual ImageProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Image, View, Text } from '@idealyst/components';

// Example 1: Basic Image
export function BasicImage() {
  return (
    <Image
      source={{ uri: 'https://picsum.photos/300/200' }}
      alt="A random placeholder image"
    />
  );
}

// Example 2: Image with Dimensions
export function ImageWithDimensions() {
  return (
    <View spacing="md">
      <Image
        source={{ uri: 'https://picsum.photos/400/300' }}
        alt="Fixed dimensions"
        width={400}
        height={300}
      />
      <Image
        source={{ uri: 'https://picsum.photos/600/400' }}
        alt="With aspect ratio"
        width="100%"
        aspectRatio={16 / 9}
      />
    </View>
  );
}

// Example 3: Image Object Fit
export function ImageObjectFit() {
  return (
    <View spacing="md">
      <Image
        source={{ uri: 'https://picsum.photos/400/300' }}
        alt="Contain mode"
        width={200}
        height={200}
        objectFit="contain"
      />
      <Image
        source={{ uri: 'https://picsum.photos/400/300' }}
        alt="Cover mode"
        width={200}
        height={200}
        objectFit="cover"
      />
      <Image
        source={{ uri: 'https://picsum.photos/400/300' }}
        alt="Fill mode"
        width={200}
        height={200}
        objectFit="fill"
      />
    </View>
  );
}

// Example 4: Image with Placeholder and Fallback
export function ImageWithPlaceholder() {
  return (
    <View spacing="md">
      <Image
        source={{ uri: 'https://picsum.photos/300/200' }}
        alt="Image with placeholder"
        width={300}
        height={200}
        placeholder={
          <View style={{ width: 300, height: 200, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
        }
        fallback={
          <View style={{ width: 300, height: 200, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Failed to load image</Text>
          </View>
        }
      />
    </View>
  );
}

// Example 5: Image with Border Radius
export function ImageWithBorderRadius() {
  return (
    <View spacing="md">
      <Image
        source={{ uri: 'https://picsum.photos/200/200' }}
        alt="Rounded corners"
        width={200}
        height={200}
        borderRadius={12}
      />
      <Image
        source={{ uri: 'https://picsum.photos/150/150' }}
        alt="Circular image"
        width={150}
        height={150}
        borderRadius={75}
      />
    </View>
  );
}

// Example 6: Image with Lazy Loading
export function ImageLazyLoading() {
  return (
    <Image
      source={{ uri: 'https://picsum.photos/600/400' }}
      alt="Lazy loaded image"
      width="100%"
      aspectRatio={3 / 2}
      loading="lazy"
    />
  );
}

// Example 7: Combined Image Features
export function CombinedImageFeatures() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <View spacing="md">
      <Image
        source={{ uri: 'https://picsum.photos/400/300' }}
        alt="Featured image with combined props"
        width="100%"
        aspectRatio={4 / 3}
        objectFit="cover"
        borderRadius={16}
        loading="lazy"
        placeholder={
          <View style={{ width: '100%', aspectRatio: 4 / 3, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
        }
        fallback={
          <View style={{ width: '100%', aspectRatio: 4 / 3, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Image unavailable</Text>
          </View>
        }
        onLoad={() => setLoaded(true)}
        onError={(error) => console.log('Image failed to load:', error)}
        accessibilityLabel="A featured landscape photograph"
        testID="featured-image"
      />
      {loaded && <Text>Image loaded successfully</Text>}
    </View>
  );
}
