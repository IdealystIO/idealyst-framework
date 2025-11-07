/**
 * Dialog Component Examples
 *
 * These examples are type-checked against the actual DialogProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Dialog, View, Text, Button } from '@idealyst/components';

// Example 1: Basic Dialog
export function BasicDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <View spacing="md">
          <Text size="lg" weight="bold">
            Welcome!
          </Text>
          <Text>This is a basic dialog with some content.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 2: Dialog with Title
export function DialogWithTitle() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Dialog Title">
        <View spacing="md">
          <Text>This dialog has a title in the header.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 3: Dialog Sizes
export function DialogSizes() {
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'fullscreen'>('md');
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <View spacing="sm">
        <Button size="sm" onPress={() => { setSize('sm'); setOpen(true); }}>
          Small Dialog
        </Button>
        <Button size="sm" onPress={() => { setSize('md'); setOpen(true); }}>
          Medium Dialog
        </Button>
        <Button size="sm" onPress={() => { setSize('lg'); setOpen(true); }}>
          Large Dialog
        </Button>
        <Button size="sm" onPress={() => { setSize('fullscreen'); setOpen(true); }}>
          Fullscreen Dialog
        </Button>
      </View>
      <Dialog open={open} onOpenChange={setOpen} title={`${size.toUpperCase()} Dialog`} size={size}>
        <View spacing="md">
          <Text>This is a {size} dialog.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 4: Dialog Types
export function DialogTypes() {
  const [type, setType] = React.useState<'standard' | 'alert' | 'confirmation'>('standard');
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <View spacing="sm">
        <Button onPress={() => { setType('standard'); setOpen(true); }}>
          Standard Dialog
        </Button>
        <Button onPress={() => { setType('alert'); setOpen(true); }}>
          Alert Dialog
        </Button>
        <Button onPress={() => { setType('confirmation'); setOpen(true); }}>
          Confirmation Dialog
        </Button>
      </View>
      <Dialog open={open} onOpenChange={setOpen} title="Dialog" type={type}>
        <View spacing="md">
          <Text>This is a {type} dialog type.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 5: Dialog with Close Button
export function DialogWithCloseButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Open Dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Dialog with Close Button"
        showCloseButton
      >
        <View spacing="md">
          <Text>This dialog has a close button in the header.</Text>
        </View>
      </Dialog>
    </View>
  );
}

// Example 6: Dialog with Backdrop Click Disabled
export function DialogWithBackdropDisabled() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Open Dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Modal Dialog"
        closeOnBackdropClick={false}
      >
        <View spacing="md">
          <Text>
            You cannot close this dialog by clicking outside. Use the close button instead.
          </Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 7: Confirmation Dialog
export function ConfirmationDialog() {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancelled');
    setOpen(false);
  };

  return (
    <View spacing="md">
      <Button intent="error" onPress={() => setOpen(true)}>
        Delete Item
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Deletion"
        type="confirmation"
        size="sm"
      >
        <View spacing="lg">
          <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
          <View spacing="sm">
            <Button intent="error" onPress={handleConfirm}>
              Delete
            </Button>
            <Button type="outlined" onPress={handleCancel}>
              Cancel
            </Button>
          </View>
        </View>
      </Dialog>
    </View>
  );
}

// Example 8: Form Dialog
export function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    console.log('Submitted:', { name, email });
    setOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Add User</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add New User"
        size="md"
        showCloseButton
      >
        <View spacing="lg">
          <View spacing="sm">
            <Text size="sm" weight="semibold">
              Name
            </Text>
            <Text size="sm" >
              Placeholder for input
            </Text>
          </View>
          <View spacing="sm">
            <Text size="sm" weight="semibold">
              Email
            </Text>
            <Text size="sm" >
              Placeholder for input
            </Text>
          </View>
          <View spacing="sm">
            <Button intent="primary" onPress={handleSubmit}>
              Add User
            </Button>
            <Button type="outlined" onPress={() => setOpen(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Dialog>
    </View>
  );
}

// Example 9: Alert Dialog
export function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button intent="warning" onPress={() => setOpen(true)}>
        Show Alert
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Important Notice"
        type="alert"
        size="sm"
        showCloseButton
      >
        <View spacing="lg">
          <Text>
            Your session will expire in 5 minutes. Please save your work to avoid losing any
            changes.
          </Text>
          <Button onPress={() => setOpen(false)}>OK</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 10: Dialog with Animation Types (Native)
export function DialogWithAnimations() {
  const [animationType, setAnimationType] = React.useState<'slide' | 'fade' | 'none'>('fade');
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <View spacing="sm">
        <Button size="sm" onPress={() => { setAnimationType('slide'); setOpen(true); }}>
          Slide Animation
        </Button>
        <Button size="sm" onPress={() => { setAnimationType('fade'); setOpen(true); }}>
          Fade Animation
        </Button>
        <Button size="sm" onPress={() => { setAnimationType('none'); setOpen(true); }}>
          No Animation
        </Button>
      </View>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Animated Dialog"
        animationType={animationType}
      >
        <View spacing="md">
          <Text>This dialog uses {animationType} animation (Native only).</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Dialog>
    </View>
  );
}

// Example 11: Settings Dialog
export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setOpen(true)}>Open Settings</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Settings"
        size="md"
        showCloseButton
      >
        <View spacing="lg">
          <View spacing="md">
            <Text weight="semibold">Notifications</Text>
            <View spacing="sm">
              <Text size="sm">• Email notifications: On</Text>
              <Text size="sm">• Push notifications: Off</Text>
            </View>
          </View>
          <View spacing="md">
            <Text weight="semibold">Privacy</Text>
            <View spacing="sm">
              <Text size="sm">• Profile visibility: Public</Text>
              <Text size="sm">• Activity status: Visible</Text>
            </View>
          </View>
          <Button onPress={() => setOpen(false)}>Save Changes</Button>
        </View>
      </Dialog>
    </View>
  );
}
