# Accordion Component

An expandable/collapsible component for organizing content into sections that can be shown or hidden.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Single or multiple expansion modes
- ✅ Three variants (default, separated, bordered)
- ✅ Intent-based color system
- ✅ Multiple sizes (small, medium, large)
- ✅ Disabled item support
- ✅ Smooth animations
- ✅ Default expanded items
- ✅ TypeScript support
- ✅ Accessible with proper ARIA attributes

## Basic Usage

```tsx
import { Accordion } from '@idealyst/components';
import type { AccordionItem } from '@idealyst/components';

const items: AccordionItem[] = [
  {
    id: 'item1',
    title: 'What is React?',
    content: 'React is a JavaScript library for building user interfaces.',
  },
  {
    id: 'item2',
    title: 'What is TypeScript?',
    content: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
  },
  {
    id: 'item3',
    title: 'What is Unistyles?',
    content: 'Unistyles is a cross-platform styling library.',
  },
];

// Basic accordion (single expansion)
<Accordion items={items} />

// Allow multiple expanded items
<Accordion items={items} allowMultiple />

// Default expanded items
<Accordion
  items={items}
  defaultExpanded={['item1', 'item2']}
  allowMultiple
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | **Required** | Array of accordion items |
| `allowMultiple` | `boolean` | `false` | Allow multiple items to be expanded |
| `defaultExpanded` | `string[]` | `[]` | IDs of items expanded by default |
| `variant` | `'default' \| 'separated' \| 'bordered'` | `'default'` | Visual style variant |
| `intent` | `IntentVariant` | `'primary'` | Color scheme for expanded items |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the accordion items |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier |

## AccordionItem Type

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **Required** | Unique identifier for the item |
| `title` | `string` | **Required** | Title displayed in the header |
| `content` | `React.ReactNode` | **Required** | Content to display when expanded |
| `disabled` | `boolean` | `false` | Whether the item is disabled |

## Variants

### Default Variant
Clean accordion with borders between items.

```tsx
<Accordion items={items} variant="default" />
```

### Separated Variant
Each item has its own border and spacing between items.

```tsx
<Accordion items={items} variant="separated" />
```

### Bordered Variant
Items are contained within a single bordered container.

```tsx
<Accordion items={items} variant="bordered" />
```

## Intent System

Accordions use intent colors for the icon and expanded header background:

### Primary Intent (Default)
```tsx
<Accordion items={items} intent="primary" variant="separated" />
```

### Success Intent
```tsx
<Accordion items={items} intent="success" variant="separated" />
```

### Error Intent
```tsx
<Accordion items={items} intent="error" variant="separated" />
```

### Warning Intent
```tsx
<Accordion items={items} intent="warning" variant="separated" />
```

### Neutral Intent
```tsx
<Accordion items={items} intent="neutral" variant="separated" />
```

## Sizes

| Size | Header Padding | Font Size | Use Case |
|------|---------------|-----------|----------|
| `small` | 10px | 14px | Compact spaces, secondary content |
| `medium` | 14px | 16px | Standard use |
| `large` | 18px | 18px | Prominent sections, mobile |

```tsx
<Accordion items={items} size="small" variant="separated" />
<Accordion items={items} size="medium" variant="separated" />
<Accordion items={items} size="large" variant="separated" />
```

## Rich Content

Accordion items can contain any React components:

```tsx
const richContentItems: AccordionItem[] = [
  {
    id: 'rich1',
    title: 'Rich Content Example',
    content: (
      <View spacing="sm">
        <Text weight="semibold">Features:</Text>
        <Text>• Cross-platform support</Text>
        <Text>• Type-safe styling</Text>
        <Text>• Theme variants</Text>
      </View>
    ),
  },
  {
    id: 'rich2',
    title: 'Form Section',
    content: (
      <View spacing="md">
        <Input label="Name" />
        <Input label="Email" />
        <Button>Submit</Button>
      </View>
    ),
  },
];

<Accordion items={richContentItems} variant="bordered" />
```

## Expansion Modes

### Single Expansion (Default)
Only one item can be expanded at a time:

```tsx
<Accordion items={items} />
```

### Multiple Expansion
Multiple items can be expanded simultaneously:

```tsx
<Accordion items={items} allowMultiple />
```

### Default Expanded
Start with specific items expanded:

```tsx
// Single item expanded by default
<Accordion items={items} defaultExpanded={['item1']} />

