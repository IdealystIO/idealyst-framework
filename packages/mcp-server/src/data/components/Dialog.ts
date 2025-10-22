export const Dialog = {
category: "overlay",
    description: "Modal overlay for focused user interactions and important information",
    props: `
- \`open\`: boolean - Control dialog visibility
- \`onOpenChange\`: (open: boolean) => void - Open state change handler
- \`title\`: string - Dialog title
- \`size\`: 'sm' | 'md' | 'lg' | 'fullscreen' - Dialog size
- \`variant\`: 'default' | 'alert' - Visual style
- \`showCloseButton\`: boolean - Show close button
- \`closeOnBackdropClick\`: boolean - Close when clicking backdrop
- \`closeOnEscapeKey\`: boolean - Close on Escape key
- \`children\`: ReactNode - Dialog content
`,
    features: [
      "Controlled open state",
      "Multiple sizes including fullscreen",
      "Alert variant for important messages",
      "Optional close button",
      "Backdrop click and Escape key handling",
      "Focus trap and accessibility support",
    ],
    bestPractices: [
      "Use for actions requiring user attention",
      "Keep dialog content focused and concise",
      "Provide clear action buttons",
      "Use alert variant for critical confirmations",
      "Always provide a way to close the dialog",
    ],
    usage: `
import { Dialog, Button, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Action"
        size="md"
      >
        <View spacing="md">
          <Text>Are you sure you want to proceed?</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outlined" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onPress={() => { handleConfirm(); setOpen(false); }}>
              Confirm
            </Button>
          </View>
        </View>
      </Dialog>
    </>
  );
}
`,
    examples: {
      basic: `import { Dialog, Button, Text } from '@idealyst/components';

<Dialog open={true} onOpenChange={setOpen} title="Simple Dialog">
  <Text>Dialog content here</Text>
</Dialog>`,
      variants: `import { Dialog, Text } from '@idealyst/components';

// Default dialog
<Dialog open={open} onOpenChange={setOpen} title="Information">
  <Text>Information content</Text>
</Dialog>

// Alert dialog
<Dialog open={open} onOpenChange={setOpen} title="Warning" variant="alert">
  <Text>This action cannot be undone</Text>
</Dialog>`,
      "with-icons": `import { Dialog, View, Icon, Text, Button } from '@idealyst/components';

<Dialog open={open} onOpenChange={setOpen} title="Delete Item">
  <View spacing="md">
    <View style={{ alignItems: 'center' }}>
      <Icon name="delete" size="xl" color="error" />
    </View>
    <Text>This action cannot be undone. Continue?</Text>
    <Button intent="error" onPress={handleDelete}>Delete</Button>
  </View>
</Dialog>`,
      interactive: `import { Dialog, Button, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setOpen(false);
  };

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      {confirmed && <Text>Action confirmed!</Text>}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Action"
        closeOnBackdropClick
        closeOnEscapeKey
      >
        <View spacing="md">
          <Text>Proceed with this action?</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outlined" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button intent="primary" onPress={handleConfirm}>
              Confirm
            </Button>
          </View>
        </View>
      </Dialog>
    </View>
  );
}`,
    }
};
