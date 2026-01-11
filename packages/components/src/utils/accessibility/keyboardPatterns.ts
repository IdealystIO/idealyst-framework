/**
 * WCAG 2.1 keyboard patterns for common widgets.
 * These constants define the standard key bindings for accessible interactions.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/
 */

/**
 * Keys for button activation.
 * WCAG requirement: Buttons must be activatable with Enter and Space.
 */
export const BUTTON_KEYS = {
  /** Keys that activate the button */
  activate: ['Enter', ' '] as const,
} as const;

/**
 * Keys for link activation.
 * Links only use Enter (Space typically scrolls the page).
 */
export const LINK_KEYS = {
  /** Keys that activate the link */
  activate: ['Enter'] as const,
} as const;

/**
 * Keys for menu navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 */
export const MENU_KEYS = {
  /** Keys that open the menu */
  open: ['Enter', ' ', 'ArrowDown', 'ArrowUp'] as const,
  /** Keys that close the menu */
  close: ['Escape', 'Tab'] as const,
  /** Keys for navigating between items */
  navigateVertical: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for navigating horizontal menus/menubars */
  navigateHorizontal: ['ArrowLeft', 'ArrowRight'] as const,
  /** Keys for moving to next item (down or right) */
  next: ['ArrowDown', 'ArrowRight'] as const,
  /** Keys for moving to previous item (up or left) */
  prev: ['ArrowUp', 'ArrowLeft'] as const,
  /** Keys for selecting an item */
  select: ['Enter', ' '] as const,
  /** Keys for jumping to first item */
  first: ['Home'] as const,
  /** Keys for jumping to last item */
  last: ['End'] as const,
} as const;

/**
 * Keys for accordion navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export const ACCORDION_KEYS = {
  /** Keys that toggle the accordion panel */
  toggle: ['Enter', ' '] as const,
  /** Keys for navigating between headers */
  navigate: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for jumping to first header */
  first: ['Home'] as const,
  /** Keys for jumping to last header */
  last: ['End'] as const,
} as const;

/**
 * Keys for tab navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
export const TAB_KEYS = {
  /** Keys that select a tab (when autoActivate is true, navigation also selects) */
  select: ['Enter', ' '] as const,
  /** Keys for navigating between tabs */
  navigate: ['ArrowLeft', 'ArrowRight'] as const,
  /** Keys for vertical tab lists */
  navigateVertical: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for jumping to first tab */
  first: ['Home'] as const,
  /** Keys for jumping to last tab */
  last: ['End'] as const,
} as const;

/**
 * Keys for slider/range control.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export const SLIDER_KEYS = {
  /** Keys that increase the value by step */
  increase: ['ArrowRight', 'ArrowUp'] as const,
  /** Keys that decrease the value by step */
  decrease: ['ArrowLeft', 'ArrowDown'] as const,
  /** Keys that increase the value by large step (typically 10x) */
  increaseLarge: ['PageUp'] as const,
  /** Keys that decrease the value by large step (typically 10x) */
  decreaseLarge: ['PageDown'] as const,
  /** Keys that set value to maximum */
  max: ['End'] as const,
  /** Keys that set value to minimum */
  min: ['Home'] as const,
} as const;

/**
 * Keys for listbox/select navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export const LISTBOX_KEYS = {
  /** Keys for navigating between options */
  navigate: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for selecting an option */
  select: ['Enter', ' '] as const,
  /** Keys that close the listbox (if popup) */
  close: ['Escape'] as const,
  /** Keys for jumping to first option */
  first: ['Home'] as const,
  /** Keys for jumping to last option */
  last: ['End'] as const,
  /** Keys that select all (multi-select only) */
  selectAll: ['Control+a', 'Meta+a'] as const,
} as const;

/**
 * Keys for dialog/modal.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
export const DIALOG_KEYS = {
  /** Keys that close the dialog */
  close: ['Escape'] as const,
} as const;

/**
 * Keys for checkbox control.
 */
export const CHECKBOX_KEYS = {
  /** Keys that toggle the checkbox */
  toggle: [' '] as const,
} as const;

