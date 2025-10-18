export const Button = {
category: "form",
    description: "Interactive button component with multiple variants, sizes, and icon support",
    props: `
- \`variant\`: 'contained' | 'outlined' | 'text' - Visual style variant
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`size\`: 'sm' | 'md' | 'lg' - Button size
- \`icon\`: string | ReactNode - Icon name (MDI) or custom React element
- \`iconPosition\`: 'left' | 'right' - Position of icon relative to label
- \`disabled\`: boolean - Disable button interaction
- \`loading\`: boolean - Show loading state
- \`fullWidth\`: boolean - Expand button to full container width
- \`onPress\`: () => void - Press handler
`,
    features: [
      "Three variants: contained, outlined, text",
      "Five intent colors for semantic meaning",
      "Three sizes: sm, md, lg",
      "Icon support with string names or custom React elements",
      "Loading and disabled states",
      "Full width option",
      "Cross-platform (React & React Native)",
    ],
    bestPractices: [
      "Use 'primary' intent for main actions",
      "Use 'contained' variant for prominent actions",
      "Use icon names (strings) for consistency with design system",
      "Keep button labels concise and action-oriented",
    ],
    usage: `
import { Button } from '@idealyst/components';

<Button
  variant="contained"
  intent="primary"
  icon="check"
  onPress={() => console.log('Pressed')}
>
  Save Changes
</Button>
`,
    examples: {
      basic: `import { Button } from '@idealyst/components';

// Basic button
<Button onPress={() => console.log('Clicked')}>
  Click Me
</Button>`,
      variants: `import { Button } from '@idealyst/components';

// Different variants
<Button variant="contained" intent="primary">Contained</Button>
<Button variant="outlined" intent="primary">Outlined</Button>
<Button variant="text" intent="primary">Text</Button>`,
      "with-icons": `import { Button } from '@idealyst/components';

// Button with icon
<Button icon="check" iconPosition="left">
  Confirm
</Button>

// Icon-only button
<Button icon="close" />`,
      interactive: `import { Button } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <Button
      loading={loading}
      onPress={handlePress}
    >
      Save
    </Button>
  );
}`,
    }
};
