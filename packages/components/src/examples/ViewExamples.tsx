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

      {/* Scrollable Example */}
      <View gap="md">
        <Text typography="subtitle1">Scrollable View</Text>
        <Text typography="body2" color="secondary">
          Fixed 200x200px container with scrollable content
        </Text>
        <View
          scrollable
          background="secondary"
          padding="md"
          radius="md"
          border="thin"
          style={{ width: 200, height: 200 }}
        >
          <View>
            <Text typography="body2">Line 1: Scroll down to see more content</Text>
            <Text typography="body2">Line 2</Text>
            <Text typography="body2">Line 3</Text>
            <Text typography="body2">Line 4</Text>
            <Text typography="body2">Line 5</Text>
            <Text typography="body2">Line 6</Text>
            <Text typography="body2">Line 7</Text>
            <Text typography="body2">Line 8</Text>
            <Text typography="body2">Line 9</Text>
            <Text typography="body2">Line 10</Text>
            <Text typography="body2">Line 11</Text>
            <Text typography="body2">Line 12</Text>
            <Text typography="body2">Line 13</Text>
            <Text typography="body2">Line 14</Text>
            <Text typography="body2">Line 15: End of scrollable content</Text>
          </View>
        </View>
      </View>

      {/* Scrollable with Flex Example */}
      <View gap="md">
        <Text typography="subtitle1">Scrollable with Flex</Text>
        <Text typography="body2" color="secondary">
          200x300px container with 100px header and flex:1 scrollable area
        </Text>
        <View
          border="thin"
          radius="md"
          style={{ width: 200, height: 300 }}
        >
          {/* Fixed 100px header */}
          <View
            background="tertiary"
            padding="sm"
            style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text typography="subtitle2">Header (100px)</Text>
          </View>
          {/* Flex scrollable content */}
          <View
            scrollable
            background="secondary"
            padding="md"
            style={{ flex: 1 }}
          >
            <View>
              <Text typography="body2">Scrollable content below header</Text>
              <Text typography="body2">Line 2</Text>
              <Text typography="body2">Line 3</Text>
              <Text typography="body2">Line 4</Text>
              <Text typography="body2">Line 5</Text>
              <Text typography="body2">Line 6</Text>
              <Text typography="body2">Line 7</Text>
              <Text typography="body2">Line 8</Text>
              <Text typography="body2">Line 9</Text>
              <Text typography="body2">Line 10</Text>
              <Text typography="body2">Line 11</Text>
              <Text typography="body2">Line 12: End</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 