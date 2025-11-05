export const List = {
category: "display",
    description: "Vertical list container with support for sections, icons, and interactive items",
        props: `
- \`children\`: React.ReactNode - List items and sections to display
- \`type\`: ListType - The visual style variant of the list
- \`size\`: ListSizeVariant - The size variant of list items
- \`scrollable\`: boolean - Whether the list is scrollable
- \`maxHeight\`: number | string - Maximum height of the scrollable list
`,
    features: [
      "Three visual variants",
      "Configurable item sizes",
      "Leading and trailing elements (icons, badges, etc.)",
      "Selected and active states",
      "Section grouping with titles",
      "Indentation for hierarchy",
      "Icon support via string names",
    ],
    bestPractices: [
      "Use sections to organize related items",
      "Use leading icons for visual categorization",
      "Use trailing elements for metadata or actions",
      "Keep list items concise and scannable",
    ],
    usage: `
import { List, ListItem, ListSection } from '@idealyst/components';

<List type="bordered">
  <ListSection title="Main">
    <ListItem
      label="Dashboard"
      leading="home"
      onPress={() => navigate('/dashboard')}
    />
    <ListItem
      label="Settings"
      leading="cog"
      onPress={() => navigate('/settings')}
    />
  </ListSection>
</List>
`,
    examples: {
      basic: `import { List, ListItem } from '@idealyst/components';

<List type="divided">
  <ListItem label="Item 1" />
  <ListItem label="Item 2" />
  <ListItem label="Item 3" />
</List>`,
      variants: `import { List, ListItem } from '@idealyst/components';

<List type="default">
  <ListItem label="Default" />
</List>

<List type="bordered">
  <ListItem label="Bordered" />
</List>

<List type="divided">
  <ListItem label="Divided" />
</List>`,
      "with-icons": `import { List, ListItem, Badge } from '@idealyst/components';

<List type="bordered">
  <ListItem
    label="Notifications"
    leading="bell"
    trailing={<Badge>3</Badge>}
  />
  <ListItem
    label="Messages"
    leading="email"
    trailing={<Badge>12</Badge>}
  />
</List>`,
      interactive: `import { List, ListItem } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [selected, setSelected] = useState('home');

  return (
    <List type="bordered">
      <ListItem
        label="Home"
        leading="home"
        selected={selected === 'home'}
        onPress={() => setSelected('home')}
      />
      <ListItem
        label="Profile"
        leading="account"
        selected={selected === 'profile'}
        onPress={() => setSelected('profile')}
      />
    </List>
  );
}`,
    }
};
