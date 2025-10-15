# TabBar Component

A flexible tab navigation component using an array-based API for organizing content into switchable views.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Array-based API (items prop)
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
import { TabBar } from '@idealyst/components';
import type { TabBarItem } from '@idealyst/components';

const [activeTab, setActiveTab] = useState('home');

const tabs: TabBarItem[] = [
  { value: 'home', label: 'Home' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
];

// Controlled tabs
<TabBar items={tabs} value={activeTab} onChange={setActiveTab} />

// Uncontrolled tabs with default
<TabBar items={tabs} defaultValue="home" />
```

## Props

### TabBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabBarItem[]` | **Required** | Array of tab items |
| `value` | `string` | - | Controlled value of active tab |
| `defaultValue` | `string` | First tab | Initial value for uncontrolled mode |
| `onChange` | `(value: string) => void` | - | Callback fired when tab changes |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'default'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the tabs |
| `intent` | `IntentVariant` | `'primary'` | Color scheme for active tab |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier |

### TabBarItem Type

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Unique identifier for the tab |
| `label` | `string` | **Required** | Label text displayed in the tab |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |

## Variants

### Default Variant
Clean tab bar with subtle background and sliding indicator.

```tsx
const tabs = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

<TabBar
  items={tabs}
  variant="default"
  value={activeTab}
  onChange={setActiveTab}
/>
```

### Pills Variant
Rounded pill-style tabs with filled active state.

```tsx
const tabs = [
  { value: 'home', label: 'Home' },
  { value: 'search', label: 'Search' },
  { value: 'profile', label: 'Profile' },
];

<TabBar
  items={tabs}
  variant="pills"
  value={activeTab}
  onChange={setActiveTab}
/>
```

### Underline Variant
Minimal tabs with underline indicator only.

```tsx
const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'details', label: 'Details' },
  { value: 'activity', label: 'Activity' },
];

<TabBar
  items={tabs}
  variant="underline"
  value={activeTab}
  onChange={setActiveTab}
/>
```

## Intent System

TabBar uses intent colors for the active tab indicator and text:

### Primary Intent (Default)
```tsx
<TabBar items={tabs} intent="primary" variant="pills" />
```

### Success Intent
```tsx
<TabBar items={tabs} intent="success" variant="underline" />
```

### Error Intent
```tsx
<TabBar items={tabs} intent="error" variant="pills" />
```

### Warning Intent
```tsx
<TabBar items={tabs} intent="warning" variant="default" />
```

### Neutral Intent
```tsx
<TabBar items={tabs} intent="neutral" variant="pills" />
```

## Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `small` | 36px | 12px | 14px | Compact spaces, secondary navigation |
| `medium` | 44px | 16px | 16px | Standard use, main navigation |
| `large` | 52px | 20px | 18px | Prominent navigation, mobile |

```tsx
<TabBar items={tabs} size="small" value={activeTab} onChange={setActiveTab} />
<TabBar items={tabs} size="medium" value={activeTab} onChange={setActiveTab} />
<TabBar items={tabs} size="large" value={activeTab} onChange={setActiveTab} />
```

## States

### Disabled Tabs
Individual tabs can be disabled in the items array:

```tsx
const tabs: TabBarItem[] = [
  { value: 'tab1', label: 'Enabled' },
  { value: 'tab2', label: 'Disabled', disabled: true },
  { value: 'tab3', label: 'Enabled' },
];

<TabBar items={tabs} value={activeTab} onChange={setActiveTab} />
```

## Common Patterns

### Tab Navigation with Content
```tsx
const [activeTab, setActiveTab] = useState('profile');

const tabs: TabBarItem[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'posts', label: 'Posts' },
  { value: 'photos', label: 'Photos' },
];

<View>
  <TabBar
    items={tabs}
    value={activeTab}
    onChange={setActiveTab}
    variant="underline"
  />

  <View style={{ padding: 16 }}>
    {activeTab === 'profile' && <ProfileContent />}
    {activeTab === 'posts' && <PostsContent />}
    {activeTab === 'photos' && <PhotosContent />}
  </View>
</View>
```

### Dynamic Tabs from Data
```tsx
const categories = ['All', 'Tech', 'Design', 'Business'];

const tabs: TabBarItem[] = categories.map(cat => ({
  value: cat.toLowerCase(),
  label: cat,
}));

<TabBar
  items={tabs}
  value={activeCategory}
  onChange={setActiveCategory}
  variant="pills"
/>
```

### Settings Sections
```tsx
const settingsTabs: TabBarItem[] = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'privacy', label: 'Privacy' },
];

<TabBar
  items={settingsTabs}
  value={section}
  onChange={setSection}
  variant="pills"
  size="small"
/>
```

### Dashboard Views
```tsx
const dashboardTabs: TabBarItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
];

<TabBar
  items={dashboardTabs}
  value={view}
  onChange={setView}
  variant="default"
  intent="primary"
  size="large"
/>
```

### Conditional Tabs
```tsx
const tabs: TabBarItem[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  ...(isAdmin ? [{ value: 'admin', label: 'Admin' }] : []),
];

<TabBar items={tabs} value={activeTab} onChange={setActiveTab} />
```

## Controlled vs Uncontrolled

### Controlled Mode
You manage the state and active tab:

```tsx
const [activeTab, setActiveTab] = useState('home');

const tabs: TabBarItem[] = [
  { value: 'home', label: 'Home' },
  { value: 'settings', label: 'Settings' },
];

<TabBar items={tabs} value={activeTab} onChange={setActiveTab} />
```

### Uncontrolled Mode
Component manages its own state:

```tsx
const tabs: TabBarItem[] = [
  { value: 'home', label: 'Home' },
  { value: 'settings', label: 'Settings' },
];

<TabBar
  items={tabs}
  defaultValue="home"
  onChange={(value) => console.log(value)}
/>
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
<TabBar
  items={tabs}
  value={activeTab}
  onChange={setActiveTab}
  style={{
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  }}
/>
```

## Best Practices

1. **Limit tab count** - Keep 3-7 tabs for optimal usability
2. **Use clear labels** - Short, descriptive tab labels
3. **Match content context** - Choose variant based on UI context
4. **Consider mobile** - Use scrollable tabs for many items on mobile
5. **Controlled state** - Prefer controlled mode for complex navigation
6. **Generate from data** - Use array mapping for dynamic tab sets
7. **Type safety** - Use `TabBarItem` type for type checking
8. **Avoid disabled tabs** - Hide unavailable content instead of disabling tabs when possible

## TabBar vs Tabs

Use **TabBar** when:
- You have a simple array of tab items
- You want a more concise API
- You're generating tabs from data
- You prefer data-driven components

Use **Tabs** when:
- You prefer the compound component pattern
- You want flexible JSX composition
- You're building complex tab structures

```tsx
// TabBar (array pattern) - recommended for most cases
const tabs: TabBarItem[] = [
  { value: 'a', label: 'Tab A' },
  { value: 'b', label: 'Tab B' }
];

<TabBar items={tabs} value={active} onChange={setActive} />

// Tabs (compound pattern)
<Tabs value={active} onChange={setActive}>
  <Tab value="a" label="Tab A" />
  <Tab value="b" label="Tab B" />
</Tabs>
```

Both components provide identical functionality and styling options.
