import React, { useRef, useState } from 'react';
import { Screen, View, Text, Button, Menu, MenuItem } from '@idealyst/components';

export const MenuExamples: React.FC = () => {
  const [basicMenuOpen, setBasicMenuOpen] = useState(false);
  const [anchorMenuOpen, setAnchorMenuOpen] = useState(false);
  const [placementMenuOpen, setPlacementMenuOpen] = useState(false);
  const [iconNameMenuOpen, setIconNameMenuOpen] = useState(false);
  const [intentMenuOpen, setIntentMenuOpen] = useState(false);
  const [separatorMenuOpen, setSeparatorMenuOpen] = useState(false);
  const [disabledMenuOpen, setDisabledMenuOpen] = useState(false);
  const [rightEdgeMenuOpen, setRightEdgeMenuOpen] = useState(false);
  const [bottomEdgeMenuOpen, setBottomEdgeMenuOpen] = useState(false);

  const anchorRef = useRef(null);

  const [selectedAction, setSelectedAction] = useState<string>('');

  const basicItems: MenuItem[] = [
    { id: 'action1', label: 'Action 1', onClick: () => setSelectedAction('Action 1') },
    { id: 'action2', label: 'Action 2', onClick: () => setSelectedAction('Action 2') },
    { id: 'action3', label: 'Action 3', onClick: () => setSelectedAction('Action 3') },
  ];

  const iconNameItems: MenuItem[] = [
    { id: 'edit', label: 'Edit', icon: 'pencil', onClick: () => setSelectedAction('Edit') },
    { id: 'copy', label: 'Copy', icon: 'content-copy', onClick: () => setSelectedAction('Copy') },
    { id: 'share', label: 'Share', icon: 'share-variant', onClick: () => setSelectedAction('Share'), intent: 'primary' },
    { id: 'delete', label: 'Delete', icon: 'delete', onClick: () => setSelectedAction('Delete'), intent: 'danger' },
  ];

  const intentItems: MenuItem[] = [
    { id: 'save', label: 'Save', intent: 'success', onClick: () => setSelectedAction('Save') },
    { id: 'cancel', label: 'Cancel', intent: 'neutral', onClick: () => setSelectedAction('Cancel') },
    { id: 'delete', label: 'Delete', intent: 'danger', onClick: () => setSelectedAction('Delete') },
    { id: 'warn', label: 'Warning Action', intent: 'warning', onClick: () => setSelectedAction('Warning') },
  ];

  const separatorItems: MenuItem[] = [
    { id: 'new', label: 'New', onClick: () => setSelectedAction('New') },
    { id: 'open', label: 'Open', onClick: () => setSelectedAction('Open') },
    { id: 'sep1', label: '', separator: true },
    { id: 'save', label: 'Save', onClick: () => setSelectedAction('Save') },
    { id: 'saveas', label: 'Save As...', onClick: () => setSelectedAction('Save As') },
    { id: 'sep2', label: '', separator: true },
    { id: 'close', label: 'Close', onClick: () => setSelectedAction('Close') },
  ];

  const disabledItems: MenuItem[] = [
    { id: 'enabled1', label: 'Enabled Action', onClick: () => setSelectedAction('Enabled') },
    { id: 'disabled', label: 'Disabled Action', disabled: true },
    { id: 'enabled2', label: 'Another Action', onClick: () => setSelectedAction('Another') },
  ];

  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">Menu Examples</Text>

      {selectedAction && (
        <View gap="sm" style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text>Last selected action: <Text weight="bold">{selectedAction}</Text></Text>
        </View>
      )}

      <View gap="md">
        <Text typography="h5">Basic Menu (Children Mode)</Text>
        <Menu
          items={basicItems}
          open={basicMenuOpen}
          onOpenChange={setBasicMenuOpen}
        >
          <Button type="outlined">
            Open Menu
          </Button>
        </Menu>
      </View>

      <View gap="md">
        <Text typography="h5">Anchor Mode</Text>
        <Text typography="body2" color="secondary">
          The menu appears next to the anchor element, not the button.
        </Text>
        <View direction="row" gap="md" align="center">
          <Button type="outlined" onPress={() => setAnchorMenuOpen(true)}>
            Open Anchored Menu
          </Button>
          <View ref={anchorRef} style={{ padding: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#999', borderRadius: 8 }}>
            <Text color="secondary">Anchor</Text>
          </View>
        </View>
        <Menu
          items={iconNameItems}
          anchor={anchorRef}
          open={anchorMenuOpen}
          onOpenChange={setAnchorMenuOpen}
        />
      </View>

      <View gap="md">
        <Text typography="h5">Placement Options</Text>
        <Menu
          items={basicItems}
          open={placementMenuOpen}
          onOpenChange={setPlacementMenuOpen}
          placement="bottom-start"
        >
          <Button type="outlined">
            Bottom Start (default)
          </Button>
        </Menu>
      </View>

      <View gap="md">
        <Text typography="h5">With Icons</Text>
        <Menu
          items={iconNameItems}
          open={iconNameMenuOpen}
          onOpenChange={setIconNameMenuOpen}
        >
          <Button type="outlined">
            Menu with Icons
          </Button>
        </Menu>
      </View>

      <View gap="md">
        <Text typography="h5">Intent Colors</Text>
        <Menu
          items={intentItems}
          open={intentMenuOpen}
          onOpenChange={setIntentMenuOpen}
        >
          <Button type="outlined">
            Intent Menu
          </Button>
        </Menu>
      </View>

      <View gap="md">
        <Text typography="h5">With Separators</Text>
        <Menu
          items={separatorItems}
          open={separatorMenuOpen}
          onOpenChange={setSeparatorMenuOpen}
        >
          <Button type="outlined">
            File Menu
          </Button>
        </Menu>
      </View>

      <View gap="md">
        <Text typography="h5">Disabled Items</Text>
        <Menu
          items={disabledItems}
          open={disabledMenuOpen}
          onOpenChange={setDisabledMenuOpen}
        >
          <Button type="outlined">
            Menu with Disabled
          </Button>
        </Menu>
      </View>

      <Text typography="h4">Edge-of-Screen Tests</Text>
      <Text typography="body2" color="secondary">
        These menus should flip or clamp to stay within the viewport.
      </Text>

      <View style={{ alignItems: 'flex-end' }}>
        <Menu
          items={iconNameItems}
          open={rightEdgeMenuOpen}
          onOpenChange={setRightEdgeMenuOpen}
          placement="bottom-end"
        >
          <Button type="outlined">
            Right Edge
          </Button>
        </Menu>
      </View>

      <View style={{ marginTop: 200 }}>
        <Menu
          items={separatorItems}
          open={bottomEdgeMenuOpen}
          onOpenChange={setBottomEdgeMenuOpen}
          placement="bottom-start"
        >
          <Button type="outlined">
            Bottom Edge (scroll down)
          </Button>
        </Menu>
      </View>
    </View>
    </Screen>
  );
};

export default MenuExamples;
