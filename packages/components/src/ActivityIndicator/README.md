# ActivityIndicator

A cross-platform loading indicator component that displays a spinning animation to indicate loading or processing state.

## Features

- **Cross-platform**: Works seamlessly on both React and React Native
- **Intent-based colors**: Uses semantic color system (primary, neutral, success, error, warning)
- **Multiple sizes**: Supports small, medium, large, or custom numeric sizes
- **Customizable**: Override colors and styles as needed
- **Animation control**: Start/stop animation with `animating` prop
- **Auto-hide**: Optionally hide when not animating

## Usage

```tsx
import { ActivityIndicator } from '@idealyst/components';

// Basic usage
<ActivityIndicator />

// With different sizes
<ActivityIndicator size="small" />
<ActivityIndicator size="medium" />
<ActivityIndicator size="large" />
<ActivityIndicator size={64} /> // Custom size in pixels

// With different intents
<ActivityIndicator intent="primary" />
<ActivityIndicator intent="success" />
<ActivityIndicator intent="error" />
<ActivityIndicator intent="warning" />
<ActivityIndicator intent="neutral" />

// Custom color
<ActivityIndicator color="#FF5733" />

// Control animation
<ActivityIndicator animating={isLoading} />

// Don't hide when stopped
<ActivityIndicator animating={false} hidesWhenStopped={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animating` | `boolean` | `true` | Whether the indicator is animating (visible) |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | The size of the indicator |
| `intent` | `'primary' \| 'neutral' \| 'success' \| 'error' \| 'warning'` | `'primary'` | The color intent of the indicator |
| `color` | `string` | - | Custom color to override intent |
| `style` | `ViewStyle` | - | Additional styles to apply to the container |
| `testID` | `string` | - | Test identifier for testing |
| `hidesWhenStopped` | `boolean` | `true` | Whether to hide the indicator when not animating |

## Examples

### Loading State
```tsx
const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator 
        animating={isLoading}
        size="large"
        intent="primary"
      />
      {isLoading && <Text>Loading data...</Text>}
    </View>
  );
};
```

### Button with Loading
```tsx
const SubmitButton = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };
  
  return (
    <Button onPress={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        'Submit'
      )}
    </Button>
  );
};
```

### Custom Styled Indicator
```tsx
<ActivityIndicator
  size={50}
  color="#8B5CF6"
  style={{
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 20,
    borderRadius: 10,
  }}
/>
```

## Platform Differences

- **Web**: Uses CSS animations with a custom spinner implementation
- **Native**: Uses React Native's built-in `ActivityIndicator` component
- Both platforms support all the same props for consistency

## Accessibility

The ActivityIndicator component includes:
- Proper ARIA roles for screen readers on web
- Visual indication of loading state
- Support for test IDs for testing

## Best Practices

1. **Always provide context**: Pair with text to explain what's loading
2. **Use appropriate sizes**: Small for inline, large for full-screen loading
3. **Match intent to context**: Use error intent for retry states, success for completion
4. **Consider animation performance**: Avoid too many simultaneous indicators
5. **Provide alternative content**: Show skeleton screens or placeholders when appropriate