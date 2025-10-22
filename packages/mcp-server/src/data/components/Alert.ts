export const Alert = {
  category: "feedback",
  description: "Message banner for displaying important information, warnings, errors, and success messages",
  props: `
- \`title\`: string - Alert title/heading
- \`message\`: string - Alert message text
- \`children\`: ReactNode - Custom content (alternative to message)
- \`intent\`: 'success' | 'error' | 'warning' | 'info' | 'neutral' - Alert type/severity
- \`variant\`: 'filled' | 'outlined' | 'soft' - Visual style
- \`icon\`: ReactNode - Custom icon to display
- \`showIcon\`: boolean - Whether to show the default intent icon (default: true)
- \`dismissible\`: boolean - Whether the alert can be dismissed
- \`onDismiss\`: () => void - Dismiss handler callback
- \`actions\`: ReactNode - Action buttons or custom elements
- \`style\`: ViewStyle - Additional custom styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Five intent types with semantic meaning",
    "Three visual variants",
    "Default icons for each intent",
    "Custom icon support",
    "Dismissible with close button",
    "Action buttons support",
    "Title and message or custom children",
  ],
  bestPractices: [
    "Use 'error' intent for critical errors requiring immediate attention",
    "Use 'warning' intent for important but non-critical information",
    "Use 'success' intent for positive confirmations",
    "Use 'info' intent for general informational messages",
    "Keep alert messages concise and actionable",
    "Make alerts dismissible unless they require action",
  ],
  usage: `
import { Alert } from '@idealyst/components';

<Alert
  intent="error"
  title="Error"
  message="Failed to save changes. Please try again."
  dismissible
  onDismiss={() => setShowAlert(false)}
/>
`,
  examples: {
    basic: `import { Alert } from '@idealyst/components';

<Alert
  intent="info"
  message="This is an informational message"
/>`,

    variants: `import { Alert, View } from '@idealyst/components';

<View spacing="md">
  <Alert
    intent="success"
    variant="filled"
    message="Success message"
  />
  <Alert
    intent="warning"
    variant="outlined"
    message="Warning message"
  />
  <Alert
    intent="error"
    variant="soft"
    message="Error message"
  />
</View>`,

    "with-icons": `import { Alert, View } from '@idealyst/components';

<View spacing="md">
  <Alert
    intent="success"
    title="Success!"
    message="Your changes have been saved"
    showIcon
  />
  <Alert
    intent="error"
    title="Error"
    message="Something went wrong"
    showIcon
    dismissible
  />
</View>`,

    interactive: `import { Alert, Button, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setShowAlert(true)}>
        Show Alert
      </Button>

      {showAlert && (
        <Alert
          intent="warning"
          title="Unsaved Changes"
          message="You have unsaved changes that will be lost."
          dismissible
          onDismiss={() => setShowAlert(false)}
          actions={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button size="sm" onPress={() => setShowAlert(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                intent="warning"
                onPress={() => {
                  handleSave();
                  setShowAlert(false);
                }}
              >
                Save
              </Button>
            </View>
          }
        />
      )}
    </View>
  );
}`,
  },
};
