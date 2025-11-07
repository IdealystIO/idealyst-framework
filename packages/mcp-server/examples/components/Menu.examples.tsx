/**
 * Menu Component Examples
 *
 * These examples are type-checked against the actual MenuProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Menu, View, Text, Button, Icon } from '@idealyst/components';
import type { MenuItem } from '@idealyst/components';

// Example 1: Basic Menu
export function BasicMenu() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Profile', onClick: () => console.log('Profile') },
    { id: '2', label: 'Settings', onClick: () => console.log('Settings') },
    { id: '3', label: 'Logout', onClick: () => console.log('Logout') },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>Open Menu</Button>
    </Menu>
  );
}

// Example 2: Menu with Icons
export function MenuWithIcons() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Profile', icon: 'account', onClick: () => console.log('Profile') },
    { id: '2', label: 'Settings', icon: 'cog', onClick: () => console.log('Settings') },
    { id: '3', label: 'Help', icon: 'help-circle', onClick: () => console.log('Help') },
    { id: '4', label: 'Logout', icon: 'logout', onClick: () => console.log('Logout') },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>User Menu</Button>
    </Menu>
  );
}

// Example 3: Menu with Custom Icon Components
export function MenuWithCustomIcons() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    {
      id: '1',
      label: 'Dashboard',
      icon: <Icon name="view-dashboard" size="sm" />,
      onClick: () => console.log('Dashboard'),
    },
    {
      id: '2',
      label: 'Analytics',
      icon: <Icon name="chart-line" size="sm" />,
      onClick: () => console.log('Analytics'),
    },
    {
      id: '3',
      label: 'Reports',
      icon: <Icon name="file-chart" size="sm" />,
      onClick: () => console.log('Reports'),
    },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>Navigation</Button>
    </Menu>
  );
}

// Example 4: Menu Sizes
export function MenuSizes() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Option 1', onClick: () => {} },
    { id: '2', label: 'Option 2', onClick: () => {} },
    { id: '3', label: 'Option 3', onClick: () => {} },
  ];

  return (
    <View spacing="md">
      <Menu items={items} size="xs" open={open} onOpenChange={setOpen}>
        <Button size="xs" onPress={() => setOpen(true)}>
          XS Menu
        </Button>
      </Menu>
      <Menu items={items} size="sm" open={open} onOpenChange={setOpen}>
        <Button size="sm" onPress={() => setOpen(true)}>
          SM Menu
        </Button>
      </Menu>
      <Menu items={items} size="md" open={open} onOpenChange={setOpen}>
        <Button size="md" onPress={() => setOpen(true)}>
          MD Menu
        </Button>
      </Menu>
      <Menu items={items} size="lg" open={open} onOpenChange={setOpen}>
        <Button size="lg" onPress={() => setOpen(true)}>
          LG Menu
        </Button>
      </Menu>
    </View>
  );
}

// Example 5: Menu Placements
export function MenuPlacements() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Option 1', onClick: () => {} },
    { id: '2', label: 'Option 2', onClick: () => {} },
    { id: '3', label: 'Option 3', onClick: () => {} },
  ];

  return (
    <View spacing="md">
      <Menu items={items} placement="bottom" open={open} onOpenChange={setOpen}>
        <Button onPress={() => setOpen(true)}>Bottom</Button>
      </Menu>
      <Menu items={items} placement="top" open={open} onOpenChange={setOpen}>
        <Button onPress={() => setOpen(true)}>Top</Button>
      </Menu>
      <Menu items={items} placement="left" open={open} onOpenChange={setOpen}>
        <Button onPress={() => setOpen(true)}>Left</Button>
      </Menu>
      <Menu items={items} placement="right" open={open} onOpenChange={setOpen}>
        <Button onPress={() => setOpen(true)}>Right</Button>
      </Menu>
    </View>
  );
}

// Example 6: Menu with Intent Colors
export function MenuWithIntent() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Edit', icon: 'pencil', intent: 'primary', onClick: () => {} },
    { id: '2', label: 'Duplicate', icon: 'content-copy', intent: 'info', onClick: () => {} },
    { id: '3', label: 'Archive', icon: 'archive', intent: 'warning', onClick: () => {} },
    { id: '4', label: 'Delete', icon: 'delete', intent: 'error', onClick: () => {} },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>Actions</Button>
    </Menu>
  );
}

// Example 7: Menu with Separators
export function MenuWithSeparators() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'New File', icon: 'file-plus', onClick: () => {} },
    { id: '2', label: 'New Folder', icon: 'folder-plus', onClick: () => {} },
    { id: '3', label: 'separator-1', separator: true },
    { id: '4', label: 'Open', icon: 'folder-open', onClick: () => {} },
    { id: '5', label: 'Save', icon: 'content-save', onClick: () => {} },
    { id: '6', label: 'separator-2', separator: true },
    { id: '7', label: 'Exit', icon: 'exit-to-app', onClick: () => {} },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>File</Button>
    </Menu>
  );
}

// Example 8: Menu with Disabled Items
export function MenuWithDisabledItems() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'Cut', icon: 'content-cut', onClick: () => {} },
    { id: '2', label: 'Copy', icon: 'content-copy', onClick: () => {} },
    { id: '3', label: 'Paste', icon: 'content-paste', disabled: true },
    { id: '4', label: 'separator', separator: true },
    { id: '5', label: 'Undo', icon: 'undo', disabled: true },
    { id: '6', label: 'Redo', icon: 'redo', onClick: () => {} },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen}>
      <Button onPress={() => setOpen(true)}>Edit</Button>
    </Menu>
  );
}

// Example 9: Menu with Close on Selection
export function MenuWithCloseOnSelection() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('');

  const items: MenuItem[] = [
    {
      id: '1',
      label: 'Option 1',
      onClick: () => {
        setSelected('Option 1');
        console.log('Selected Option 1');
      },
    },
    {
      id: '2',
      label: 'Option 2',
      onClick: () => {
        setSelected('Option 2');
        console.log('Selected Option 2');
      },
    },
    {
      id: '3',
      label: 'Option 3',
      onClick: () => {
        setSelected('Option 3');
        console.log('Selected Option 3');
      },
    },
  ];

  return (
    <View spacing="md">
      <Menu items={items} open={open} onOpenChange={setOpen} closeOnSelection>
        <Button onPress={() => setOpen(true)}>Select Option</Button>
      </Menu>
      {selected && (
        <Text size="sm" >
          Selected: {selected}
        </Text>
      )}
    </View>
  );
}

// Example 10: Context Menu
export function ContextMenu() {
  const [open, setOpen] = React.useState(false);

  const items: MenuItem[] = [
    { id: '1', label: 'View Details', icon: 'information', onClick: () => {} },
    { id: '2', label: 'Share', icon: 'share', onClick: () => {} },
    { id: '3', label: 'separator', separator: true },
    { id: '4', label: 'Rename', icon: 'pencil', onClick: () => {} },
    { id: '5', label: 'Move', icon: 'folder-move', onClick: () => {} },
    { id: '6', label: 'separator-2', separator: true },
    { id: '7', label: 'Delete', icon: 'delete', intent: 'error', onClick: () => {} },
  ];

  return (
    <Menu items={items} open={open} onOpenChange={setOpen} placement="bottom-start">
      <View
        background="primary"
        spacing="lg"
        radius="md"
        border="thin"
        style={{ cursor: 'pointer' }}
      >
        <Text>Right-click me (or click to open menu)</Text>
        <Button size="sm" onPress={() => setOpen(true)}>
          Open Context Menu
        </Button>
      </View>
    </Menu>
  );
}

// Example 11: Dropdown Menu
export function DropdownMenu() {
  const [open, setOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('name');

  const items: MenuItem[] = [
    {
      id: '1',
      label: 'Name',
      icon: sortBy === 'name' ? 'check' : undefined,
      onClick: () => setSortBy('name'),
    },
    {
      id: '2',
      label: 'Date',
      icon: sortBy === 'date' ? 'check' : undefined,
      onClick: () => setSortBy('date'),
    },
    {
      id: '3',
      label: 'Size',
      icon: sortBy === 'size' ? 'check' : undefined,
      onClick: () => setSortBy('size'),
    },
    {
      id: '4',
      label: 'Type',
      icon: sortBy === 'type' ? 'check' : undefined,
      onClick: () => setSortBy('type'),
    },
  ];

  return (
    <View spacing="md">
      <Menu items={items} open={open} onOpenChange={setOpen} closeOnSelection>
        <Button type="outlined" onPress={() => setOpen(true)}>
          Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
        </Button>
      </Menu>
    </View>
  );
}
