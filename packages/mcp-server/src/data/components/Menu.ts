export const Menu = {
  category: "overlay",
  description: "Contextual menu with list of actions, typically triggered by a button or other element",
  props: `
- \`items\`: MenuItem[] - Array of menu items
  - \`id\`: string - Unique identifier
  - \`label\`: string - Menu item label
  - \`onClick\`: () => void - Click handler
  - \`disabled\`: boolean - Whether item is disabled
  - \`icon\`: IconName | ReactNode - Icon (string name or custom element)
  - \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
  - \`separator\`: boolean - Show separator after this item
- \`open\`: boolean - Whether menu is open
- \`onOpenChange\`: (open: boolean) => void - Open state change handler
- \`anchor\`: React.RefObject<HTMLElement> - Anchor element to position menu
- \`placement\`: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right' - Menu placement
- \`closeOnSelection\`: boolean - Close menu when item selected (default: true)
- \`size\`: 'small' | 'medium' | 'large' - Menu item size
- \`style\`: ViewStyle - Additional custom styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Icon support for menu items",
    "Intent colors for items",
    "Separators between items",
    "Disabled items",
    "Multiple placement options",
    "Auto-close on selection",
    "Three size options",
  ],
  bestPractices: [
    "Use separators to group related actions",
    "Place destructive actions at the bottom with error intent",
    "Keep menu items concise (1-3 words)",
    "Use icons for visual scanning",
    "Close menu after action unless multi-select",
  ],
  usage: `
import { Menu, Button } from '@idealyst/components';
import { useState, useRef } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const items = [
    { id: '1', label: 'Edit', icon: 'pencil', onClick: () => handleEdit() },
    { id: '2', label: 'Duplicate', icon: 'content-copy', onClick: () => handleDuplicate() },
    { id: '3', label: 'Delete', icon: 'delete', intent: 'error', onClick: () => handleDelete(), separator: true },
  ];

  return (
    <>
      <div ref={buttonRef}>
        <Button onPress={() => setOpen(true)}>Actions</Button>
      </div>
      <Menu
        items={items}
        open={open}
        onOpenChange={setOpen}
        anchor={buttonRef}
        placement="bottom-start"
      />
    </>
  );
}
`,
  examples: {
    basic: `import { Menu, Button } from '@idealyst/components';
import { useRef, useState } from 'react';

const buttonRef = useRef(null);
const [open, setOpen] = useState(false);

const items = [
  { id: '1', label: 'Option 1', onClick: () => console.log('1') },
  { id: '2', label: 'Option 2', onClick: () => console.log('2') },
];

<div ref={buttonRef}>
  <Button onPress={() => setOpen(true)}>Menu</Button>
</div>
<Menu items={items} open={open} onOpenChange={setOpen} anchor={buttonRef} />`,

    variants: `import { Menu } from '@idealyst/components';

// Different sizes
<Menu items={items} open={open} onOpenChange={setOpen} anchor={ref} size="small" />
<Menu items={items} open={open} onOpenChange={setOpen} anchor={ref} size="medium" />
<Menu items={items} open={open} onOpenChange={setOpen} anchor={ref} size="large" />`,

    "with-icons": `import { Menu, Button } from '@idealyst/components';
import { useRef, useState } from 'react';

const items = [
  { id: '1', label: 'Profile', icon: 'account', onClick: () => navigate('/profile') },
  { id: '2', label: 'Settings', icon: 'cog', onClick: () => navigate('/settings') },
  { id: '3', label: 'Logout', icon: 'logout', intent: 'error', onClick: () => logout(), separator: true },
];

<Menu items={items} open={open} onOpenChange={setOpen} anchor={buttonRef} />`,

    interactive: `import { Menu, Button, Text, View } from '@idealyst/components';
import { useRef, useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const buttonRef = useRef(null);

  const items = [
    { id: 'edit', label: 'Edit', icon: 'pencil', onClick: () => setSelected('edit') },
    { id: 'share', label: 'Share', icon: 'share', onClick: () => setSelected('share') },
    { id: 'delete', label: 'Delete', icon: 'delete', intent: 'error', onClick: () => setSelected('delete') },
  ];

  return (
    <View spacing="md">
      <div ref={buttonRef}>
        <Button onPress={() => setOpen(true)}>Actions</Button>
      </div>
      <Menu
        items={items}
        open={open}
        onOpenChange={setOpen}
        anchor={buttonRef}
        placement="bottom-start"
      />
      {selected && <Text>Selected: {selected}</Text>}
    </View>
  );
}`,
  },
};
