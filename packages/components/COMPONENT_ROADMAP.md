# Component Library Roadmap

## Current Components (17 total)
- ✅ ActivityIndicator
- ✅ Avatar
- ✅ Badge
- ✅ Button
- ✅ Card
- ✅ Checkbox
- ✅ Dialog
- ✅ Divider
- ✅ Icon
- ✅ Input
- ✅ Popover
- ✅ Pressable
- ✅ Screen
- ✅ Select
- ✅ SVGImage
- ✅ Text
- ✅ View

## Proposed New Components

### Priority 1: Essential Form Components
- [✅] **Switch/Toggle** - Binary on/off control with animation
  - Platform-specific styling (iOS/Android/Web)
  - Label support
  - Disabled state
  - Intent colors

- [✅] **RadioButton/RadioGroup** - Single selection from multiple options
  - Group management
  - Horizontal/vertical layout
  - Custom styling per option
  - Accessibility support

- [ ] **Slider** - Range selection component
  - Min/max values
  - Step increments
  - Value display
  - Marks/labels support

- [ ] **TextArea** - Multi-line text input (enhanced version)
  - Auto-resize option
  - Character count
  - Max length enforcement
  - Better than current multiline Input

### Priority 2: Navigation Components
- [ ] **Tabs/TabGroup** - Tab-based navigation (includes TabBar functionality)
  - Scrollable tabs
  - Icon support
  - Badge integration
  - Swipeable content (mobile)
  - Bottom/top positioning

- [ ] **Menu/MenuItem/MenuSection** - Dropdown and context menus
  - Nested menus support
  - Keyboard navigation
  - Icons and shortcuts
  - Dividers between sections
  - Disabled items
  - Radio/checkbox items
  - MenuSection for grouped items

- [ ] **Accordion/Collapsible** - Expandable content sections
  - Single/multiple expansion
  - Animated transitions
  - Custom headers
  - Nested support

### Priority 3: Data Display Components
- [ ] **Table** - Data table component
  - Sortable columns
  - Pagination support
  - Row selection
  - Responsive design

- [ ] **List/ListItem** - Structured list display (sidebar/navigation ready)
  - Leading/trailing elements (icons, badges, chevrons)
  - Active/selected states for navigation
  - Hover states
  - Indentation support for hierarchy
  - Collapsible sections
  - Swipe actions (mobile)
  - Separators
  - Group headers
  - Ideal for sidebars and navigation menus

- [ ] **Tooltip** - Contextual information display
  - Multiple positions
  - Hover/click triggers
  - Rich content support
  - Arrow pointing

- [✅] **Progress** - Progress indicators
  - Linear/circular variants
  - Determinate/indeterminate
  - Labels
  - Color variants
  - Rounded/straight variants (linear)

### Priority 4: Feedback Components
- [ ] **Alert** - Inline alert messages
  - Intent variants (success/error/warning/info)
  - Dismissible
  - Icon support
  - Actions

- [ ] **Skeleton** - Loading placeholder
  - Shape variants
  - Animation
  - Custom dimensions
  - Group composition

### Priority 5: Media Components
- [ ] **Image** - Enhanced image component
  - Lazy loading
  - Placeholder/skeleton
  - Error state
  - Aspect ratio control

- [ ] **Video** - Video player wrapper
  - Controls customization
  - Poster support
  - Platform-specific players
  - Fullscreen support

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