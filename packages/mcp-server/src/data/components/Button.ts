export const Button = {
category: "form",
    description: "Interactive button component with multiple variants, sizes, and icon support",
        props: `
- \`children\`: React.ReactNode - The text or content to display inside the button
- \`title\`: string - The text title to display inside the button (for web)
- \`onPress\`: function - Called when the button is pressed
- \`disabled\`: boolean - Whether the button is disabled
- \`type\`: ButtonType - The visual style type of the button ('contained' | 'outlined' | 'text')
- \`intent\`: ButtonIntentVariant - The intent/color scheme of the button
- \`size\`: ButtonSizeVariant - The size of the button
- \`gradient\`: ButtonGradient - Optional gradient overlay effect ('darken' | 'lighten'). Only applies to 'contained' type buttons.
- \`leftIcon\`: IconName | React.ReactNode - Icon to display on the left side. Can be an icon name or custom component (ReactNode)
- \`rightIcon\`: IconName | React.ReactNode - Icon to display on the right side. Can be an icon name or custom component (ReactNode)
`,
    features: [
      "Three variants: contained, outlined, text",
      "Five intent colors for semantic meaning",
      "Three sizes: sm, md, lg",
      "Gradient overlay effects (darken/lighten) for contained buttons",
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
      "Use gradient='darken' for a subtle depth effect on hero/CTA buttons",
    ],
    usage: `
import { Button } from '@idealyst/components';

<Button
  type="contained"
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
<Button type="contained" intent="primary">Contained</Button>
<Button type="outlined" intent="primary">Outlined</Button>
<Button type="text" intent="primary">Text</Button>`,
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
      gradient: `import { Button } from '@idealyst/components';

// Gradient overlay adds subtle depth to contained buttons
<Button type="contained" intent="primary" gradient="darken">
  Darken Effect
</Button>

<Button type="contained" intent="success" gradient="lighten">
  Lighten Effect
</Button>

// Gradient with icons
<Button
  type="contained"
  intent="primary"
  gradient="darken"
  leftIcon="rocket-launch"
>
  Launch
</Button>`,
    }
};
