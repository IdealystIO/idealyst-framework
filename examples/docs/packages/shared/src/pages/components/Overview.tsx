import React from 'react';
import { View, Text, Card, Button, Chip, Badge, Switch, Screen } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { LivePreview } from '../../components/LivePreview';

const componentCategories = [
  {
    title: 'Layout',
    components: ['View', 'Screen', 'Divider'],
  },
  {
    title: 'Form',
    components: ['Button', 'Input', 'Checkbox', 'Select', 'Switch', 'RadioButton', 'Slider', 'TextArea'],
  },
  {
    title: 'Display',
    components: ['Text', 'Card', 'Badge', 'Chip', 'Avatar', 'Icon', 'Skeleton', 'Alert'],
  },
  {
    title: 'Navigation',
    components: ['TabBar', 'Breadcrumb', 'Menu', 'List'],
  },
  {
    title: 'Overlay',
    components: ['Dialog', 'Popover', 'Tooltip'],
  },
  {
    title: 'Data',
    components: ['Table', 'Progress'],
  },
];

export function ComponentsOverviewPage() {
  const { navigate } = useNavigator();

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Components Overview
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          Idealyst provides a comprehensive library of cross-platform components.
          All components work identically on web and native with platform-specific optimizations.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 16 }}>
          Component Preview
        </Text>

        <LivePreview title="Interactive Components">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <Button>Primary Button</Button>
            <Button intent="success" type="outlined">Success</Button>
            <Chip>Chip</Chip>
            <Badge>3</Badge>
            <Switch />
          </View>
        </LivePreview>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 16 }}>
          Component Categories
        </Text>

        {componentCategories.map((category) => (
          <View key={category.title} style={{ marginBottom: 24 }}>
            <Text weight="semibold" style={{ marginBottom: 12 }}>
              {category.title}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {category.components.map((component) => (
                <Chip
                  key={component}
                  onPress={() => navigate({ path: `/components/${component.toLowerCase()}` })}
                  type="outlined"
                >
                  {component}
                </Chip>
              ))}
            </View>
          </View>
        ))}

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Common Props
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>Intent Colors</Text>
          <Text size="sm" style={{ color: '#666666', marginBottom: 16 }}>
            Components support intent-based colors: primary, neutral, success, error, warning
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>Variants</Text>
          <Text size="sm" style={{ color: '#666666', marginBottom: 16 }}>
            Many components offer visual variants like contained, outlined, text (buttons) or
            filled, outlined, soft (chips)
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>Sizes</Text>
          <Text size="sm" style={{ color: '#666666' }}>
            Most components support size variants: xs, sm, md, lg, xl
          </Text>
        </Card>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Import Pattern
        </Text>

        <Card
          variant="outlined"
          style={{
            padding: 16,
            backgroundColor: '#1e1e1e',
          }}
        >
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              color: '#d4d4d4',
            }}
          >
            {`import { Button, Card, Text, View } from '@idealyst/components';`}
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
