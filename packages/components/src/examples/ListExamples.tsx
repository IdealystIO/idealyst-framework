import React, { useState } from 'react';
import { View, Text, Badge } from '@idealyst/components';
import { List, ListItem, ListSection } from '../List';

export const ListExamples: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState('home');
  const [selectedNav, setSelectedNav] = useState('dashboard');

  return (
    <View spacing="lg">
      <Text size="xlarge" weight="bold">List Examples</Text>

      <View spacing="md">
        <Text size="large" weight="semibold">Basic List</Text>
        <List variant="divided">
          <ListItem label="Item 1" />
          <ListItem label="Item 2" />
          <ListItem label="Item 3" />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Variants</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="small" weight="medium">Default</Text>
            <List variant="default">
              <ListItem label="Item 1" />
              <ListItem label="Item 2" />
              <ListItem label="Item 3" />
            </List>
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Bordered</Text>
            <List variant="bordered">
              <ListItem label="Item 1" />
              <ListItem label="Item 2" />
              <ListItem label="Item 3" />
            </List>
          </View>
          <View spacing="xs">
            <Text size="small" weight="medium">Divided</Text>
            <List variant="divided">
              <ListItem label="Item 1" />
              <ListItem label="Item 2" />
              <ListItem label="Item 3" />
            </List>
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <List variant="bordered" size="small">
            <ListItem label="Small Item" />
            <ListItem label="Small Item" />
          </List>
          <List variant="bordered" size="medium">
            <ListItem label="Medium Item" />
            <ListItem label="Medium Item" />
          </List>
          <List variant="bordered" size="large">
            <ListItem label="Large Item" />
            <ListItem label="Large Item" />
          </List>
        </View>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Clickable List</Text>
        <List variant="bordered">
          <ListItem
            label="Home"
            selected={selectedItem === 'home'}
            onPress={() => setSelectedItem('home')}
          />
          <ListItem
            label="Settings"
            selected={selectedItem === 'settings'}
            onPress={() => setSelectedItem('settings')}
          />
          <ListItem
            label="Profile"
            selected={selectedItem === 'profile'}
            onPress={() => setSelectedItem('profile')}
          />
        </List>
        <Text size="small" color="secondary">
          Selected: {selectedItem}
        </Text>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Leading Elements</Text>
        <List variant="divided">
          <ListItem
            label="Dashboard"
            leading={<Text>🏠</Text>}
            onPress={() => console.log('Dashboard')}
          />
          <ListItem
            label="Settings"
            leading={<Text>⚙️</Text>}
            onPress={() => console.log('Settings')}
          />
          <ListItem
            label="Profile"
            leading={<Text>👤</Text>}
            onPress={() => console.log('Profile')}
          />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Trailing Elements</Text>
        <List variant="bordered">
          <ListItem
            label="Notifications"
            leading={<Text>🔔</Text>}
            trailing={<Badge variant="filled" color="error">3</Badge>}
          />
          <ListItem
            label="Messages"
            leading={<Text>✉️</Text>}
            trailing={<Badge variant="filled" color="primary">12</Badge>}
          />
          <ListItem
            label="Updates"
            leading={<Text>🔄</Text>}
            trailing={<Text size="small" color="secondary">New</Text>}
          />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Navigation Sidebar</Text>
        <List variant="bordered">
          <ListItem
            label="Dashboard"
            leading={<Text>📊</Text>}
            selected={selectedNav === 'dashboard'}
            onPress={() => setSelectedNav('dashboard')}
          />
          <ListItem
            label="Analytics"
            leading={<Text>📈</Text>}
            selected={selectedNav === 'analytics'}
            onPress={() => setSelectedNav('analytics')}
          />
          <ListItem
            label="Reports"
            leading={<Text>📄</Text>}
            selected={selectedNav === 'reports'}
            onPress={() => setSelectedNav('reports')}
          />
          <ListItem
            label="Settings"
            leading={<Text>⚙️</Text>}
            selected={selectedNav === 'settings'}
            onPress={() => setSelectedNav('settings')}
          />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">With Sections</Text>
        <List variant="divided">
          <ListSection title="Main">
            <ListItem
              label="Dashboard"
              leading={<Text>🏠</Text>}
            />
            <ListItem
              label="Analytics"
              leading={<Text>📈</Text>}
            />
          </ListSection>

          <ListSection title="Settings">
            <ListItem
              label="Profile"
              leading={<Text>👤</Text>}
            />
            <ListItem
              label="Preferences"
              leading={<Text>⚙️</Text>}
            />
            <ListItem
              label="Security"
              leading={<Text>🔒</Text>}
            />
          </ListSection>

          <ListSection title="Other">
            <ListItem
              label="Help"
              leading={<Text>❓</Text>}
            />
            <ListItem
              label="Logout"
              leading={<Text>🚪</Text>}
            />
          </ListSection>
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Indented Items</Text>
        <List variant="bordered">
          <ListItem label="Parent Item 1" />
          <ListItem label="Child Item 1.1" indent={1} />
          <ListItem label="Child Item 1.2" indent={1} />
          <ListItem label="Grandchild Item 1.2.1" indent={2} />
          <ListItem label="Parent Item 2" />
          <ListItem label="Child Item 2.1" indent={1} />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Disabled Items</Text>
        <List variant="bordered">
          <ListItem
            label="Enabled Item"
            onPress={() => console.log('Clicked')}
          />
          <ListItem
            label="Disabled Item"
            disabled
            onPress={() => console.log('This should not trigger')}
          />
          <ListItem
            label="Another Enabled Item"
            onPress={() => console.log('Clicked')}
          />
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Rich Content</Text>
        <List variant="bordered">
          <ListItem
            leading={<Text size="large">👤</Text>}
            trailing={<Text size="small" color="secondary">Admin</Text>}
          >
            <View>
              <Text weight="semibold">John Doe</Text>
              <Text size="small" color="secondary">john.doe@example.com</Text>
            </View>
          </ListItem>
          <ListItem
            leading={<Text size="large">👤</Text>}
            trailing={<Text size="small" color="secondary">User</Text>}
          >
            <View>
              <Text weight="semibold">Jane Smith</Text>
              <Text size="small" color="secondary">jane.smith@example.com</Text>
            </View>
          </ListItem>
        </List>
      </View>

      <View spacing="md">
        <Text size="large" weight="semibold">Active States</Text>
        <List variant="bordered">
          <ListItem
            label="Normal Item"
            onPress={() => console.log('Normal')}
          />
          <ListItem
            label="Active Item"
            active
            onPress={() => console.log('Active')}
          />
          <ListItem
            label="Selected Item"
            selected
            onPress={() => console.log('Selected')}
          />
        </List>
      </View>
    </View>
  );
};

export default ListExamples;
