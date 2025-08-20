# Input Component

A text input component with consistent styling and form integration.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple sizes and variants
- ✅ Label and helper text support
- ✅ Error state handling
- ✅ Placeholder and validation
- ✅ TypeScript support

## Basic Usage

```tsx
import { Input } from '@idealyst/components';

// Basic input
<Input 
  value={value}
  onChangeText={setValue}
  placeholder="Enter text..."
/>

// Input with label
<Input 
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
/>

// Input with error
<Input 
  label="Password"
  value={password}
  onChangeText={setPassword}
  error={passwordError}
  secureTextEntry
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Current input value |
| `onChangeText` | `(text: string) => void` | **Required** | Called when text changes |
| `label` | `string` | - | Label text to display above input |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message to display |
| `helperText` | `string` | - | Helper text below input |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the input |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual style variant |
| `required` | `boolean` | `false` | Whether input is required |
| `multiline` | `boolean` | `false` | Allow multiple lines |
| `style` | `ViewStyle` | - | Additional custom styles |

## Examples

### Form Inputs
```tsx
<View style={{ gap: 16 }}>
  <Input 
    label="Full Name"
    value={name}
    onChangeText={setName}
    required
  />
  <Input 
    label="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    error={emailError}
  />
  <Input 
    label="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    helperText="Must be at least 8 characters"
  />
</View>
```

### Multiline Input
```tsx
<Input 
  label="Description"
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={4}
  placeholder="Enter description..."
/>
```