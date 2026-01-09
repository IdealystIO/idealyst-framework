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
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Components Overview
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Idealyst provides a comprehensive library of cross-platform components.
          All components work identically on web and native with platform-specific optimizations.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 16 }}>
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

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 16 }}>
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

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Common Props
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>Intent Colors</Text>
          <Text typography="body2" color="tertiary" style={{ marginBottom: 16 }}>
            Components support intent-based colors: primary, neutral, success, error, warning
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>Variants</Text>
          <Text typography="body2" color="tertiary" style={{ marginBottom: 16 }}>
            Many components offer visual variants like contained, outlined, text (buttons) or
            filled, outlined, soft (chips)
          </Text>

          <Text weight="semibold" style={{ marginBottom: 8 }}>Sizes</Text>
          <Text typography="body2" color="tertiary">
            Most components support size variants: xs, sm, md, lg, xl
          </Text>
        </Card>

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Import Pattern
        </Text>

        <View background="inverse" style={{ padding: 16, borderRadius: 8 }}>
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace' }}
          >
            {`import { Button, Card, Text, View } from '@idealyst/components';`}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
