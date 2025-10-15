# Tabs Component

A flexible tab navigation component using a compound component pattern (Tabs + Tab children) for organizing content into switchable views.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Compound component pattern (Tabs + Tab)
- ✅ Animated sliding indicator
- ✅ Three variants (default, pills, underline)
- ✅ Intent-based color system
- ✅ Multiple sizes (small, medium, large)
- ✅ Disabled tab support
- ✅ Controlled and uncontrolled modes
- ✅ TypeScript support
- ✅ Accessible with proper ARIA attributes
- ✅ Scrollable on mobile (native)

## Basic Usage

```tsx
import { Tabs, Tab } from '@idealyst/components';

const [activeTab, setActiveTab] = useState('home');

// Controlled tabs
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="home" label="Home" />
  <Tab value="profile" label="Profile" />
  <Tab value="settings" label="Settings" />
</Tabs>

// Uncontrolled tabs with default
<Tabs defaultValue="home">
  <Tab value="home" label="Home" />
  <Tab value="profile" label="Profile" />
  <Tab value="settings" label="Settings" />
</Tabs>
```

## Props

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value of active tab |
| `defaultValue` | `string` | First tab | Initial value for uncontrolled mode |
| `onChange` | `(value: string) => void` | - | Callback fired when tab changes |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'default'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the tabs |
| `intent` | `IntentVariant` | `'primary'` | Color scheme for active tab |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier |
| `children` | `ReactNode` | **Required** | Tab components |

### Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Unique identifier for the tab |
| `label` | `string` | **Required** | Label text displayed in the tab |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `children` | `ReactNode` | - | Content (not rendered in tab bar) |

## Variants

### Default Variant
Clean tab bar with subtle background and sliding indicator.

```tsx
<Tabs variant="default" value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
  <Tab value="tab3" label="Tab 3" />
</Tabs>
```

### Pills Variant
Rounded pill-style tabs with filled active state.

```tsx
<Tabs variant="pills" value={activeTab} onChange={setActiveTab}>
  <Tab value="home" label="Home" />
  <Tab value="search" label="Search" />
  <Tab value="profile" label="Profile" />
</Tabs>
```

### Underline Variant
Minimal tabs with underline indicator only.

```tsx
<Tabs variant="underline" value={activeTab} onChange={setActiveTab}>
  <Tab value="overview" label="Overview" />
  <Tab value="details" label="Details" />
  <Tab value="activity" label="Activity" />
</Tabs>
```

## Intent System

Tabs use intent colors for the active tab indicator and text:

### Primary Intent (Default)
```tsx
<Tabs intent="primary" variant="pills">
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

### Success Intent
```tsx
<Tabs intent="success" variant="underline">
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

### Error Intent
```tsx
<Tabs intent="error" variant="pills">
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

### Warning Intent
```tsx
<Tabs intent="warning" variant="default">
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

### Neutral Intent
```tsx
<Tabs intent="neutral" variant="pills">
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

## Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `small` | 36px | 12px | 14px | Compact spaces, secondary navigation |
| `medium` | 44px | 16px | 16px | Standard use, main navigation |
| `large` | 52px | 20px | 18px | Prominent navigation, mobile |

```tsx
<Tabs size="small" value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Small Tab" />
  <Tab value="tab2" label="Small Tab" />
</Tabs>

<Tabs size="medium" value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Medium Tab" />
  <Tab value="tab2" label="Medium Tab" />
</Tabs>

<Tabs size="large" value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Large Tab" />
  <Tab value="tab2" label="Large Tab" />
</Tabs>
```

## States

### Disabled Tabs
Individual tabs can be disabled:

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Enabled" />
  <Tab value="tab2" label="Disabled" disabled />
  <Tab value="tab3" label="Enabled" />
</Tabs>
```

## Common Patterns

### Tab Navigation with Content
```tsx
const [activeTab, setActiveTab] = useState('profile');

<View>
  <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
    <Tab value="profile" label="Profile" />
    <Tab value="posts" label="Posts" />
    <Tab value="photos" label="Photos" />
  </Tabs>

  <View style={{ padding: 16 }}>
    {activeTab === 'profile' && <ProfileContent />}
    {activeTab === 'posts' && <PostsContent />}
    {activeTab === 'photos' && <PhotosContent />}
  </View>
</View>
```

### Settings Sections
```tsx
const [section, setSection] = useState('general');

<Tabs value={section} onChange={setSection} variant="pills" size="small">
  <Tab value="general" label="General" />
  <Tab value="security" label="Security" />
  <Tab value="notifications" label="Notifications" />
  <Tab value="privacy" label="Privacy" />
</Tabs>
```

### Dashboard Views
```tsx
<Tabs
  value={view}
  onChange={setView}
  variant="default"
  intent="primary"
  size="large"
>
  <Tab value="overview" label="Overview" />
  <Tab value="analytics" label="Analytics" />
  <Tab value="reports" label="Reports" />
</Tabs>
```

## Controlled vs Uncontrolled

### Controlled Mode
You manage the state and active tab:

```tsx
const [activeTab, setActiveTab] = useState('home');

<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="home" label="Home" />
  <Tab value="settings" label="Settings" />
</Tabs>
```

### Uncontrolled Mode
Component manages its own state:

```tsx
<Tabs defaultValue="home" onChange={(value) => console.log(value)}>
  <Tab value="home" label="Home" />
  <Tab value="settings" label="Settings" />
</Tabs>
```

## Accessibility

- Proper `role="tablist"` and `role="tab"` attributes
- `aria-selected` indicates active tab
- `aria-disabled` for disabled tabs
- Keyboard navigation support (arrow keys)
- Focus management
- Touch targets meet minimum size requirements (44px)

## Cross-Platform Differences

### Web
- Fixed position tabs
- CSS-based sliding indicator
- Hover states

### Native (React Native)
- ScrollView for horizontal scrolling
- Animated indicator using Animated API
- No hover states (touch-based)

## Styling

```tsx
// Custom styling
<Tabs
  value={activeTab}
  onChange={setActiveTab}
  style={{
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  }}
>
  <Tab value="tab1" label="Tab 1" />
  <Tab value="tab2" label="Tab 2" />
</Tabs>
```

## Best Practices

1. **Limit tab count** - Keep 3-7 tabs for optimal usability
2. **Use clear labels** - Short, descriptive tab labels
3. **Match content context** - Choose variant based on UI context
4. **Consider mobile** - Use scrollable tabs for many items on mobile
5. **Controlled state** - Prefer controlled mode for complex navigation
6. **Avoid disabled tabs** - Hide unavailable content instead of disabling tabs when possible
7. **Test accessibility** - Ensure keyboard navigation works properly

## Tabs vs TabBar

Use **Tabs** when:
- You prefer the compound component pattern
- You want flexible JSX composition
- You're building complex tab structures

Use **TabBar** when:
- You have a simple array of tab items
- You want a more concise API
- You're generating tabs from data

```tsx
// Tabs (compound pattern)
<Tabs value={active} onChange={setActive}>
  <Tab value="a" label="Tab A" />
  <Tab value="b" label="Tab B" />
</Tabs>

// TabBar (array pattern)
<TabBar
  items={[
    { value: 'a', label: 'Tab A' },
    { value: 'b', label: 'Tab B' }
  ]}
  value={active}
  onChange={setActive}
/>
```

Both components provide identical functionality and styling options.
