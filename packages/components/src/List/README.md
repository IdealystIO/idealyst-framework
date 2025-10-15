# List Component

A flexible list component for displaying structured data, perfect for sidebars, navigation menus, and content lists.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Three components: List, ListItem, ListSection
- ✅ Three variants (default, bordered, divided)
- ✅ Multiple sizes (small, medium, large)
- ✅ Leading/trailing elements (icons, badges, etc.)
- ✅ Active and selected states
- ✅ Disabled items
- ✅ Indentation support for hierarchy
- ✅ Sections with titles
- ✅ Rich content support
- ✅ TypeScript support
- ✅ Accessible with proper ARIA attributes

## Basic Usage

```tsx
import { List, ListItem } from '@idealyst/components';

// Basic list
<List variant="divided">
  <ListItem label="Item 1" />
  <ListItem label="Item 2" />
  <ListItem label="Item 3" />
</List>

// Clickable navigation list
<List variant="bordered">
  <ListItem
    label="Dashboard"
    leading={<Icon name="home" size={20} />}
    selected={current === 'dashboard'}
    onPress={() => navigate('dashboard')}
  />
  <ListItem
    label="Settings"
    leading={<Icon name="settings" size={20} />}
    selected={current === 'settings'}
    onPress={() => navigate('settings')}
  />
</List>
```

## Props

### List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | ListItem and ListSection components |
| `variant` | `'default' \| 'bordered' \| 'divided'` | `'default'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size |
| `style` | `ViewStyle` | - | Custom styles |
| `testID` | `string` | - | Test identifier |

### ListItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Primary text |
| `children` | `ReactNode` | - | Custom content |
| `leading` | `ReactNode` | - | Leading element (icon, avatar) |
| `trailing` | `ReactNode` | - | Trailing element (badge, chevron) |
| `active` | `boolean` | `false` | Active state |
| `selected` | `boolean` | `false` | Selected state (highlighted) |
| `disabled` | `boolean` | `false` | Disabled state |
| `indent` | `number` | `0` | Indentation level |
| `onPress` | `() => void` | - | Click handler |
| `style` | `ViewStyle` | - | Custom styles |
| `testID` | `string` | - | Test identifier |

### ListSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |
| `children` | `ReactNode` | **Required** | ListItem components |
| `collapsed` | `boolean` | `false` | Collapsed state |
| `style` | `ViewStyle` | - | Custom styles |
| `testID` | `string` | - | Test identifier |

## Common Patterns

### Navigation Sidebar
```tsx
<List variant="bordered">
  <ListItem
    label="Dashboard"
    leading={<Icon name="dashboard" />}
    selected={page === 'dashboard'}
    onPress={() => setPage('dashboard')}
  />
  <ListItem
    label="Analytics"
    leading={<Icon name="bar-chart" />}
    selected={page === 'analytics'}
    onPress={() => setPage('analytics')}
  />
</List>
```

### With Sections
```tsx
<List variant="divided">
  <ListSection title="Main">
    <ListItem label="Dashboard" leading={<Icon name="home" />} />
    <ListItem label="Analytics" leading={<Icon name="bar-chart" />} />
  </ListSection>
  <ListSection title="Settings">
    <ListItem label="Profile" leading={<Icon name="person" />} />
    <ListItem label="Preferences" leading={<Icon name="settings" />} />
  </ListSection>
</List>
```

### Hierarchical List
```tsx
<List variant="bordered">
  <ListItem label="Parent 1" />
  <ListItem label="Child 1.1" indent={1} />
  <ListItem label="Child 1.2" indent={1} />
  <ListItem label="Grandchild 1.2.1" indent={2} />
</List>
```

### With Badges
```tsx
<List variant="bordered">
  <ListItem
    label="Notifications"
    leading={<Icon name="notifications" />}
    trailing={<Badge color="error">3</Badge>}
  />
  <ListItem
    label="Messages"
    leading={<Icon name="mail" />}
    trailing={<Badge color="primary">12</Badge>}
  />
</List>
```

## Best Practices

1. **Use for navigation** - Perfect for sidebars and navigation menus
2. **Consistent icons** - Use leading icons for better scannability
3. **Selected states** - Show current page/selection
4. **Meaningful trailing** - Use for counts, chevrons, or actions
5. **Sections** - Group related items with ListSection
6. **Indentation** - Show hierarchy clearly
7. **Test accessibility** - Ensure keyboard navigation works

## Accessibility

- Proper `role="list"` and `role="listitem"` attributes
- `aria-selected` for selected items
- `aria-disabled` for disabled items
- Keyboard navigation support
- Focus management
- Touch targets meet minimum size (44px)
