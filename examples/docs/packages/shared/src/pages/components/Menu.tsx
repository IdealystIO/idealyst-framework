import React from 'react';
import { View, Text, Menu, Button, Screen } from '@idealyst/components';
import { ComponentPlayground, menuPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper with sample items
function DemoMenu(props: any) {
  const items = [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'copy', label: 'Copy', icon: 'content-copy' },
    { id: 'delete', label: 'Delete', icon: 'delete', intent: 'danger' },
  ];
  return (
    <Menu {...props} items={items}>
      <Button>Open Menu</Button>
    </Menu>
  );
}

export function MenuPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Menu
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Dropdown menu for contextual actions triggered by a button or element.
          Supports icons, separators, and keyboard navigation.
        </Text>

        <ComponentPlayground
          component={DemoMenu}
          componentName="Menu"
          propConfig={menuPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
