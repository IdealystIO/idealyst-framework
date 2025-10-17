export const Skeleton = {
  category: "feedback",
  description: "Loading placeholder that mimics content structure while data loads",
  props: `
Skeleton Props:
- \`width\`: number | string - Width of skeleton (default: '100%')
- \`height\`: number | string - Height of skeleton (default: 20)
- \`shape\`: 'rectangle' | 'circle' | 'rounded' - Shape of skeleton (default: 'rectangle')
- \`borderRadius\`: number - Border radius for 'rounded' shape (default: 8)
- \`animation\`: 'pulse' | 'wave' | 'none' - Animation type (default: 'pulse')
- \`style\`: ViewStyle - Additional custom styles
- \`testID\`: string - Test identifier

SkeletonGroup Props:
- \`count\`: number - Number of skeleton items (default: 3)
- \`spacing\`: number - Spacing between items in pixels (default: 12)
- \`skeletonProps\`: Omit<SkeletonProps, 'testID'> - Props for each skeleton
- \`style\`: ViewStyle - Container styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Three shapes: rectangle, circle, rounded",
    "Three animation types",
    "Configurable dimensions",
    "Group component for multiple skeletons",
    "Customizable spacing",
    "Mimics content structure",
  ],
  bestPractices: [
    "Match skeleton shape to actual content",
    "Use pulse animation for general loading",
    "Use wave animation for feed-like content",
    "Show skeleton while data is loading",
    "Replace skeleton with actual content smoothly",
    "Use SkeletonGroup for consistent layouts",
  ],
  usage: `
import { Skeleton, SkeletonGroup } from '@idealyst/components';

// Single skeleton
<Skeleton width={200} height={20} shape="rounded" />

// Multiple skeletons
<SkeletonGroup
  count={3}
  spacing={16}
  skeletonProps={{ width: '100%', height: 60, shape: 'rounded' }}
/>
`,
  examples: {
    basic: `import { Skeleton } from '@idealyst/components';

<Skeleton width={150} height={20} />`,

    variants: `import { Skeleton, View } from '@idealyst/components';

<View spacing="md">
  <Skeleton width="100%" height={20} shape="rectangle" />
  <Skeleton width={100} height={100} shape="circle" />
  <Skeleton width={200} height={40} shape="rounded" />
</View>`,

    "with-icons": `import { Skeleton, View } from '@idealyst/components';

// Mimicking a user card
<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
  <Skeleton width={48} height={48} shape="circle" />
  <View spacing="sm" style={{ flex: 1 }}>
    <Skeleton width="60%" height={16} />
    <Skeleton width="40%" height={14} />
  </View>
</View>`,

    interactive: `import { Skeleton, SkeletonGroup, View, Card, Text, Button } from '@idealyst/components';
import { useState, useEffect } from 'react';

function Example() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ title: 'Article Title', content: 'Article content...' });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <Card padding="medium">
        <View spacing="md">
          <Skeleton width="80%" height={24} shape="rounded" />
          <SkeletonGroup
            count={3}
            skeletonProps={{ width: '100%', height: 16 }}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card padding="medium">
      <View spacing="md">
        <Text size="large" weight="bold">{data.title}</Text>
        <Text>{data.content}</Text>
      </View>
    </Card>
  );
}`,
  },
};
