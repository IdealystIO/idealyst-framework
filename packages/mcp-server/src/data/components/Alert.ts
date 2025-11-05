export const Alert = {
  category: "feedback",
  description: "Message banner for displaying important information, warnings, errors, and success messages",
      props: `
- \`title\`: string - The title text of the alert
- \`message\`: string - The message text of the alert
- \`children\`: React.ReactNode - Custom content to display (overrides title and message)
- \`intent\`: AlertIntentVariant - The intent/color scheme (success, error, warning, info, neutral)
- \`type\`: AlertType - The visual style variant (filled, outlined, subtle)
- \`icon\`: React.ReactNode - Custom icon to display (overrides default intent icon)
- \`showIcon\`: boolean - Whether to show the icon (defaults to true)
- \`dismissible\`: boolean - Whether the alert can be dismissed with a close button
- \`onDismiss\`: function - Called when the alert is dismissed
- \`actions\`: React.ReactNode - Action buttons to display in the alert
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
    type="filled"
    message="Success message"
  />
  <Alert
    intent="warning"
    type="outlined"
    message="Warning message"
  />
  <Alert
    intent="error"
    type="soft"
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
