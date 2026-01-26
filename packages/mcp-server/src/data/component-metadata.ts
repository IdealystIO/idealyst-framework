/**
 * Component Metadata
 *
 * Minimal metadata for components that cannot be derived from TypeScript types
 * or example files. Types come from @idealyst/tooling, examples come from
 * the examples/components/*.examples.tsx files.
 */

export interface ComponentMetadata {
  /** Category for filtering/search */
  category: 'form' | 'feedback' | 'layout' | 'display' | 'navigation' | 'overlay' | 'data';
  /** Brief description of the component */
  description: string;
  /** Key features of the component */
  features: string[];
  /** Best practices for using the component */
  bestPractices: string[];
}

export const componentMetadata: Record<string, ComponentMetadata> = {
  Accordion: {
    category: 'display',
    description: 'Expandable content sections that show/hide content on user interaction',
    features: [
      'Single or multiple expanded sections',
      'Customizable icons',
      'Disabled state support',
      'Controlled and uncontrolled modes',
    ],
    bestPractices: [
      'Use for organizing related content into collapsible sections',
      'Keep section titles concise and descriptive',
      'Consider single-expand mode for sequential content',
    ],
  },

  ActivityIndicator: {
    category: 'feedback',
    description: 'Loading spinner to indicate ongoing operations',
    features: [
      'Multiple sizes',
      'Intent colors',
      'Cross-platform',
    ],
    bestPractices: [
      'Use for short loading operations',
      'For longer operations, consider Progress with determinate value',
      'Place near the content being loaded',
    ],
  },

  Alert: {
    category: 'feedback',
    description: 'Message banner for displaying important information, warnings, errors, and success messages',
    features: [
      'Five intent types with semantic meaning',
      'Three visual variants (filled, outlined, soft)',
      'Default icons for each intent',
      'Custom icon support',
      'Dismissible with close button',
      'Action buttons support',
    ],
    bestPractices: [
      "Use 'danger' intent for critical errors requiring immediate attention",
      "Use 'warning' intent for important but non-critical information",
      "Use 'success' intent for positive confirmations",
      "Use 'info' intent for general informational messages",
      'Keep alert messages concise and actionable',
    ],
  },

  Avatar: {
    category: 'display',
    description: 'User or entity representation with image, initials, or icon fallback',
    features: [
      'Image, initials, or icon display',
      'Multiple sizes (xs, sm, md, lg, xl)',
      'Circle or square shapes',
      'Automatic fallback to initials',
      'Custom background colors',
    ],
    bestPractices: [
      'Provide fallback initials for missing images',
      'Use consistent sizes within lists',
      'Consider accessibility with alt text',
    ],
  },

  Badge: {
    category: 'display',
    description: 'Small status indicator or count display',
    features: [
      'Multiple sizes',
      'Intent and custom colors',
      'Filled, outlined, and soft variants',
      'Icon support',
    ],
    bestPractices: [
      'Use for status indicators or counts',
      'Keep badge content minimal (numbers or short text)',
      'Use semantic intent colors for meaning',
    ],
  },

  Breadcrumb: {
    category: 'navigation',
    description: 'Navigation trail showing the current page location within a hierarchy',
    features: [
      'Customizable separators',
      'Link and text items',
      'Responsive truncation',
    ],
    bestPractices: [
      'Use for deep navigation hierarchies',
      'Keep breadcrumb labels short',
      'Make all items except the last clickable',
    ],
  },

  Button: {
    category: 'form',
    description: 'Interactive button component with multiple variants, sizes, and icon support',
    features: [
      'Three type variants: contained, outlined, text',
      'Five intent colors: primary, neutral, success, danger, warning',
      'Five sizes: xs, sm, md, lg, xl',
      'Loading state with spinner',
      'Gradient overlay effects',
      'Left and right icon support',
      'Disabled states',
      'Cross-platform',
    ],
    bestPractices: [
      "Use 'primary' intent for main actions",
      "Use 'contained' type for prominent actions",
      'Keep button labels concise and action-oriented',
      'Use loading state for async operations',
    ],
  },

  Card: {
    category: 'layout',
    description: 'Container component for grouping related content with optional elevation and borders',
    features: [
      'Multiple type variants (outlined, elevated, filled)',
      'Pressable when onPress is provided',
      'Customizable border radius',
      'Intent colors',
    ],
    bestPractices: [
      'Use for grouping related content',
      'Keep card content focused on a single topic',
      "Use 'elevated' type sparingly for emphasis",
      'Simply add onPress to make a card interactive',
    ],
  },

  Checkbox: {
    category: 'form',
    description: 'Toggle control for binary choices with optional label',
    features: [
      'Checked, unchecked, and indeterminate states',
      'Multiple sizes',
      'Intent colors',
      'Label support',
      'Error state with helper text',
      'Custom children support',
    ],
    bestPractices: [
      'Use for independent binary choices',
      'Use RadioButton for mutually exclusive options',
      'Provide clear, descriptive labels',
    ],
  },

  Chip: {
    category: 'display',
    description: 'Compact element for tags, filters, or selections',
    features: [
      'Filled, outlined, and soft variants',
      'Intent colors',
      'Multiple sizes',
      'Deletable with close icon',
      'Selectable mode',
      'Icon support',
    ],
    bestPractices: [
      'Use for tags, filters, or compact selections',
      'Keep chip labels concise',
      'Use consistent styling within groups',
    ],
  },

  Dialog: {
    category: 'overlay',
    description: 'Modal overlay for important content requiring user attention or interaction',
    features: [
      'Multiple sizes (sm, md, lg, fullscreen)',
      'Standard, alert, and confirmation types',
      'Title and close button',
      'Backdrop click to close',
      'Animation types (slide, fade)',
    ],
    bestPractices: [
      'Use sparingly for important interactions',
      'Provide clear actions for dismissal',
      'Keep dialog content focused',
      'Use confirmation dialogs for destructive actions',
    ],
  },

  Divider: {
    category: 'layout',
    description: 'Visual separator for content sections',
    features: [
      'Horizontal and vertical orientations',
      'Solid, dashed, and dotted types',
      'Multiple sizes (thickness)',
      'Intent colors',
      'Text/content dividers',
      'Configurable spacing',
    ],
    bestPractices: [
      'Use to separate distinct content sections',
      'Avoid overuse - whitespace is often sufficient',
      'Use text dividers for labeled sections',
    ],
  },

  Icon: {
    category: 'display',
    description: 'Material Design icon component with extensive icon library',
    features: [
      '7,447+ Material Design icons',
      'Multiple sizes',
      'Intent and custom colors',
      'Accessibility support',
    ],
    bestPractices: [
      'Use meaningful icons that match their purpose',
      'Pair icons with text for clarity when needed',
      'Maintain consistent icon sizing',
    ],
  },

  Image: {
    category: 'display',
    description: 'Cross-platform image component with loading and error states',
    features: [
      'Multiple resize modes',
      'Loading placeholder',
      'Error fallback',
      'Lazy loading',
      'Border radius support',
    ],
    bestPractices: [
      'Provide appropriate alt text',
      'Use correct resize mode for layout',
      'Consider placeholder for slow-loading images',
    ],
  },

  Link: {
    category: 'navigation',
    description: 'Navigation link component for routing and external URLs',
    features: [
      'Internal and external link support',
      'Intent colors',
      'Underline variants',
      'Disabled state',
    ],
    bestPractices: [
      'Use for navigation, not actions (use Button for actions)',
      'Make link text descriptive',
      'Indicate external links when appropriate',
    ],
  },

  List: {
    category: 'data',
    description: 'Optimized list component for displaying scrollable data',
    features: [
      'Virtualized rendering for performance',
      'Pull-to-refresh',
      'Infinite scroll',
      'Section headers',
      'Empty state support',
    ],
    bestPractices: [
      'Use for displaying collections of similar items',
      'Implement pull-to-refresh for refreshable content',
      'Provide empty state feedback',
    ],
  },

  Menu: {
    category: 'overlay',
    description: 'Dropdown menu for displaying a list of actions or options',
    features: [
      'Trigger-based display',
      'Multiple placements',
      'Icon and description support',
      'Dividers between groups',
      'Keyboard navigation',
    ],
    bestPractices: [
      'Group related actions together',
      'Use icons for quick recognition',
      'Keep menu items to a reasonable number',
    ],
  },

  Popover: {
    category: 'overlay',
    description: 'Floating content container anchored to a trigger element',
    features: [
      'Multiple placements',
      'Customizable content',
      'Controlled and uncontrolled modes',
      'Click outside to close',
    ],
    bestPractices: [
      'Use for supplementary content or controls',
      'Keep popover content focused',
      'Consider mobile touch interactions',
    ],
  },

  Pressable: {
    category: 'form',
    description: 'Low-level touchable component for custom interactive elements',
    features: [
      'Press feedback',
      'Long press support',
      'Disabled state',
      'Custom hit slop',
    ],
    bestPractices: [
      'Use Button for standard button interactions',
      'Use Pressable for custom interactive areas',
      'Provide visual feedback on press',
    ],
  },

  Progress: {
    category: 'feedback',
    description: 'Visual indicator for task completion or loading progress',
    features: [
      'Linear and circular variants',
      'Determinate and indeterminate modes',
      'Multiple sizes',
      'Intent colors',
      'Label support',
      'Rounded option',
    ],
    bestPractices: [
      'Use determinate progress when percentage is known',
      'Use indeterminate for unknown duration',
      'Show percentage for long operations',
    ],
  },

  RadioButton: {
    category: 'form',
    description: 'Selection control for mutually exclusive options',
    features: [
      'Single selection in a group',
      'Multiple sizes',
      'Intent colors',
      'Label support',
      'Disabled state',
    ],
    bestPractices: [
      'Use for mutually exclusive options',
      'Group related options together',
      'Provide a default selection when appropriate',
    ],
  },

  Screen: {
    category: 'layout',
    description: 'Full-screen container component for app screens',
    features: [
      'Safe area handling',
      'Keyboard avoiding behavior',
      'Status bar configuration',
      'Background color support',
    ],
    bestPractices: [
      'Use as the root container for screens',
      'Enable keyboard avoiding for form screens',
      'Configure safe areas appropriately',
    ],
  },

  Select: {
    category: 'form',
    description: 'Dropdown selection component for choosing from a list of options',
    features: [
      'Outlined and filled variants',
      'Multiple sizes',
      'Searchable (web)',
      'Label and helper text',
      'Error state',
      'Disabled options',
    ],
    bestPractices: [
      'Use for selecting from many options',
      'Use RadioButton for 2-5 visible options',
      'Provide a clear placeholder',
    ],
  },

  Skeleton: {
    category: 'feedback',
    description: 'Placeholder loading state for content',
    features: [
      'Multiple shapes (text, circle, rectangle)',
      'Customizable dimensions',
      'Animation support',
    ],
    bestPractices: [
      'Match skeleton shape to actual content',
      'Use for predictable content layouts',
      'Avoid for dynamic or unknown layouts',
    ],
  },

  Slider: {
    category: 'form',
    description: 'Range input control for selecting numeric values',
    features: [
      'Min/max/step configuration',
      'Value display',
      'Min/max labels',
      'Custom marks',
      'Intent colors',
      'Multiple sizes',
    ],
    bestPractices: [
      'Use for selecting from a continuous range',
      'Show current value for precision',
      'Use marks for discrete steps',
    ],
  },

  SVGImage: {
    category: 'display',
    description: 'SVG image component for vector graphics',
    features: [
      'URL and inline SVG support',
      'Color tinting',
      'Responsive sizing',
    ],
    bestPractices: [
      'Use for scalable graphics',
      'Provide fallback for missing SVGs',
      'Consider Icon for simple icons',
    ],
  },

  Switch: {
    category: 'form',
    description: 'Toggle control for binary on/off states',
    features: [
      'On/off states',
      'Multiple sizes',
      'Intent colors',
      'Label support',
      'Custom on/off icons',
    ],
    bestPractices: [
      'Use for immediate effect toggles',
      'Use Checkbox when submission is required',
      'Provide clear labels indicating the on state',
    ],
  },

  TabBar: {
    category: 'navigation',
    description: 'Bottom navigation bar for main app sections',
    features: [
      'Icon and label tabs',
      'Badge indicators',
      'Custom styling',
    ],
    bestPractices: [
      'Limit to 3-5 main destinations',
      'Use clear, recognizable icons',
      'Show badges for notifications',
    ],
  },

  Table: {
    category: 'data',
    description: 'Structured data display in rows and columns',
    features: [
      'Sortable columns',
      'Custom cell rendering',
      'Header and footer',
      'Striped rows',
    ],
    bestPractices: [
      'Use for structured, comparable data',
      'Align numbers to the right',
      'Provide sorting for large datasets',
    ],
  },

  Tabs: {
    category: 'navigation',
    description: 'Horizontal tab navigation for switching between content panels',
    features: [
      'Controlled and uncontrolled modes',
      'Icon and label tabs',
      'Scrollable for many tabs',
      'Badge support',
    ],
    bestPractices: [
      'Use for content at the same hierarchy level',
      'Keep tab labels short',
      'Limit visible tabs to avoid scrolling',
    ],
  },

  Text: {
    category: 'display',
    description: 'Typography component for displaying text with consistent styling',
    features: [
      'Multiple typography variants',
      'Font weight options',
      'Color variants',
      'Text alignment',
    ],
    bestPractices: [
      'Use typography variants consistently',
      'Maintain hierarchy with size and weight',
      'Use semantic colors for meaning',
    ],
  },

  TextArea: {
    category: 'form',
    description: 'Multi-line text input for longer content',
    features: [
      'Outlined and filled variants',
      'Multiple sizes',
      'Character count',
      'Auto-resize',
      'Error state',
    ],
    bestPractices: [
      'Use for multi-line input',
      'Show character limits when applicable',
      'Provide appropriate placeholder text',
    ],
  },

  TextInput: {
    category: 'form',
    description: 'Single-line text input field with various configurations',
    features: [
      'Outlined and filled variants',
      'Multiple sizes',
      'Left and right icons',
      'Password visibility toggle',
      'Input modes (text, email, number, etc.)',
      'Error state with helper text',
    ],
    bestPractices: [
      'Use appropriate input mode for content type',
      'Provide clear labels and placeholders',
      'Show validation errors inline',
    ],
  },

  Tooltip: {
    category: 'overlay',
    description: 'Contextual information popup on hover or focus',
    features: [
      'Multiple placements',
      'Customizable delay',
      'Arrow indicator',
      'Custom content support',
    ],
    bestPractices: [
      'Use for supplementary information',
      'Keep tooltip content brief',
      'Ensure touch-friendly alternatives for mobile',
    ],
  },

  Video: {
    category: 'display',
    description: 'Video player component with playback controls',
    features: [
      'Multiple source support',
      'Playback controls',
      'Poster image',
      'Loop and autoplay',
    ],
    bestPractices: [
      'Provide poster images for preview',
      'Consider autoplay carefully (user experience)',
      'Support multiple formats for compatibility',
    ],
  },

  View: {
    category: 'layout',
    description: 'Fundamental layout container with spacing and flex support',
    features: [
      'Spacing presets',
      'Flex layout shortcuts',
      'Cross-platform',
    ],
    bestPractices: [
      'Use spacing prop for consistent gaps',
      'Prefer View over native div/View for consistency',
      'Use for layout structure, not styling',
    ],
  },
};

