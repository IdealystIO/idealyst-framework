export const List = {
category: "display",
    description: "Vertical list container with support for sections, icons, and interactive items",
    props: `
List Props:
- \`variant\`: 'default' | 'bordered' | 'divided' - Visual style
- \`size\`: 'sm' | 'md' | 'lg' - Item size
- \`children\`: ListItem | ListSection - List content

ListItem Props:
- \`label\`: string - Item label text
- \`leading\`: string | ReactNode - Leading icon or element
- \`trailing\`: string | ReactNode - Trailing icon or element
- \`selected\`: boolean - Selected state
- \`active\`: boolean - Active state
- \`disabled\`: boolean - Disabled state
- \`indent\`: number - Indentation level
- \`onPress\`: () => void - Press handler
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

<List variant="bordered">
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

<List variant="divided">
  <ListItem label="Item 1" />
  <ListItem label="Item 2" />
  <ListItem label="Item 3" />
</List>`,
      variants: `import { List, ListItem } from '@idealyst/components';

<List variant="default">
  <ListItem label="Default" />
</List>

<List variant="bordered">
  <ListItem label="Bordered" />
</List>

<List variant="divided">
  <ListItem label="Divided" />
</List>`,
      "with-icons": `import { List, ListItem, Badge } from '@idealyst/components';

<List variant="bordered">
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
    <List variant="bordered">
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
