# Component Library Roadmap

## Current Components (36 total)
- ✅ Accordion
- ✅ ActivityIndicator
- ✅ Alert
- ✅ Avatar
- ✅ Badge
- ✅ Button
- ✅ Card
- ✅ Checkbox
- ✅ Dialog
- ✅ Divider
- ✅ Icon
- ✅ Image
- ✅ Input
- ✅ List
- ✅ Menu
- ✅ Popover
- ✅ Pressable
- ✅ Progress
- ✅ RadioButton
- ✅ Screen
- ✅ Select
- ✅ Skeleton
- ✅ Slider
- ✅ SVGImage
- ✅ Switch
- ✅ TabBar
- ✅ Table
- ✅ Tabs
- ✅ Text
- ✅ TextArea
- ✅ Tooltip
- ✅ Video
- ✅ View

## Proposed New Components

### Priority 1: Essential Form Components
- [✅] **Switch/Toggle** - Binary on/off control with animation
- [✅] **RadioButton/RadioGroup** - Single selection from multiple options
- [✅] **Slider** - Range selection component with min/max values, step increments
- [✅] **TextArea** - Multi-line text input with auto-resize, character count

### Priority 2: Navigation Components
- [✅] **Tabs/TabBar** - Tab-based navigation (compound & array patterns)
- [✅] **Menu** - Dropdown menus with icons, separators, disabled items

- [✅] **Accordion** - Expandable content sections
  - Single/multiple expansion modes
  - Animated transitions
  - Three variants (default, separated, bordered)
  - Intent colors
  - Disabled items
  - Rich content support
  - Default expanded items

### Priority 3: Data Display Components
- [✅] **Table** - Simple data table component (3 variants, custom cell rendering)
- [✅] **List/ListItem/ListSection** - Structured list display for sidebars and navigation
- [✅] **Tooltip** - Contextual information display with multiple positions
- [✅] **Progress** - Linear/circular progress indicators

### Priority 4: Feedback Components
- [✅] **Alert** - Inline alert messages
  - Intent variants (success/error/warning/info/neutral)
  - Style variants (filled/outlined/soft)
  - Dismissible
  - Icon support (default icons + custom)
  - Actions
  - Rich content support

- [✅] **Skeleton** - Loading placeholder
  - Shape variants (rectangle/rounded/circle)
  - Animation (pulse/wave/none)
  - Custom dimensions
  - Group composition with spacing
  - Cross-platform animations (CSS on web, Animated API on native)

### Priority 5: Media Components
- [✅] **Image** - Enhanced image with lazy loading, placeholder, error state, aspect ratio
- [✅] **Video** - Video player with controls, poster, react-native-video on native

### Priority 6: Utility Components
- [ ] **Portal** - Render content outside parent
  - Modal management
  - Z-index handling
  - Event bubbling

- [ ] **Chip** - Compact element with action
  - Deletable
  - Selectable
  - Icon support
  - Size variants

- [ ] **Breadcrumb** - Navigation trail
  - Separator customization
  - Truncation
  - Icon support
  - Click handlers

## Implementation Guidelines

### For Each Component:
1. Create web (.web.tsx) and native (.native.tsx) implementations
2. Use Unistyles for consistent theming (.styles.tsx)
3. Define TypeScript types (types.ts)
4. Export from index files
5. Create comprehensive examples
6. Write README documentation
7. Ensure accessibility compliance
8. Add unit tests
9. Support intent-based colors
10. Maintain cross-platform parity where possible

### Design Principles:
- **Consistency**: Match existing component patterns
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Performance**: Optimize for both web and native
- **Flexibility**: Allow customization without complexity
- **Documentation**: Comprehensive examples and API docs

### Testing Requirements:
- Unit tests for logic
- Snapshot tests for rendering
- Accessibility tests (web)
- Cross-platform verification
- Example validation

## Notes

- Some components may already exist in specialized packages (datagrid, datepicker)
- Consider integrating with or wrapping existing packages where appropriate
- Priority order based on common app requirements and missing functionality
- Each component should follow the established pattern in the library