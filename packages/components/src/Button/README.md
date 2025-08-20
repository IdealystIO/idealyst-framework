# Button Component

A versatile button component with multiple variants, intents, and sizes for consistent user interactions.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Three variants (contained, outlined, text)
- ✅ Intent-based color system
- ✅ Multiple sizes (small, medium, large)
- ✅ Disabled and loading states
- ✅ Accessible with proper ARIA attributes
- ✅ TypeScript support

## Basic Usage

```tsx
import { Button } from '@idealyst/components';

// Basic contained button
<Button 
  variant="contained"
  intent="primary"
  onPress={() => console.log('Pressed!')}
>
  Click Me
</Button>

// Outlined button
<Button 
  variant="outlined"
  intent="neutral"
  onPress={handlePress}
>
  Cancel
</Button>

// Text button
<Button 
  variant="text"
  intent="primary"
  onPress={handlePress}
>
  Learn More
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the button |
| `title` | `string` | - | Text title for the button (web compatibility) |
| `onPress` | `() => void` | **Required** | Function called when button is pressed |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `variant` | `'contained' \| 'outlined' \| 'text'` | `'contained'` | Visual style variant |
| `intent` | `IntentVariant` | `'primary'` | Color scheme/intent of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `loading` | `boolean` | `false` | Show loading state (React Native only) |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Variants

### Contained Button
High emphasis button with solid background color.

```tsx
<Button variant="contained" intent="primary" onPress={handleSave}>
  Save Changes
</Button>
<Button variant="contained" intent="error" onPress={handleDelete}>
  Delete
</Button>
```

### Outlined Button
Medium emphasis button with border and transparent background.

```tsx
<Button variant="outlined" intent="neutral" onPress={handleCancel}>
  Cancel
</Button>
<Button variant="outlined" intent="success" onPress={handleApprove}>
  Approve
</Button>
```

### Text Button
Low emphasis button with no background or border.

```tsx
<Button variant="text" intent="primary" onPress={handleLearnMore}>
  Learn More
</Button>
<Button variant="text" intent="neutral" onPress={handleSkip}>
  Skip
</Button>
```

## Intent System

Buttons use an intent-based color system for semantic meaning:

### Primary Intent
Main brand actions and primary calls-to-action.

```tsx
<Button intent="primary" onPress={handleSubmit}>Submit</Button>
<Button intent="primary" onPress={handleSignIn}>Sign In</Button>
```

### Neutral Intent
Secondary actions and neutral operations.

```tsx
<Button intent="neutral" onPress={handleCancel}>Cancel</Button>
<Button intent="neutral" onPress={handleBack}>Back</Button>
```

### Success Intent
Positive actions like save, confirm, or approve.

```tsx
<Button intent="success" onPress={handleSave}>Save</Button>
<Button intent="success" onPress={handleConfirm}>Confirm</Button>
```

### Error Intent
Destructive actions like delete or remove.

```tsx
<Button intent="error" onPress={handleDelete}>Delete</Button>
<Button intent="error" onPress={handleRemove}>Remove</Button>
```

### Warning Intent
Caution actions that require attention.

```tsx
<Button intent="warning" onPress={handleWarningAction}>Proceed with Caution</Button>
```

## Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `small` | 32px | 12px | 14px | Compact spaces, secondary actions |
| `medium` | 40px | 16px | 16px | Standard use, forms |
| `large` | 48px | 20px | 18px | Primary actions, mobile |

```tsx
<Button size="small" intent="neutral">Small</Button>
<Button size="medium" intent="primary">Medium</Button>
<Button size="large" intent="primary">Large</Button>
```

## States

### Disabled State
```tsx
<Button 
  disabled={true}
  intent="primary"
  onPress={handlePress}
>
  Disabled Button
</Button>
```

### Loading State (React Native)
```tsx
<Button 
  loading={isLoading}
  intent="primary"
  onPress={handleAsyncAction}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

## Common Patterns

### Form Actions
```tsx
<View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
  <Button variant="outlined" intent="neutral" onPress={handleCancel}>
    Cancel
  </Button>
  <Button variant="contained" intent="primary" onPress={handleSubmit}>
    Submit
  </Button>
</View>
```

### Destructive Actions
```tsx
<View style={{ flexDirection: 'row', gap: 12 }}>
  <Button variant="outlined" intent="neutral" onPress={handleCancel}>
    Cancel
  </Button>
  <Button variant="contained" intent="error" onPress={handleDelete}>
    Delete Forever
  </Button>
</View>
```

### Call-to-Action Groups
```tsx
<View style={{ gap: 12 }}>
  <Button 
    variant="contained" 
    intent="primary" 
    size="large"
    onPress={handleGetStarted}
  >
    Get Started
  </Button>
  <Button 
    variant="text" 
    intent="neutral"
    onPress={handleLearnMore}
  >
    Learn More
  </Button>
</View>
```

## Accessibility

- Proper focus management and keyboard navigation
- ARIA labels and roles for screen readers
- Sufficient contrast ratios for all variants
- Disabled state properly communicated to assistive technologies
- Touch targets meet minimum size requirements (44px)

## Styling

```tsx
// Custom button styling
<Button 
  variant="contained"
  intent="primary"
  style={{
    borderRadius: 20,
    paddingHorizontal: 24,
  }}
  onPress={handlePress}
>
  Custom Styled
</Button>
```

## Best Practices

1. **Use appropriate intents** - Match button color to action semantics
2. **Limit contained buttons** - Use one primary contained button per view
3. **Provide clear labels** - Button text should describe the action
4. **Consider hierarchy** - Use variants to establish visual hierarchy
5. **Mind touch targets** - Ensure buttons are large enough for touch interaction
6. **Handle loading states** - Provide feedback for async actions
7. **Test accessibility** - Verify with screen readers and keyboard navigation