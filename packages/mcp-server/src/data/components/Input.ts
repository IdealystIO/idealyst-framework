export const Input = {
category: "form",
    description: "Text input field with icons, password visibility toggle, margin variants, and various input types",
        props: `
- \`value\`: string - The current value of the input
- \`onChangeText\`: function - Called when the text changes
- \`onFocus\`: function - Called when the input receives focus
- \`onBlur\`: function - Called when the input loses focus
- \`placeholder\`: string - Placeholder text
- \`disabled\`: boolean - Whether the input is disabled
- \`inputType\`: InputInputType - The type of input (affects keyboard type on mobile)
- \`secureTextEntry\`: boolean - Whether to show the password
- \`leftIcon\`: IconName | React.ReactNode - Icon to display on the left side of the input
- \`rightIcon\`: IconName | React.ReactNode - Icon to display on the right side of the input
- \`showPasswordToggle\`: boolean - Show password visibility toggle for password inputs (defaults to true for password type)
- \`autoCapitalize\`: 'none' | 'sentences' | 'words' | 'characters' - Auto-capitalization behavior
- \`size\`: InputSize - Size variant of the input
- \`type\`: InputType - Style variant of the input
- \`intent\`: InputIntent - The intent/color scheme of the input (for focus states, validation, etc.)
- \`hasError\`: boolean - Whether the input has an error state
- \`margin\`: Size - Margin on all sides ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- \`marginVertical\`: Size - Top and bottom margin
- \`marginHorizontal\`: Size - Left and right margin
`,
    features: [
      "Left and right icon support with MDI icons",
      "Password visibility toggle with eye/eye-off icons",
      "Multiple input types (text, email, password, number)",
      "Five size variants (xs, sm, md, lg, xl)",
      "Three style variants (outlined, filled, bare)",
      "Intent colors for focus/validation states",
      "Disabled and error states",
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
<Input type="outlined" placeholder="Outlined" />

// Filled variant
<Input type="filled" placeholder="Filled" />

// Bare variant
<Input type="bare" placeholder="Bare" />`,
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
