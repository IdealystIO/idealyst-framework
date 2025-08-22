# Dialog Component

A modal dialog component that creates a global overlay across the entire application. The Dialog component works consistently across web and React Native platforms.

## Features

- **Global Overlay**: Appears above all other content including navigation bars and tab bars
- **Cross-Platform**: Uses React portals on web and Modal component on React Native
- **Accessibility**: Focus management, escape key support (web), hardware back button handling (native)
- **Theme Integration**: Supports intent-based colors and Unistyles variants
- **Flexible Sizing**: Multiple size options from small to fullscreen
- **Backdrop Interaction**: Configurable backdrop click behavior

## Usage

```tsx
import { Dialog, Button, Text } from '@idealyst/components';
import { useState } from 'react';

const MyComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setOpen(true)}>
        Open Dialog
      </Button>
      
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Dialog Title"
        size="medium"
        variant="default"
        intent="primary"
      >
        <Text>Dialog content goes here</Text>
        <Button onPress={() => setOpen(false)}>
          Close
        </Button>
      </Dialog>
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Whether the dialog is visible |
| `onOpenChange` | `(open: boolean) => void` | - | Called when dialog should open/close |
| `title` | `string` | - | Optional title displayed in header |
| `children` | `ReactNode` | - | Content to display inside dialog |
| `size` | `'small' \| 'medium' \| 'large' \| 'fullscreen'` | `'medium'` | Size of the dialog |
| `variant` | `'default' \| 'alert' \| 'confirmation'` | `'default'` | Visual style variant |
| `intent` | `'primary' \| 'neutral' \| 'success' \| 'error' \| 'warning'` | `'primary'` | Color scheme/semantic meaning |
| `showCloseButton` | `boolean` | `true` | Whether to show close button in header |
| `closeOnBackdropClick` | `boolean` | `true` | Whether clicking backdrop closes dialog |
| `closeOnEscapeKey` | `boolean` | `true` | Whether escape key closes dialog (web only) |
| `animationType` | `'slide' \| 'fade' \| 'none'` | `'fade'` | Animation type (native only) |
| `style` | `any` | - | Additional platform-specific styles |
| `testID` | `string` | - | Test identifier |

## Variants

### Size Variants
- **small**: 400px max width, suitable for simple alerts
- **medium**: 600px max width, good for forms and content
- **large**: 800px max width, for complex layouts
- **fullscreen**: Full screen coverage, removes border radius

### Visual Variants
- **default**: Standard dialog appearance
- **alert**: Adds colored top border for alerts
- **confirmation**: Adds colored top border for confirmations

### Intent Colors
When used with `alert` or `confirmation` variants:
- **primary**: Blue top border
- **success**: Green top border  
- **error**: Red top border
- **warning**: Orange top border
- **neutral**: Gray top border

## Platform Differences

### Web Implementation
- Uses React portals to render into `document.body`
- Supports escape key to close
- Automatic focus management and restoration
- Click outside to close (configurable)
- Body scroll prevention when open

### React Native Implementation
- Uses React Native's `Modal` component
- Hardware back button handling on Android
- Touch outside to close (configurable)
- Configurable animation types

## Examples

### Basic Dialog
```tsx
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Basic Dialog"
>
  <Text>Simple dialog content</Text>
</Dialog>
```

### Alert Dialog
```tsx
<Dialog
  open={alertOpen}
  onOpenChange={setAlertOpen}
  title="Important Alert"
  variant="alert"
  intent="warning"
>
  <Text>This is an important message!</Text>
</Dialog>
```

### Confirmation Dialog
```tsx
<Dialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Confirm Action"
  variant="confirmation"
  intent="error"
  closeOnBackdropClick={false}
>
  <Text>Are you sure you want to delete this item?</Text>
  <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
    <Button variant="outlined" onPress={() => setConfirmOpen(false)}>
      Cancel
    </Button>
    <Button variant="contained" intent="error" onPress={handleDelete}>
      Delete
    </Button>
  </View>
</Dialog>
```

### Fullscreen Dialog
```tsx
<Dialog
  open={fullscreenOpen}
  onOpenChange={setFullscreenOpen}
  title="Fullscreen Dialog"
  size="fullscreen"
>
  <Text>This dialog covers the entire screen</Text>
</Dialog>
```

## Accessibility

- **Focus Management**: Automatically focuses dialog on open and restores focus on close (web)
- **Keyboard Navigation**: Escape key support on web
- **Screen Readers**: Proper ARIA roles and labels
- **Touch Targets**: Minimum 44px touch targets for interactive elements
- **Hardware Back Button**: Handled automatically on Android

## Best Practices

1. **Use appropriate sizes**: Choose size based on content complexity
2. **Provide clear actions**: Always include a way to close the dialog
3. **Use variants appropriately**: Choose alert or confirmation for important dialogs
4. **Handle confirmation dialogs carefully**: Disable backdrop close for destructive actions
5. **Keep content focused**: Dialogs should have a single, clear purpose
6. **Test cross-platform**: Verify behavior on both web and native platforms

## Common Patterns

### Form Dialog
```tsx
<Dialog open={formOpen} onOpenChange={setFormOpen} title="Edit Profile">
  <View spacing="md">
    <Input label="Name" value={name} onChangeText={setName} />
    <Input label="Email" value={email} onChangeText={setEmail} />
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant="outlined" onPress={() => setFormOpen(false)}>
        Cancel
      </Button>
      <Button variant="contained" onPress={handleSave}>
        Save
      </Button>
    </View>
  </View>
</Dialog>
```

### Loading Dialog
```tsx
<Dialog 
  open={loading} 
  onOpenChange={() => {}} 
  closeOnBackdropClick={false}
  showCloseButton={false}
>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
</Dialog>
```