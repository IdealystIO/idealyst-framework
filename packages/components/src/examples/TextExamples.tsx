import { Screen, View, Text } from '../index';

export const TextExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
        <Text typography="h3" align="center">
          Text Examples
        </Text>

        {/* Typography Variants */}
        <View gap="md">
          <Text typography="subtitle1">Typography Variants</Text>
          <View gap="sm">
            <Text typography="h1">Heading 1</Text>
            <Text typography="h2">Heading 2</Text>
            <Text typography="h3">Heading 3</Text>
            <Text typography="h4">Heading 4</Text>
            <Text typography="h5">Heading 5</Text>
            <Text typography="h6">Heading 6</Text>
            <Text typography="subtitle1">Subtitle 1</Text>
            <Text typography="subtitle2">Subtitle 2</Text>
            <Text typography="body1">Body 1 - Lorem ipsum dolor sit amet</Text>
            <Text typography="body2">Body 2 - Lorem ipsum dolor sit amet</Text>
            <Text typography="caption">Caption - Lorem ipsum dolor sit amet</Text>
          </View>
        </View>

        {/* Semantic Text Colors */}
        <View gap="md">
          <Text typography="subtitle1">Semantic Text Colors</Text>
          <View gap="sm">
            <Text color="primary">Primary text - Main text color</Text>
            <Text color="secondary">Secondary text - Subdued text</Text>
            <Text color="tertiary">Tertiary text - More subdued text</Text>
          </View>
        </View>

        {/* Inverse Text Colors */}
        <View gap="md">
          <Text typography="subtitle1">Inverse Text Colors (on dark backgrounds)</Text>
          <View gap="sm">
            <View background="inverse" padding="sm" radius="sm">
              <Text color="inverse">Inverse (of primary) - Light text on dark background</Text>
            </View>
            <View background="inverse" padding="sm" radius="sm">
              <Text color="inverse-secondary">Inverse secondary (90% opacity)</Text>
            </View>
            <View background="inverse" padding="sm" radius="sm">
              <Text color="inverse-tertiary">Inverse tertiary (70% opacity)</Text>
            </View>
          </View>
        </View>

        {/* Text Alignment */}
        <View gap="md">
          <Text typography="subtitle1">Alignment</Text>
          <View gap="sm">
            <Text align="left">Left aligned text</Text>
            <Text align="center">Center aligned text</Text>
            <Text align="right">Right aligned text</Text>
          </View>
        </View>

        {/* Combined Examples */}
        <View gap="md">
          <Text typography="subtitle1">Combined Examples</Text>
          <View gap="sm">
            <Text typography="h4" color="primary" align="center">
              Heading with Primary Color Centered
            </Text>
            <Text typography="caption" color="secondary" align="right">
              Caption Secondary Right
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};