/**
 * Find the canonical component name (case-insensitive lookup)
 */
export function findComponentName(componentName: string): string | undefined {
  // Direct match first (fast path)
  if (componentMetadata[componentName]) {
    return componentName;
  }

  // Case-insensitive lookup
  const lowerName = componentName.toLowerCase();
  return Object.keys(componentMetadata).find(
    (name) => name.toLowerCase() === lowerName
  );
}

/**
 * Get metadata for a specific component (case-insensitive)
 */
export function getComponentMetadata(componentName: string): ComponentMetadata | undefined {
  const canonicalName = findComponentName(componentName);
  return canonicalName ? componentMetadata[canonicalName] : undefined;
}

/**
 * Get all component names
 */
export function getComponentNames(): string[] {
  return Object.keys(componentMetadata);
}

/**
 * Search components by name, description, or features
 */
export function searchComponents(query: string, category?: string): string[] {
  const lowerQuery = query.toLowerCase();

  return Object.entries(componentMetadata)
    .filter(([name, meta]) => {
      if (category && meta.category !== category) {
        return false;
      }

      return (
        name.toLowerCase().includes(lowerQuery) ||
        meta.description.toLowerCase().includes(lowerQuery) ||
        meta.features.some(f => f.toLowerCase().includes(lowerQuery))
      );
    })
    .map(([name]) => name);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): string[] {
  return Object.entries(componentMetadata)
    .filter(([_, meta]) => meta.category === category)
    .map(([name]) => name);
}
