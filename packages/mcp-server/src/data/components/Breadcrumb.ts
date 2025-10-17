export const Breadcrumb = {
  category: "navigation",
  description: "Navigation aid showing the current location within a hierarchy",
  props: `
- \`items\`: BreadcrumbItem[] - Array of breadcrumb items
  - \`label\`: string - Label text for the breadcrumb item
  - \`icon\`: IconName | ReactNode - Optional icon (icon name string or custom component)
  - \`onPress\`: () => void - Click handler for the breadcrumb item
  - \`disabled\`: boolean - Whether this item is disabled
- \`separator\`: ReactNode - Custom separator between items (default: '/')
- \`maxItems\`: number - Maximum number of items before truncating
- \`intent\`: 'primary' | 'neutral' - Intent color for links
- \`size\`: 'small' | 'medium' | 'large' - Size of breadcrumb text
- \`style\`: StyleProp<ViewStyle> - Custom container style
- \`itemStyle\`: StyleProp<ViewStyle> - Custom item style
- \`separatorStyle\`: StyleProp<TextStyle> - Custom separator style
- \`testID\`: string - Test identifier
`,
  features: [
    "Icon support with string names or custom components",
    "Custom separators",
    "Truncation with maxItems",
    "Two intent colors",
    "Three sizes",
    "Disabled items",
    "Click handlers for navigation",
  ],
  bestPractices: [
    "Keep breadcrumb labels short and clear",
    "Last item should represent current page (typically not clickable)",
    "Use icons sparingly for visual clarity",
    "Set maxItems for deep hierarchies to avoid overflow",
    "Use 'neutral' intent for subtle breadcrumbs",
  ],
  usage: `
import { Breadcrumb } from '@idealyst/components';

const items = [
  { label: 'Home', icon: 'home', onPress: () => navigate('/') },
  { label: 'Products', onPress: () => navigate('/products') },
  { label: 'Electronics', onPress: () => navigate('/products/electronics') },
  { label: 'Laptop' }, // Current page, no onPress
];

<Breadcrumb items={items} intent="primary" />
`,
  examples: {
    basic: `import { Breadcrumb } from '@idealyst/components';

const items = [
  { label: 'Home', onPress: () => console.log('Home') },
  { label: 'Products', onPress: () => console.log('Products') },
  { label: 'Item' },
];

<Breadcrumb items={items} />`,

    variants: `import { Breadcrumb, View } from '@idealyst/components';

const items = [
  { label: 'Home', onPress: () => {} },
  { label: 'Category', onPress: () => {} },
  { label: 'Item' },
];

<View spacing="md">
  <Breadcrumb items={items} size="small" />
  <Breadcrumb items={items} size="medium" />
  <Breadcrumb items={items} size="large" />
</View>`,

    "with-icons": `import { Breadcrumb } from '@idealyst/components';

const items = [
  { label: 'Home', icon: 'home', onPress: () => navigate('/') },
  { label: 'Settings', icon: 'cog', onPress: () => navigate('/settings') },
  { label: 'Profile', icon: 'account' },
];

<Breadcrumb items={items} intent="primary" />`,

    interactive: `import { Breadcrumb } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [path, setPath] = useState(['Home', 'Products', 'Electronics']);

  const items = path.map((label, index) => ({
    label,
    onPress: index < path.length - 1
      ? () => setPath(path.slice(0, index + 1))
      : undefined,
  }));

  return <Breadcrumb items={items} maxItems={4} />;
}`,
  },
};
