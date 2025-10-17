export const Avatar = {
  category: "display",
  description: "Profile picture or user avatar with fallback text support",
  props: `
- \`src\`: string | any - Image source (URL or require())
- \`alt\`: string - Alt text for the image
- \`fallback\`: string - Fallback text displayed when no image (usually initials)
- \`size\`: 'small' | 'medium' | 'large' | 'xlarge' - Avatar size
- \`shape\`: 'circle' | 'square' - Avatar shape
- \`color\`: ColorVariant - Background color for fallback (from theme palette)
- \`style\`: any - Additional custom styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Image display with automatic fallback",
    "Fallback text (initials) support",
    "Four size options",
    "Circle and square shapes",
    "Theme color variants for fallback backgrounds",
    "Accessible with alt text",
  ],
  bestPractices: [
    "Always provide alt text for accessibility",
    "Use initials (2 characters) for fallback text",
    "Use 'circle' shape for user avatars",
    "Use 'square' shape for brands or organizations",
    "Choose contrasting colors for fallback backgrounds",
  ],
  usage: `
import { Avatar } from '@idealyst/components';

<Avatar
  src="https://example.com/avatar.jpg"
  alt="John Doe"
  fallback="JD"
  size="large"
  shape="circle"
/>
`,
  examples: {
    basic: `import { Avatar } from '@idealyst/components';

<Avatar
  fallback="JD"
  size="medium"
/>`,

    variants: `import { Avatar, View } from '@idealyst/components';

<View style={{ flexDirection: 'row', gap: 8 }}>
  <Avatar fallback="SM" size="small" />
  <Avatar fallback="MD" size="medium" />
  <Avatar fallback="LG" size="large" />
  <Avatar fallback="XL" size="xlarge" />
</View>`,

    "with-icons": `import { Avatar, View } from '@idealyst/components';

<View style={{ flexDirection: 'row', gap: 8 }}>
  {/* Circle avatars */}
  <Avatar
    src="https://i.pravatar.cc/150?img=1"
    alt="User 1"
    fallback="U1"
    shape="circle"
  />

  {/* Square avatars */}
  <Avatar
    src="https://i.pravatar.cc/150?img=2"
    alt="User 2"
    fallback="U2"
    shape="square"
  />
</View>`,

    interactive: `import { Avatar, View, Text } from '@idealyst/components';

function UserProfile({ user }) {
  return (
    <View spacing="sm" style={{ alignItems: 'center' }}>
      <Avatar
        src={user.avatar}
        alt={user.name}
        fallback={user.initials}
        size="xlarge"
        color="primary"
      />
      <Text weight="bold">{user.name}</Text>
      <Text size="small" color="secondary">{user.email}</Text>
    </View>
  );
}`,
  },
};
