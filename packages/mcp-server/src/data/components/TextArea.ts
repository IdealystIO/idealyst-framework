export const TextArea = {
  category: "form",
  description: "Multi-line text input field for longer text content",
  props: `
- \`value\`: string - Current text value
- \`defaultValue\`: string - Default value (uncontrolled)
- \`onChange\`: (value: string) => void - Text change handler
- \`placeholder\`: string - Placeholder text
- \`disabled\`: boolean - Whether textarea is disabled
- \`rows\`: number - Initial number of rows
- \`minHeight\`: number - Minimum height in pixels
- \`maxHeight\`: number - Maximum height in pixels
- \`autoGrow\`: boolean - Automatically grow to fit content
- \`maxLength\`: number - Maximum character length
- \`label\`: string - Label text above textarea
- \`error\`: string - Error message to display
- \`helperText\`: string - Helper text below textarea
- \`resize\`: 'none' | 'vertical' | 'horizontal' | 'both' - Resize behavior (web)
- \`showCharacterCount\`: boolean - Show character count
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`size\`: 'small' | 'medium' | 'large' - TextArea size
- \`style\`: ViewStyle - Additional styles
- \`textareaStyle\`: TextStyle - Textarea-specific styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Multi-line text input",
    "Auto-grow to fit content",
    "Character count display",
    "Min/max height constraints",
    "Max length validation",
    "Label and helper text",
    "Error state",
    "Resize control (web)",
    "Three sizes",
  ],
  bestPractices: [
    "Always provide a label",
    "Use helperText to guide users",
    "Set maxLength to prevent excessive input",
    "Show character count for limited fields",
    "Use autoGrow for dynamic content",
    "Set minHeight for comfortable input area",
    "Show inline error messages",
  ],
  usage: `
import { TextArea } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [text, setText] = useState('');

  return (
    <TextArea
      label="Description"
      value={text}
      onChange={setText}
      placeholder="Enter a detailed description"
      rows={4}
      maxLength={500}
      showCharacterCount
      helperText="Provide as much detail as possible"
    />
  );
}
`,
  examples: {
    basic: `import { TextArea } from '@idealyst/components';

<TextArea
  label="Message"
  placeholder="Enter your message"
  rows={4}
/>`,

    variants: `import { TextArea, View } from '@idealyst/components';

<View spacing="md">
  <TextArea label="Small" size="small" rows={3} />
  <TextArea label="Medium" size="medium" rows={4} />
  <TextArea label="Large" size="large" rows={5} />
</View>`,

    "with-icons": `import { TextArea, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [feedback, setFeedback] = useState('');
  const maxLength = 200;

  return (
    <View spacing="sm">
      <TextArea
        label="Feedback"
        value={feedback}
        onChange={setFeedback}
        placeholder="Share your thoughts..."
        maxLength={maxLength}
        showCharacterCount
        autoGrow
        minHeight={100}
        maxHeight={300}
      />
      <Text size="small" color="secondary">
        {feedback.length}/{maxLength} characters
      </Text>
    </View>
  );
}`,

    interactive: `import { TextArea, View, Button, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    setError('');
    setSubmitted(true);
    // Submit logic here
  };

  if (submitted) {
    return <Text color="success">Message submitted successfully!</Text>;
  }

  return (
    <View spacing="md">
      <TextArea
        label="Your Message"
        value={message}
        onChange={(val) => {
          setMessage(val);
          setError('');
        }}
        placeholder="Type your message here..."
        rows={5}
        maxLength={500}
        showCharacterCount
        error={error}
        helperText={error || 'Minimum 10 characters required'}
        autoGrow
      />
      <Button intent="primary" onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
}`,
  },
};