// Multiple items expanded by default
<Accordion
  items={items}
  defaultExpanded={['item1', 'item3']}
  allowMultiple
/>
```

## States

### Disabled Items
Individual items can be disabled:

```tsx
const items: AccordionItem[] = [
  { id: 'item1', title: 'Enabled', content: 'This is enabled.' },
  { id: 'item2', title: 'Disabled', content: 'This is disabled.', disabled: true },
  { id: 'item3', title: 'Enabled', content: 'This is also enabled.' },
];

<Accordion items={items} variant="separated" />
```

## Common Patterns

### FAQ Section
```tsx
const faqItems: AccordionItem[] = [
  {
    id: 'faq1',
    title: 'How do I get started?',
    content: 'Follow our quick start guide to get up and running in minutes.',
  },
  {
    id: 'faq2',
    title: 'Is there a free trial?',
    content: 'Yes! We offer a 14-day free trial with full access to all features.',
  },
  {
    id: 'faq3',
    title: 'Can I cancel anytime?',
    content: 'Absolutely. Cancel your subscription anytime with no penalties.',
  },
];

<Accordion
  items={faqItems}
  variant="separated"
  size="medium"
/>
```

### Settings Sections
```tsx
const settingsItems: AccordionItem[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    content: <ProfileSettingsForm />,
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    content: <SecuritySettingsForm />,
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    content: <NotificationSettingsForm />,
  },
];

<Accordion
  items={settingsItems}
  variant="bordered"
  allowMultiple
  defaultExpanded={['profile']}
/>
```

### Documentation Sections
```tsx
const docItems: AccordionItem[] = [
  {
    id: 'intro',
    title: 'Introduction',
    content: <IntroductionContent />,
  },
  {
    id: 'installation',
    title: 'Installation',
    content: <InstallationGuide />,
  },
  {
    id: 'usage',
    title: 'Usage Examples',
    content: <UsageExamples />,
  },
  {
    id: 'api',
    title: 'API Reference',
    content: <APIReference />,
  },
];

<Accordion
  items={docItems}
  variant="default"
  size="large"
/>
```

### Feature Comparison
```tsx
const featureItems: AccordionItem[] = [
  {
    id: 'basic',
    title: 'Basic Plan - $9/month',
    content: (
      <View spacing="xs">
        <Text>✓ Up to 10 projects</Text>
        <Text>✓ 5GB storage</Text>
        <Text>✓ Email support</Text>
      </View>
    ),
  },
  {
    id: 'pro',
    title: 'Pro Plan - $29/month',
    content: (
      <View spacing="xs">
        <Text>✓ Unlimited projects</Text>
        <Text>✓ 50GB storage</Text>
        <Text>✓ Priority support</Text>
        <Text>✓ Advanced analytics</Text>
      </View>
    ),
  },
];

<Accordion
  items={featureItems}
  variant="separated"
  intent="primary"
/>
```

## Accessibility

- Proper `aria-expanded` attributes
- `aria-disabled` for disabled items
- Keyboard navigation support
- Focus management
- Touch targets meet minimum size requirements (44px)
- Screen reader compatible

## Animations

### Web
- Smooth max-height transition
- Chevron icon rotation
- Background color transition on expand

### Native (React Native)
- Animated.View for smooth expansion
- Platform-appropriate timing curves
- No hover states (touch-based)

## Styling

```tsx
// Custom styling
<Accordion
  items={items}
  variant="separated"
  style={{
    padding: 16,
    backgroundColor: '#f5f5f5',
  }}
/>
```

## Best Practices

1. **Clear titles** - Use descriptive, concise titles for each section
2. **Reasonable content** - Keep content within each section focused
3. **Default expanded** - Expand important sections by default
4. **Limit items** - Use 3-10 items for optimal usability
5. **Consistent variants** - Use the same variant throughout your app
6. **Rich content** - Leverage React components for complex content
7. **Single vs multiple** - Use single expansion for exclusive content, multiple for independent sections
8. **Mobile friendly** - Test touch interactions and content reflow
9. **Test accessibility** - Ensure keyboard navigation and screen readers work properly

## Performance Tips

- Use `React.memo` for expensive content components
- Avoid deeply nested accordions
- Keep content components lightweight
- Use virtualization for very long lists of accordion items
