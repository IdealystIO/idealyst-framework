import React, { useRef, useState } from 'react';
import { View, Text, Button } from '@idealyst/components';
import Menu from '../Menu';
import type { MenuItem } from '../Menu/types';

export const MenuExamples: React.FC = () => {
  const [basicMenuOpen, setBasicMenuOpen] = useState(false);
  const [placementMenuOpen, setPlacementMenuOpen] = useState(false);
  const [iconNameMenuOpen, setIconNameMenuOpen] = useState(false);
  const [intentMenuOpen, setIntentMenuOpen] = useState(false);
  const [separatorMenuOpen, setSeparatorMenuOpen] = useState(false);
  const [disabledMenuOpen, setDisabledMenuOpen] = useState(false);

  const basicButtonRef = useRef<HTMLDivElement>(null);
  const placementButtonRef = useRef<HTMLDivElement>(null);
  const iconNameButtonRef = useRef<HTMLDivElement>(null);
  const intentButtonRef = useRef<HTMLDivElement>(null);
  const separatorButtonRef = useRef<HTMLDivElement>(null);
  const disabledButtonRef = useRef<HTMLDivElement>(null);

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
    { id: 'delete', label: 'Delete', icon: 'delete', onClick: () => setSelectedAction('Delete'), intent: 'error' },
  ];

  const intentItems: MenuItem[] = [
    { id: 'save', label: 'Save', intent: 'success', onClick: () => setSelectedAction('Save') },
    { id: 'cancel', label: 'Cancel', intent: 'neutral', onClick: () => setSelectedAction('Cancel') },
    { id: 'delete', label: 'Delete', intent: 'error', onClick: () => setSelectedAction('Delete') },
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
    <View spacing="lg">
      <Text size="xlarge" weight="bold">Menu Examples</Text>

      {selectedAction && (
        <View spacing="sm" style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text>Last selected action: <Text weight="bold">{selectedAction}</Text></Text>
        </View>
      )}

      <View spacing="md">
        <Text size="large" weight="semibold">Basic Menu</Text>
        <div ref={basicButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setBasicMenuOpen(!basicMenuOpen)}
          >
            Open Menu
          </Button>
        </div>
        <Menu
          items={basicItems}
          open={basicMenuOpen}
          onOpenChange={setBasicMenuOpen}
          anchor={basicButtonRef}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Placement Options</Text>
        <div ref={placementButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setPlacementMenuOpen(!placementMenuOpen)}
          >
            Bottom Start (default)
          </Button>
        </div>
        <Menu
          items={basicItems}
          open={placementMenuOpen}
          onOpenChange={setPlacementMenuOpen}
          anchor={placementButtonRef}
          placement="bottom-start"
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Icons</Text>
        <div ref={iconNameButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setIconNameMenuOpen(!iconNameMenuOpen)}
          >
            Menu with Icons
          </Button>
        </div>
        <Menu
          items={iconNameItems}
          open={iconNameMenuOpen}
          onOpenChange={setIconNameMenuOpen}
          anchor={iconNameButtonRef}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Intent Colors</Text>
        <div ref={intentButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setIntentMenuOpen(!intentMenuOpen)}
          >
            Intent Menu
          </Button>
        </div>
        <Menu
          items={intentItems}
          open={intentMenuOpen}
          onOpenChange={setIntentMenuOpen}
          anchor={intentButtonRef}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Separators</Text>
        <div ref={separatorButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setSeparatorMenuOpen(!separatorMenuOpen)}
          >
            File Menu
          </Button>
        </div>
        <Menu
          items={separatorItems}
          open={separatorMenuOpen}
          onOpenChange={setSeparatorMenuOpen}
          anchor={separatorButtonRef}
        />
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled Items</Text>
        <div ref={disabledButtonRef} style={{ display: 'inline-block' }}>
          <Button
            variant="outlined"
            onPress={() => setDisabledMenuOpen(!disabledMenuOpen)}
          >
            Menu with Disabled
          </Button>
        </div>
        <Menu
          items={disabledItems}
          open={disabledMenuOpen}
          onOpenChange={setDisabledMenuOpen}
          anchor={disabledButtonRef}
        />
      </View>
    </View>
  );
};

export default MenuExamples;