/**
 * Keys for radio group navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */
export const RADIO_KEYS = {
  /** Keys for navigating and selecting in radio groups */
  navigate: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const,
} as const;

/**
 * Keys for switch/toggle control.
 */
export const SWITCH_KEYS = {
  /** Keys that toggle the switch */
  toggle: ['Enter', ' '] as const,
} as const;

/**
 * Keys for tree view navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
export const TREE_KEYS = {
  /** Keys for navigating between items */
  navigate: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for expanding a collapsed node */
  expand: ['ArrowRight'] as const,
  /** Keys for collapsing an expanded node */
  collapse: ['ArrowLeft'] as const,
  /** Keys for activating/selecting an item */
  select: ['Enter', ' '] as const,
  /** Keys for jumping to first item */
  first: ['Home'] as const,
  /** Keys for jumping to last visible item */
  last: ['End'] as const,
  /** Expand all siblings (Shift + *) */
  expandAll: ['*'] as const,
} as const;

/**
 * Keys for grid/table navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
export const GRID_KEYS = {
  /** Keys for moving between cells */
  navigateCell: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const,
  /** Keys for jumping to first cell in row */
  rowStart: ['Home'] as const,
  /** Keys for jumping to last cell in row */
  rowEnd: ['End'] as const,
  /** Keys for jumping to first cell in grid */
  gridStart: ['Control+Home', 'Meta+Home'] as const,
  /** Keys for jumping to last cell in grid */
  gridEnd: ['Control+End', 'Meta+End'] as const,
  /** Keys for page up/down in grid */
  page: ['PageUp', 'PageDown'] as const,
} as const;

/**
 * Keys for combobox navigation.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export const COMBOBOX_KEYS = {
  /** Keys that open the dropdown */
  open: ['ArrowDown', 'ArrowUp', 'Alt+ArrowDown'] as const,
  /** Keys that close the dropdown */
  close: ['Escape', 'Alt+ArrowUp'] as const,
  /** Keys for navigating options */
  navigate: ['ArrowUp', 'ArrowDown'] as const,
  /** Keys for selecting an option */
  select: ['Enter'] as const,
  /** Keys for autocomplete */
  first: ['Home'] as const,
  last: ['End'] as const,
} as const;

/**
 * Keys for tooltip display.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
export const TOOLTIP_KEYS = {
  /** Keys that dismiss the tooltip */
  dismiss: ['Escape'] as const,
} as const;

/**
 * Key code helper - checks if a keyboard event matches any of the specified keys.
 * @param event - The keyboard event
 * @param keys - Array of key names to check
 * @returns true if the event key matches any of the specified keys
 */
export function matchesKey(event: { key: string }, keys: readonly string[]): boolean {
  return keys.includes(event.key);
}

/**
 * Key code helper with modifier support.
 * @param event - The keyboard event
 * @param keyPattern - Key pattern like 'Control+a' or 'Enter'
 * @returns true if the event matches the pattern
 */
export function matchesKeyPattern(
  event: { key: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean },
  keyPattern: string
): boolean {
  const parts = keyPattern.split('+');
  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);

  // Check the key
  if (event.key !== key && event.key.toLowerCase() !== key.toLowerCase()) {
    return false;
  }

  // Check modifiers
  const requiresControl = modifiers.includes('Control');
  const requiresMeta = modifiers.includes('Meta');
  const requiresShift = modifiers.includes('Shift');
  const requiresAlt = modifiers.includes('Alt');

  if (requiresControl && !event.ctrlKey) return false;
  if (requiresMeta && !event.metaKey) return false;
  if (requiresShift && !event.shiftKey) return false;
  if (requiresAlt && !event.altKey) return false;

  // Ensure no extra modifiers are pressed (unless we're checking for ControlOrMeta)
  if (!requiresControl && !requiresMeta && (event.ctrlKey || event.metaKey)) return false;
  if (!requiresShift && event.shiftKey) return false;
  if (!requiresAlt && event.altKey) return false;

  return true;
}
