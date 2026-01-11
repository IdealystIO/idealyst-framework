import type { AccessibilityRole as RNAccessibilityRole } from 'react-native';

/**
 * ARIA roles supported for cross-platform accessibility.
 * Maps to native roles where possible via ariaHelpers.
 */
export type AriaRole =
  // Interactive roles
  | 'button'
  | 'link'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'progressbar'
  | 'spinbutton'
  // Form roles
  | 'textbox'
  | 'searchbox'
  | 'combobox'
  | 'listbox'
  | 'option'
  // Menu roles
  | 'menu'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  // Tab roles
  | 'tab'
  | 'tablist'
  | 'tabpanel'
  // Dialog roles
  | 'dialog'
  | 'alertdialog'
  | 'tooltip'
  // Grid/table roles
  | 'grid'
  | 'row'
  | 'cell'
  | 'columnheader'
  | 'rowheader'
  | 'table'
  // List roles
  | 'list'
  | 'listitem'
  // Landmark roles
  | 'article'
  | 'region'
  | 'navigation'
  | 'main'
  | 'banner'
  | 'contentinfo'
  | 'complementary'
  | 'form'
  | 'search'
  // Live region roles
  | 'status'
  | 'alert'
  | 'log'
  | 'marquee'
  | 'timer'
  // Other roles
  | 'img'
  | 'figure'
  | 'separator'
  | 'none'
  | 'presentation'
  | 'heading'
  | 'group'
  // Additional composite/group roles
  | 'radiogroup'
  // React Native specific roles
  | 'adjustable';

/**
 * Base accessibility props shared across all components.
 * These props provide essential screen reader and assistive technology support.
 */
export interface AccessibilityProps {
  /** Text alternative for screen readers. Required for non-text content. */
  accessibilityLabel?: string;
  /** Additional hint text providing context (e.g., "Double tap to activate") */
  accessibilityHint?: string;
  /** Whether the element is disabled for assistive technology */
  accessibilityDisabled?: boolean;
  /** Whether the element is hidden from assistive technology */
  accessibilityHidden?: boolean;
  /** The semantic role of the element for assistive technology */
  accessibilityRole?: AriaRole;
}

/**
 * Accessibility props for interactive elements that can be activated or controlled.
 * Extends base props with relationship and state attributes.
 */
export interface InteractiveAccessibilityProps extends AccessibilityProps {
  /** ID of element that labels this element (aria-labelledby) */
  accessibilityLabelledBy?: string;
  /** ID of element that describes this element (aria-describedby) */
  accessibilityDescribedBy?: string;
  /** ID of element controlled by this element (aria-controls) */
  accessibilityControls?: string;
  /** Whether an expandable element is currently expanded */
  accessibilityExpanded?: boolean;
  /** Whether a toggle element is pressed (true, false, or 'mixed' for tri-state) */
  accessibilityPressed?: boolean | 'mixed';
  /** Whether this element owns another element (aria-owns) */
  accessibilityOwns?: string;
  /** Whether this element has a popup (aria-haspopup) */
  accessibilityHasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}

/**
 * Accessibility props for form controls.
 * Extends interactive props with validation and requirement states.
 */
export interface FormAccessibilityProps extends InteractiveAccessibilityProps {
  /** Whether the field is required */
  accessibilityRequired?: boolean;
  /** Whether the field has a validation error */
  accessibilityInvalid?: boolean;
  /** ID of element containing the error message (aria-errormessage) */
  accessibilityErrorMessage?: string;
  /** Autocomplete hint for the field */
  accessibilityAutoComplete?: 'none' | 'inline' | 'list' | 'both';
}

/**
 * Accessibility props for range controls (Slider, Progress, Spinbutton).
 * Provides value information for screen readers.
 */
export interface RangeAccessibilityProps extends AccessibilityProps {
  /** Current numeric value */
  accessibilityValueNow?: number;
  /** Minimum allowed value */
  accessibilityValueMin?: number;
  /** Maximum allowed value */
  accessibilityValueMax?: number;
  /** Human-readable value description (e.g., "50 percent", "Medium") */
  accessibilityValueText?: string;
}

/**
 * Accessibility props for selection controls (Checkbox, Radio, Switch).
 * Extends interactive props with checked state.
 */
export interface SelectionAccessibilityProps extends InteractiveAccessibilityProps {
  /** Whether the element is checked (true, false, or 'mixed' for indeterminate) */
  accessibilityChecked?: boolean | 'mixed';
}

/**
 * Accessibility props for live regions that announce dynamic content.
 * Used for alerts, status messages, and real-time updates.
 */
export interface LiveRegionAccessibilityProps extends AccessibilityProps {
  /** How updates should be announced: 'polite' waits, 'assertive' interrupts */
  accessibilityLive?: 'off' | 'polite' | 'assertive';
  /** Whether the region is currently loading/updating */
  accessibilityBusy?: boolean;
  /** Which changes should be announced */
  accessibilityRelevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text';
  /** Whether to announce the entire region or just changes */
  accessibilityAtomic?: boolean;
}

/**
 * Accessibility props for sortable columns in tables/grids.
 */
export interface SortableAccessibilityProps extends AccessibilityProps {
  /** Current sort direction */
  accessibilitySort?: 'ascending' | 'descending' | 'none' | 'other';
}

/**
 * Accessibility props for selectable items in lists/grids.
 */
export interface SelectableAccessibilityProps extends AccessibilityProps {
  /** Whether the item is currently selected */
  accessibilitySelected?: boolean;
  /** Position in the set (1-based) */
  accessibilityPosInSet?: number;
  /** Total number of items in the set */
  accessibilitySetSize?: number;
}

/**
 * Accessibility props for heading elements.
 */
export interface HeadingAccessibilityProps extends AccessibilityProps {
  /** Heading level (1-6) for aria-level */
  accessibilityLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Accessibility props for current/active navigation items.
 */
export interface CurrentAccessibilityProps extends AccessibilityProps {
  /** Indicates the current item in a set (aria-current) */
  accessibilityCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}

/**
 * React Native AccessibilityRole type re-export for convenience.
 */
export type NativeAccessibilityRole = RNAccessibilityRole;

/**
 * React Native accessibility state shape.
 */
export interface NativeAccessibilityState {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}

/**
 * React Native accessibility value shape.
 */
export interface NativeAccessibilityValue {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
}
