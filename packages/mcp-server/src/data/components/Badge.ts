export const Badge = {
category: "display",
    description: "Small status indicator with various styles and colors",
    props: `
- \`variant\`: 'filled' | 'outlined' | 'dot' - Visual style
- \`color\`: string - Badge color from theme palette
- \`size\`: 'sm' | 'md' | 'lg' - Badge size
- \`icon\`: string | ReactNode - Icon to display
- \`children\`: ReactNode - Badge content (text/number)
`,
    features: [
      "Three visual variants",
      "Theme palette color support",
      "Three sizes",
      "Icon support",
      "Dot variant for minimal indicators",
    ],
    bestPractices: [
      "Use 'dot' variant for minimal status indicators",
      "Use 'filled' variant for prominent badges",
      "Keep badge content short (numbers or 1-2 words)",
      "Use appropriate colors for semantic meaning",
    ],
    usage: `
import { Badge } from '@idealyst/components';

<Badge variant="filled" color="red">
  3
</Badge>
`,
    examples: {
      basic: `import { Badge } from '@idealyst/components';

<Badge>New</Badge>`,
      variants: `import { Badge } from '@idealyst/components';

<Badge variant="filled" color="blue">5</Badge>
<Badge variant="outlined" color="green">Active</Badge>
<Badge variant="dot" color="red" />`,
      "with-icons": `import { Badge } from '@idealyst/components';

<Badge icon="star" color="yellow">
  Featured
</Badge>`,
      interactive: `import { Badge, Button, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <View spacing="sm">
      <Badge variant="filled" color="red">
        {count}
      </Badge>
      <Button onPress={() => setCount(count + 1)}>
        Increment
      </Button>
    </View>
  );
}`,
    }
};
