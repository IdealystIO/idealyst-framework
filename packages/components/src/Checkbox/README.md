# Checkbox Component

A customizable checkbox component with label support and theme integration.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple sizes (small, medium, large)
- ✅ Intent-based color schemes
- ✅ Label support with custom positioning
- ✅ Disabled state handling
- ✅ Accessible with proper ARIA attributes
- ✅ TypeScript support

## Basic Usage

```tsx
import { Checkbox } from '@idealyst/components';

// Basic checkbox
<Checkbox 
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
/>

// Checkbox with label
<Checkbox 
  checked={isAgreed}
  onPress={() => setIsAgreed(!isAgreed)}
  label="I agree to the terms and conditions"
/>

// Colored checkbox
<Checkbox 
  checked={isSelected}
  onPress={() => setIsSelected(!isSelected)}
  label="Enable notifications"
  intent="success"
  size="large"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the checkbox is checked |
| `onPress` | `() => void` | **Required** | Function called when checkbox is pressed |
| `label` | `string` | - | Text label to display next to checkbox |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the checkbox |
| `intent` | `IntentVariant` | `'primary'` | Color scheme/intent |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Position of label relative to checkbox |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Examples

### Different Sizes
```tsx
<Checkbox size="small" checked={small} onPress={() => setSmall(!small)} label="Small" />
<Checkbox size="medium" checked={medium} onPress={() => setMedium(!medium)} label="Medium" />
<Checkbox size="large" checked={large} onPress={() => setLarge(!large)} label="Large" />
```

### Intent Colors
```tsx
<Checkbox intent="primary" checked={primary} onPress={() => setPrimary(!primary)} label="Primary" />
<Checkbox intent="success" checked={success} onPress={() => setSuccess(!success)} label="Success" />
<Checkbox intent="error" checked={error} onPress={() => setError(!error)} label="Error" />
<Checkbox intent="warning" checked={warning} onPress={() => setWarning(!warning)} label="Warning" />
```

### Label Positioning
```tsx
<Checkbox 
  labelPosition="left" 
  checked={leftLabel} 
  onPress={() => setLeftLabel(!leftLabel)} 
  label="Label on left" 
/>
<Checkbox 
  labelPosition="right" 
  checked={rightLabel} 
  onPress={() => setRightLabel(!rightLabel)} 
  label="Label on right" 
/>
```

### Disabled State
```tsx
<Checkbox disabled checked={true} label="Disabled (checked)" />
<Checkbox disabled checked={false} label="Disabled (unchecked)" />
```

## Best Practices

1. **Provide clear labels** - Use descriptive text that explains what checking means
2. **Group related checkboxes** - Use consistent spacing and alignment
3. **Handle accessibility** - Ensure proper focus and screen reader support
4. **Use appropriate intents** - Match colors to the action's semantic meaning
5. **Test touch targets** - Ensure checkboxes are large enough for easy interaction