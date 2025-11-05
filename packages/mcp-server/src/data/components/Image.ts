export const Image = {
  category: "media",
  description: "Image component with loading states, fallback support, and various object-fit modes",
      props: `
- \`source\`: ImageSourcePropType | string - The image source URL or source object
- \`alt\`: string - Alternative text for accessibility
- \`width\`: number | string - The width of the image
- \`height\`: number | string - The height of the image
- \`aspectRatio\`: number - The aspect ratio of the image
- \`objectFit\`: ImageObjectFit - How the image should be fitted (cover, contain, fill, none, scale-down)
- \`loading\`: 'lazy' | 'eager' - When to load the image (lazy for below the fold, eager for above)
- \`placeholder\`: React.ReactNode - Content to show while the image is loading
- \`fallback\`: React.ReactNode - Content to show if the image fails to load
- \`onLoad\`: function - Called when the image successfully loads
- \`onError\`: function - Called when the image fails to load
- \`borderRadius\`: number - The border radius of the image
`,
  features: [
    "Remote and local image sources",
    "Lazy loading support (web)",
    "Loading placeholder",
    "Error fallback",
    "Multiple object-fit modes",
    "Aspect ratio control",
    "Border radius support",
    "Load/error callbacks",
  ],
  bestPractices: [
    "Always provide alt text for accessibility",
    "Use lazy loading for images below the fold",
    "Provide placeholder for better perceived performance",
    "Use fallback for graceful error handling",
    "Use objectFit: 'cover' for thumbnails",
    "Use objectFit: 'contain' to show full image",
  ],
  usage: `
import { Image, ActivityIndicator } from '@idealyst/components';

<Image
  source="https://example.com/image.jpg"
  alt="Product photo"
  width={300}
  height={200}
  objectFit="cover"
  borderRadius={8}
  placeholder={<ActivityIndicator />}
  fallback={<Text>Failed to load</Text>}
/>
`,
  examples: {
    basic: `import { Image } from '@idealyst/components';

<Image
  source="https://picsum.photos/200/300"
  alt="Random image"
  width={200}
  height={300}
/>`,

    variants: `import { Image, View } from '@idealyst/components';

<View spacing="md">
  <Image
    source="https://picsum.photos/300/200"
    alt="Cover"
    width={300}
    height={200}
    objectFit="cover"
  />
  <Image
    source="https://picsum.photos/300/200"
    alt="Contain"
    width={300}
    height={200}
    objectFit="contain"
  />
</View>`,

    "with-icons": `import { Image, Card, View, Text } from '@idealyst/components';

<Card type="outlined">
  <Image
    source="https://picsum.photos/400/250"
    alt="Card image"
    width="100%"
    aspectRatio={16 / 9}
    objectFit="cover"
    borderRadius={8}
  />
  <View spacing="sm" style={{ padding: 16 }}>
    <Text weight="bold">Image Title</Text>
    <Text size="sm">Description text</Text>
  </View>
</Card>`,

    interactive: `import { Image, ActivityIndicator, Text, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <View spacing="sm">
      <Image
        source="https://picsum.photos/300/200"
        alt="Example"
        width={300}
        height={200}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        placeholder={<ActivityIndicator />}
        fallback={<Text>Failed to load image</Text>}
      />
      {loaded && <Text color="success">Image loaded!</Text>}
      {error && <Text color="error">Failed to load</Text>}
    </View>
  );
}`,
  },
};
