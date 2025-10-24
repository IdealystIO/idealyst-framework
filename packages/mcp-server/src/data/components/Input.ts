export const Input = {
category: "form",
    description: "Text input field with icons, password visibility toggle, and various input types",
    props: `
- \`value\`: string - Current input value
- \`onChangeText\`: (text: string) => void - Text change handler
- \`onFocus\`: () => void - Focus handler
- \`onBlur\`: () => void - Blur handler
- \`placeholder\`: string - Placeholder text
- \`disabled\`: boolean - Disable input
- \`inputType\`: 'text' | 'email' | 'password' | 'number' - Input type (affects keyboard on mobile)
- \`secureTextEntry\`: boolean - Hide input (for passwords)
- \`leftIcon\`: IconName | ReactNode - Icon to display on the left side
- \`rightIcon\`: IconName | ReactNode - Icon to display on the right side
- \`showPasswordToggle\`: boolean - Show password visibility toggle for password inputs (defaults to true for password type)
- \`autoCapitalize\`: 'none' | 'sentences' | 'words' | 'characters' - Auto-capitalization behavior
- \`size\`: 'sm' | 'md' | 'lg' - Input size
- \`variant\`: 'default' | 'outlined' | 'filled' | 'bare' - Style variant
- \`intent\`:Intent - Color scheme (for focus states)
- \`hasError\`: boolean - Error state (deprecated: use intent="error")
`,
    features: [
      "Left and right icon support with MDI icons",
      "Password visibility toggle with eye/eye-off icons",
      "Multiple input types (text, email, password, number)",
      "Three size variants",
      "Four style variants (default, outlined, filled, bare)",
      "Disabled state",
      "Auto-capitalization control",
      "Focus and blur event handlers",
    ],
    bestPractices: [
      "Use leftIcon for contextual hints (e.g., email icon for email input)",
      "Password inputs automatically show visibility toggle",
      "Use inputType='email' for email fields to get proper keyboard on mobile",
      "Use inputType='number' for numeric input",
      "Disable password toggle with showPasswordToggle={false} if needed",
    ],
    usage: `
import { Input } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [email, setEmail] = useState('');

  return (
    <Input
      leftIcon="email"
      value={email}
      onChangeText={setEmail}
      placeholder="Enter your email"
      inputType="email"
    />
  );
}
`,
    examples: {
      basic: `import { Input } from '@idealyst/components';

<Input
  placeholder="Enter username"
/>`,
      variants: `import { Input } from '@idealyst/components';

// Small size
<Input size="sm" placeholder="Small input" />

// Medium size (default)
<Input size="md" placeholder="Medium input" />

// Large size
<Input size="lg" placeholder="Large input" />

// Outlined variant
<Input variant="outlined" placeholder="Outlined" />

// Filled variant
<Input variant="filled" placeholder="Filled" />

// Bare variant
<Input variant="bare" placeholder="Bare" />`,
      "with-icons": `import { Input } from '@idealyst/components';

// Left icon
<Input
  leftIcon="email"
  placeholder="Email address"
  inputType="email"
/>

// Right icon
<Input
  rightIcon="magnify"
  placeholder="Search"
/>

// Both icons
<Input
  leftIcon="lock"
  rightIcon="check"
  placeholder="Secure field"
/>

// Password with visibility toggle (default)
<Input
  inputType="password"
  placeholder="Password"
/>

// Password without visibility toggle
<Input
  inputType="password"
  showPasswordToggle={false}
  placeholder="Password"
/>

// Custom icons with password toggle
<Input
  leftIcon="lock"
  inputType="password"
  placeholder="Enter password"
/>`,
      interactive: `import { Input } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View spacing="md">
      <Input
        leftIcon="email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        inputType="email"
      />
      <Input
        leftIcon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        inputType="password"
      />
    </View>
  );
}`,
    }
};
