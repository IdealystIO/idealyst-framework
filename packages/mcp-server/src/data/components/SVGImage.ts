export const SVGImage = {
  category: "media",
  description: "SVG image component with color, size, and intent support",
  props: `
- \`source\`: string | { uri: string } | React.FC<SvgProps> - SVG source (local file, URL, or component)
- \`width\`: number | string - Image width
- \`height\`: number | string - Image height
- \`size\`: number | string - Sets both width and height
- \`color\`: string - Custom color override
- \`intent\`: IntentNames - Theme intent color
- \`resizeMode\`: 'contain' | 'cover' | 'stretch' - How SVG fits container
- \`style\`: ViewProps - Additional styles
`,
  features: [
    "Multiple source types (file, URL, component)",
    "Size and dimension control",
    "Color customization",
    "Theme intent colors",
    "Resize modes",
    "Cross-platform support",
  ],
  bestPractices: [
    "Use local SVG files for icons and logos",
    "Use remote URLs for dynamic SVGs",
    "Set explicit size for consistent rendering",
    "Use intent colors for theme consistency",
    "Prefer 'contain' resizeMode to preserve aspect ratio",
    "Optimize SVG files for web performance",
  ],
  usage: `
import { SVGImage } from '@idealyst/components';
import LogoIcon from './assets/logo.svg';

// Local SVG file
<SVGImage source={LogoIcon} size={48} intent="primary" />

// Remote SVG
<SVGImage
  source={{ uri: 'https://cdn.example.com/icon.svg' }}
  width={32}
  height={32}
  color="#FF0000"
/>
`,
  examples: {
    basic: `import { SVGImage } from '@idealyst/components';
import Icon from './icon.svg';

<SVGImage source={Icon} size={24} />`,

    variants: `import { SVGImage, View } from '@idealyst/components';
import Logo from './logo.svg';

<View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
  <SVGImage source={Logo} size={24} />
  <SVGImage source={Logo} size={32} />
  <SVGImage source={Logo} size={48} />
  <SVGImage source={Logo} size={64} />
</View>`,

    "with-icons": `import { SVGImage, View, Text } from '@idealyst/components';
import ReactLogo from './react-logo.svg';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
  <SVGImage source={ReactLogo} size={32} color="#61dafb" />
  <View spacing="xs">
    <Text weight="bold">React Application</Text>
    <Text size="sm">Built with React & React Native</Text>
  </View>
</View>`,

    interactive: `import { SVGImage, View, Button, Text } from '@idealyst/components';
import { useState } from 'react';
import AppIcon from './app-icon.svg';

function Example() {
  const [size, setSize] = useState(48);
  const [intent, setIntent] = useState('primary');

  const intents = ['primary', 'neutral', 'success', 'error', 'warning'];

  return (
    <View spacing="md" style={{ alignItems: 'center' }}>
      <SVGImage source={AppIcon} size={size} intent={intent} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button size="sm" onPress={() => setSize(Math.max(24, size - 12))}>
          Smaller
        </Button>
        <Button size="sm" onPress={() => setSize(Math.min(96, size + 12))}>
          Larger
        </Button>
      </View>

      <View spacing="xs">
        <Text size="sm">Intent:</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {intents.map((i) => (
            <Button
              key={i}
              size="sm"
              variant={intent === i ? 'contained' : 'outlined'}
              onPress={() => setIntent(i)}
            >
              {i}
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}`,
  },
};
