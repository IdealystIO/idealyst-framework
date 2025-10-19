import { Screen, View, Text } from '../index';

export const ViewExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        View Examples
      </Text>

      {/* Spacing Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Spacing Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View spacing="none" background="secondary" border="thin">
            <Text size="sm">None</Text>
          </View>
          <View spacing="xs" background="secondary" border="thin">
            <Text size="sm">XS</Text>
          </View>
          <View spacing="sm" background="secondary" border="thin">
            <Text size="sm">SM</Text>
          </View>
          <View spacing="md" background="secondary" border="thin">
            <Text size="sm">MD</Text>
          </View>
          <View spacing="lg" background="secondary" border="thin">
            <Text size="sm">LG</Text>
          </View>
          <View spacing="xl" background="secondary" border="thin">
            <Text size="sm">XL</Text>
          </View>
        </View>
      </View>

      {/* Background Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Background Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View background="transparent" border="thin" spacing="sm" radius="sm">
            <Text size="sm" color="primary">Transparent</Text>
          </View>
          <View background="primary" spacing="sm" radius="sm">
            <Text size="sm" color="primary">Primary</Text>
          </View>
          <View background="secondary" spacing="sm" radius="sm">
            <Text size="sm" color="secondary">Secondary</Text>
          </View>
          <View background="tertiary" spacing="sm" radius="sm">
            <Text size="sm" color="tertiary">Tertiary</Text>
          </View>
          <View background="elevated" spacing="sm" radius="sm" border="thin">
            <Text size="sm" color="primary">Elevated</Text>
          </View>
          <View background="overlay" spacing="sm" radius="sm">
            <Text size="sm" color="inverse">Overlay</Text>
          </View>
          <View background="inverse" spacing="sm" radius="sm">
            <Text size="sm" color="inverse">Inverse (of primary)</Text>
          </View>
          <View background="inverse-secondary" spacing="sm" radius="sm">
            <Text size="sm" color="inverse-secondary">Inverse Secondary</Text>
          </View>
          <View background="inverse-tertiary" spacing="sm" radius="sm">
            <Text size="sm" color="inverse-tertiary">Inverse Tertiary</Text>
          </View>
        </View>
      </View>

      {/* Border Radius Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Border Radius</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View radius="none" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">None</Text>
          </View>
          <View radius="xs" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">XS</Text>
          </View>
          <View radius="sm" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">SM</Text>
          </View>
          <View radius="md" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">MD</Text>
          </View>
          <View radius="lg" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">LG</Text>
          </View>
          <View radius="xl" background="inverse" spacing="sm">
            <Text size="sm" color="inverse">XL</Text>
          </View>
        </View>
      </View>

      {/* Border Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Border Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View border="none" background="secondary" spacing="sm" radius="sm">
            <Text size="sm">None</Text>
          </View>
          <View border="thin" background="secondary" spacing="sm" radius="sm">
            <Text size="sm">Thin</Text>
          </View>
          <View border="thick" background="secondary" spacing="sm" radius="sm">
            <Text size="sm">Thick</Text>
          </View>
        </View>
      </View>

      {/* Layout Examples */}
      <View spacing="md">
        <Text size="md" weight="semibold">Layout Examples</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <View
            background="secondary"
            spacing="md"
            radius="md"
            border="thin"
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Left</Text>
            <Text>Center</Text>
            <Text>Right</Text>
          </View>

          <View
            background="secondary"
            spacing="md"
            radius="md"
            border="thin"
            style={{ flexDirection: 'column', alignItems: 'center' }}
          >
            <Text>Centered</Text>
            <Text>Column</Text>
            <Text>Layout</Text>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 