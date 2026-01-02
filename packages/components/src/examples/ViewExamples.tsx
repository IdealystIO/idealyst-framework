import { Screen, View, Text } from '../index';

export const ViewExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
      <Text typography="h4" align="center">
        View Examples
      </Text>

      {/* Spacing Examples */}
      <View gap="md">
        <Text typography="subtitle1">Spacing Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <View  background="secondary" border="thin">
            <Text typography="body2">None</Text>
          </View>
          <View gap="xs" background="secondary" border="thin">
            <Text typography="body2">XS</Text>
          </View>
          <View gap="sm" background="secondary" border="thin">
            <Text typography="body2">SM</Text>
          </View>
          <View gap="md" background="secondary" border="thin">
            <Text typography="body2">MD</Text>
          </View>
          <View gap="lg" background="secondary" border="thin">
            <Text typography="body2">LG</Text>
          </View>
          <View gap="xl" background="secondary" border="thin">
            <Text typography="body2">XL</Text>
          </View>
        </View>
      </View>

      {/* Background Examples */}
      <View gap="md">
        <Text typography="subtitle1">Background Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View background="transparent" border="thin" gap="sm" radius="sm">
            <Text typography="body2" color="primary">Transparent</Text>
          </View>
          <View background="primary" gap="sm" radius="sm">
            <Text typography="body2" color="primary">Primary</Text>
          </View>
          <View background="secondary" gap="sm" radius="sm">
            <Text typography="caption" color="secondary">Secondary</Text>
          </View>
          <View background="tertiary" gap="sm" radius="sm">
            <Text typography="body2" color="tertiary">Tertiary</Text>
          </View>
          <View background="inverse" gap="sm" radius="sm">
            <Text typography="body2" color="inverse">Inverse (of primary)</Text>
          </View>
          <View background="inverse-secondary" gap="sm" radius="sm">
            <Text typography="body2" color="inverse-secondary">Inverse Secondary</Text>
          </View>
          <View background="inverse-tertiary" gap="sm" radius="sm">
            <Text typography="body2" color="inverse-tertiary">Inverse Tertiary</Text>
          </View>
        </View>
      </View>

      {/* Border Radius Examples */}
      <View gap="md">
        <Text typography="subtitle1">Border Radius</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View radius="none" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">None</Text>
          </View>
          <View radius="xs" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">XS</Text>
          </View>
          <View radius="sm" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">SM</Text>
          </View>
          <View radius="md" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">MD</Text>
          </View>
          <View radius="lg" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">LG</Text>
          </View>
          <View radius="xl" background="inverse" gap="sm">
            <Text typography="body2" color="inverse">XL</Text>
          </View>
        </View>
      </View>

      {/* Border Examples */}
      <View gap="md">
        <Text typography="subtitle1">Border Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View border="none" background="secondary" gap="sm" radius="sm">
            <Text typography="body2">None</Text>
          </View>
          <View border="thin" background="secondary" gap="sm" radius="sm">
            <Text typography="body2">Thin</Text>
          </View>
          <View border="thick" background="secondary" gap="sm" radius="sm">
            <Text typography="body2">Thick</Text>
          </View>
        </View>
      </View>

      {/* Layout Examples */}
      <View gap="md">
        <Text typography="subtitle1">Layout Examples</Text>
        <View gap="sm" style={{ gap: 10 }}>
          <View
            background="secondary"
            gap="md"
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
            gap="md"
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