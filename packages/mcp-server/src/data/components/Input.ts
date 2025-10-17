export const Input = {
category: "form",
    description: "Text input field with label, validation, and various input types",
    props: `
- \`label\`: string - Input label text
- \`value\`: string - Current input value
- \`onChangeText\`: (text: string) => void - Text change handler
- \`placeholder\`: string - Placeholder text
- \`error\`: string - Error message to display
- \`helperText\`: string - Helper text below input
- \`disabled\`: boolean - Disable input
- \`multiline\`: boolean - Allow multiple lines
- \`secureTextEntry\`: boolean - Hide input (for passwords)
- \`autoFocus\`: boolean - Focus input on mount
`,
    features: [
      "Label and placeholder support",
      "Error and helper text states",
      "Multiline text area mode",
      "Secure text entry for passwords",
      "Disabled state",
      "Auto-focus capability",
    ],
    bestPractices: [
      "Always provide a label for accessibility",
      "Use helperText to guide users",
      "Show error messages inline",
      "Use secureTextEntry for password fields",
    ],
    usage: `
import { Input } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label="Email"
      value={email}
      onChangeText={setEmail}
      placeholder="Enter your email"
      helperText="We'll never share your email"
    />
  );
}
`,
    examples: {
      basic: `import { Input } from '@idealyst/components';

<Input
  label="Username"
  placeholder="Enter username"
/>`,
      variants: `import { Input } from '@idealyst/components';

// With error
<Input
  label="Email"
  error="Invalid email address"
/>

// Disabled
<Input
  label="Locked Field"
  disabled
/>

// Multiline
<Input
  label="Description"
  multiline
/>`,
      "with-icons": `import { Input } from '@idealyst/components';

// Password input
<Input
  label="Password"
  secureTextEntry
  placeholder="Enter password"
/>`,
      interactive: `import { Input } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (text: string) => {
    setValue(text);
    if (text.length < 3) {
      setError('Must be at least 3 characters');
    } else {
      setError('');
    }
  };

  return (
    <Input
      label="Username"
      value={value}
      onChangeText={validate}
      error={error}
    />
  );
}`,
    }
};
