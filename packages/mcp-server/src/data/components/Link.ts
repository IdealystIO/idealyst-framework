export const Link = {
  category: "navigation",
  description: "Navigation component that wraps children in a pressable area and navigates to a specified path when pressed",
  props: `
- \`to\`: string (required) - The destination path to navigate to
- \`vars\`: Record<string, string> - Variables to substitute in the path (e.g., { id: '123' } for '/user/:id')
- \`children\`: React.ReactNode - Content to render inside the link
- \`disabled\`: boolean - Whether the link is disabled
- \`style\`: StyleProp<ViewStyle> - Style to apply to the link container
- \`testID\`: string - Test ID for testing
- \`accessibilityLabel\`: string - Accessibility label for screen readers
- \`onPress\`: function - Callback fired when the link is pressed (before navigation)
`,
  features: [
    "Declarative navigation with path-based routing",
    "Path variable substitution for dynamic routes",
    "Works with @idealyst/navigation system",
    "Disabled state support",
    "Custom styling",
    "Accessibility support",
    "Cross-platform (web and native)",
    "onPress callback before navigation",
  ],
  bestPractices: [
    "Use for navigation between screens/pages",
    "Prefer Link over manual navigator.navigate() for declarative routing",
    "Use vars prop for dynamic path parameters",
    "Provide accessibilityLabel for screen readers",
    "Wrap any content - text, buttons, cards, icons",
    "Use disabled prop for conditional navigation",
  ],
  usage: `
import { Link, Text } from '@idealyst/components';

// Basic text link
<Link to="/home">
  <Text color="primary">Go Home</Text>
</Link>

// Link with path variables
<Link to="/user/:id" vars={{ id: '123' }}>
  <Text>View User Profile</Text>
</Link>

// Link wrapping a button
<Link to="/settings">
  <Button intent="primary">Settings</Button>
</Link>
`,
  examples: {
    basic: `import { Link, Text } from '@idealyst/components';

<Link to="/home">
  <Text color="primary">Go to Home</Text>
</Link>`,

    variants: `import { Link, Text, Button, Card, View, Icon } from '@idealyst/components';

// Text link
<Link to="/about">
  <Text color="primary">About Us</Text>
</Link>

// Button link
<Link to="/dashboard">
  <Button type="contained" intent="primary">
    Go to Dashboard
  </Button>
</Link>

// Card link
<Link to="/article/1">
  <Card type="outlined" padding="md">
    <Text weight="semibold">Article Title</Text>
    <Text size="sm" color="secondary">Click to read more...</Text>
  </Card>
</Link>

// Icon + Text link
<Link to="/notifications">
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Icon name="bell" size={20} intent="primary" />
    <Text color="primary">Notifications</Text>
  </View>
</Link>`,

    "with-icons": `import { Link, View, Icon, Text } from '@idealyst/components';

// Navigation menu item
<Link to="/settings">
  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
    <Icon name="cog" size={20} intent="primary" />
    <Text style={{ flex: 1 }}>Settings</Text>
    <Icon name="chevron-right" size={16} color="gray.500" />
  </View>
</Link>

// Icon-only link
<Link to="/search" accessibilityLabel="Search">
  <Icon name="magnify" size={24} intent="primary" />
</Link>`,

    interactive: `import { Link, Text, Card, View, Icon } from '@idealyst/components';

// Clickable card with navigation
function ArticleCard({ article }) {
  return (
    <Link
      to="/article/:id"
      vars={{ id: article.id }}
      onPress={() => console.log('Navigating to article:', article.id)}
    >
      <Card type="elevated" padding="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="file-document" size={24} intent="primary" />
          <View style={{ flex: 1 }}>
            <Text weight="semibold">{article.title}</Text>
            <Text size="sm" color="secondary">{article.excerpt}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="gray.500" />
        </View>
      </Card>
    </Link>
  );
}

// Disabled link
<Link to="/premium" disabled>
  <Text color="secondary">Premium Feature (Disabled)</Text>
</Link>

// Styled link container
<Link
  to="/special"
  style={{
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
  }}
>
  <Text color="primary">Special Offer</Text>
</Link>`,
  },
};
