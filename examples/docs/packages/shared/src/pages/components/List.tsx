import React from 'react';
import { View, Text, List, ListItem, Screen } from '@idealyst/components';
import { ComponentPlayground, listPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper with sample items
function DemoList(props: any) {
  return (
    <List {...props}>
      <ListItem leading="home" label="Home" />
      <ListItem leading="cog" label="Settings" />
      <ListItem leading="account" label="Profile" />
    </List>
  );
}

export function ListPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          List
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Vertical collection of items with optional icons and actions.
          Supports sections, dividers, and interactive selection.
        </Text>

        <ComponentPlayground
          component={DemoList}
          componentName="List"
          propConfig={listPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}
