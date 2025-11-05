export const Avatar = {
  category: "display",
  description: "Profile picture or user avatar with fallback text support",
      props: `
- \`src\`: string | ImageSourcePropType - Image source (URL or require())
- \`alt\`: string - Alt text for the image
- \`fallback\`: string - Fallback text (usually initials)
- \`size\`: AvatarSizeVariant - Size of the avatar
- \`shape\`: AvatarShapeVariant - Shape of the avatar
- \`color\`: AvatarColorVariant - The color scheme of the avatar (for background when no image)
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
  size="lg"
  shape="circle"
/>
`,
  examples: {
    basic: `import { Avatar } from '@idealyst/components';

<Avatar
  fallback="JD"
  size="md"
/>`,

    variants: `import { Avatar, View } from '@idealyst/components';

<View style={{ flexDirection: 'row', gap: 8 }}>
  <Avatar fallback="SM" size="sm" />
  <Avatar fallback="MD" size="md" />
  <Avatar fallback="LG" size="lg" />
  <Avatar fallback="XL" size="xl" />
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
        size="xl"
        color="primary"
      />
      <Text weight="bold">{user.name}</Text>
      <Text size="sm" color="secondary">{user.email}</Text>
    </View>
  );
}`,
  },
};
