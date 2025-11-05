export const Breadcrumb = {
  category: "navigation",
  description: "Navigation aid showing the current location within a hierarchy",
      props: `
- \`items\`: BreadcrumbItem[] - Array of breadcrumb items
- \`separator\`: React.ReactNode - Custom separator between items (default: '/')
- \`maxItems\`: number - Maximum number of items to show before truncating
- \`intent\`: BreadcrumbIntentVariant - Intent color for links
- \`size\`: BreadcrumbSizeVariant - Size of the breadcrumb text
- \`itemStyle\`: StyleProp<ViewStyle> - Custom item style
- \`separatorStyle\`: StyleProp<TextStyle> - Custom separator style
- \`responsive\`: boolean - Enable responsive collapsing on narrow screens
- \`minVisibleItems\`: number - Minimum number of items to show before collapsing (default: 3)
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
  <Breadcrumb items={items} size="sm" />
  <Breadcrumb items={items} size="md" />
  <Breadcrumb items={items} size="lg" />
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
