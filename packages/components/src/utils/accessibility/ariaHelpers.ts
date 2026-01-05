import type {
  AccessibilityProps,
  InteractiveAccessibilityProps,
  FormAccessibilityProps,
  RangeAccessibilityProps,
  SelectionAccessibilityProps,
  LiveRegionAccessibilityProps,
  SortableAccessibilityProps,
  SelectableAccessibilityProps,
  HeadingAccessibilityProps,
  CurrentAccessibilityProps,
  AriaRole,
  NativeAccessibilityRole,
  NativeAccessibilityState,
  NativeAccessibilityValue,
} from './types';

/**
 * Filter out undefined values from an object.
 * ARIA attributes should not be present if undefined.
 */
function filterUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

// =============================================================================
// WEB ARIA ATTRIBUTE MAPPERS
// =============================================================================

/**
 * Maps base AccessibilityProps to web ARIA attributes.
 */
export function getWebAriaProps(props: AccessibilityProps): Record<string, unknown> {
  return filterUndefined({
    'aria-label': props.accessibilityLabel,
    'aria-hidden': props.accessibilityHidden,
    'aria-disabled': props.accessibilityDisabled,
    role: props.accessibilityRole,
  });
}

/**
 * Maps InteractiveAccessibilityProps to web ARIA attributes.
 */
export function getWebInteractiveAriaProps(
  props: InteractiveAccessibilityProps
): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-labelledby': props.accessibilityLabelledBy,
    'aria-describedby': props.accessibilityDescribedBy,
    'aria-controls': props.accessibilityControls,
    'aria-expanded': props.accessibilityExpanded,
    'aria-pressed': props.accessibilityPressed,
    'aria-owns': props.accessibilityOwns,
    'aria-haspopup': props.accessibilityHasPopup,
  });
}

/**
 * Maps FormAccessibilityProps to web ARIA attributes.
 */
export function getWebFormAriaProps(props: FormAccessibilityProps): Record<string, unknown> {
  return filterUndefined({
    ...getWebInteractiveAriaProps(props),
    'aria-required': props.accessibilityRequired,
    'aria-invalid': props.accessibilityInvalid,
    'aria-errormessage': props.accessibilityErrorMessage,
    'aria-autocomplete': props.accessibilityAutoComplete,
  });
}

/**
 * Maps RangeAccessibilityProps to web ARIA attributes.
 */
export function getWebRangeAriaProps(props: RangeAccessibilityProps): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-valuenow': props.accessibilityValueNow,
    'aria-valuemin': props.accessibilityValueMin,
    'aria-valuemax': props.accessibilityValueMax,
    'aria-valuetext': props.accessibilityValueText,
  });
}

/**
 * Maps SelectionAccessibilityProps to web ARIA attributes.
 */
export function getWebSelectionAriaProps(
  props: SelectionAccessibilityProps
): Record<string, unknown> {
  return filterUndefined({
    ...getWebInteractiveAriaProps(props),
    'aria-checked': props.accessibilityChecked,
  });
}

/**
 * Maps LiveRegionAccessibilityProps to web ARIA attributes.
 */
export function getWebLiveRegionAriaProps(
  props: LiveRegionAccessibilityProps
): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-live': props.accessibilityLive,
    'aria-busy': props.accessibilityBusy,
    'aria-relevant': props.accessibilityRelevant,
    'aria-atomic': props.accessibilityAtomic,
  });
}

/**
 * Maps SortableAccessibilityProps to web ARIA attributes.
 */
export function getWebSortableAriaProps(
  props: SortableAccessibilityProps
): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-sort': props.accessibilitySort,
  });
}

/**
 * Maps SelectableAccessibilityProps to web ARIA attributes.
 */
export function getWebSelectableAriaProps(
  props: SelectableAccessibilityProps
): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-selected': props.accessibilitySelected,
    'aria-posinset': props.accessibilityPosInSet,
    'aria-setsize': props.accessibilitySetSize,
  });
}

/**
 * Maps HeadingAccessibilityProps to web ARIA attributes.
 */
export function getWebHeadingAriaProps(props: HeadingAccessibilityProps): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-level': props.accessibilityLevel,
  });
}

/**
 * Maps CurrentAccessibilityProps to web ARIA attributes.
 */
export function getWebCurrentAriaProps(props: CurrentAccessibilityProps): Record<string, unknown> {
  return filterUndefined({
    ...getWebAriaProps(props),
    'aria-current': props.accessibilityCurrent,
  });
}

// =============================================================================
// REACT NATIVE ACCESSIBILITY MAPPERS
// =============================================================================

/**
 * Maps ARIA role to React Native accessibilityRole.
 * Not all ARIA roles have direct RN equivalents.
 */
export function mapRoleToNative(role?: AriaRole): NativeAccessibilityRole | undefined {
  if (!role) return undefined;

  const roleMap: Partial<Record<AriaRole, NativeAccessibilityRole>> = {
    button: 'button',
    link: 'link',
    checkbox: 'checkbox',
    radio: 'radio',
    switch: 'switch',
    slider: 'adjustable',
    progressbar: 'progressbar',
    textbox: 'text',
    searchbox: 'search',
    combobox: 'combobox',
    menu: 'menu',
    menuitem: 'menuitem',
    tab: 'tab',
    tablist: 'tablist',
    alert: 'alert',
    img: 'image',
    list: 'list',
    timer: 'timer',
    heading: 'header',
    // Roles without direct mapping return undefined
    // dialog, tooltip, grid, table, etc. don't have RN equivalents
  };

  return roleMap[role];
}

/**
 * Maps base AccessibilityProps to React Native accessibility props.
 */
export function getNativeAccessibilityProps(props: AccessibilityProps): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityDisabled !== undefined) {
    state.disabled = props.accessibilityDisabled;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  });
}

/**
 * Maps InteractiveAccessibilityProps to React Native accessibility props.
 */
export function getNativeInteractiveAccessibilityProps(
  props: InteractiveAccessibilityProps
): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityDisabled !== undefined) {
    state.disabled = props.accessibilityDisabled;
  }
  if (props.accessibilityExpanded !== undefined) {
    state.expanded = props.accessibilityExpanded;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  });
}

/**
 * Maps FormAccessibilityProps to React Native accessibility props.
 * Note: aria-describedby, aria-invalid, aria-errormessage don't have direct RN equivalents.
 * Error information should be included in accessibilityLabel.
 */
export function getNativeFormAccessibilityProps(
  props: FormAccessibilityProps
): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityDisabled !== undefined) {
    state.disabled = props.accessibilityDisabled;
  }
  if (props.accessibilityExpanded !== undefined) {
    state.expanded = props.accessibilityExpanded;
  }

  // Build label with error info since RN doesn't support aria-describedby
  let label = props.accessibilityLabel;
  if (props.accessibilityRequired && label) {
    label = `${label}, required`;
  }
  if (props.accessibilityInvalid && label) {
    label = `${label}, invalid`;
  }

  return filterUndefined({
    accessibilityLabel: label,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  });
}

/**
 * Maps RangeAccessibilityProps to React Native accessibility props.
 */
export function getNativeRangeAccessibilityProps(
  props: RangeAccessibilityProps
): Record<string, unknown> {
  const value: NativeAccessibilityValue = {};

  if (props.accessibilityValueNow !== undefined) {
    value.now = props.accessibilityValueNow;
  }
  if (props.accessibilityValueMin !== undefined) {
    value.min = props.accessibilityValueMin;
  }
  if (props.accessibilityValueMax !== undefined) {
    value.max = props.accessibilityValueMax;
  }
  if (props.accessibilityValueText !== undefined) {
    value.text = props.accessibilityValueText;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityValue: Object.keys(value).length > 0 ? value : undefined,
  });
}

/**
 * Maps SelectionAccessibilityProps to React Native accessibility props.
 */
export function getNativeSelectionAccessibilityProps(
  props: SelectionAccessibilityProps
): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityDisabled !== undefined) {
    state.disabled = props.accessibilityDisabled;
  }
  if (props.accessibilityExpanded !== undefined) {
    state.expanded = props.accessibilityExpanded;
  }
  if (props.accessibilityChecked !== undefined) {
    state.checked = props.accessibilityChecked;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  });
}

/**
 * Maps LiveRegionAccessibilityProps to React Native accessibility props.
 */
export function getNativeLiveRegionAccessibilityProps(
  props: LiveRegionAccessibilityProps
): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityBusy !== undefined) {
    state.busy = props.accessibilityBusy;
  }

  // Map aria-live to accessibilityLiveRegion
  let liveRegion: 'none' | 'polite' | 'assertive' | undefined;
  if (props.accessibilityLive === 'off') {
    liveRegion = 'none';
  } else if (props.accessibilityLive) {
    liveRegion = props.accessibilityLive;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
    accessibilityLiveRegion: liveRegion,
  });
}

/**
 * Maps SelectableAccessibilityProps to React Native accessibility props.
 */
export function getNativeSelectableAccessibilityProps(
  props: SelectableAccessibilityProps
): Record<string, unknown> {
  const state: NativeAccessibilityState = {};

  if (props.accessibilityDisabled !== undefined) {
    state.disabled = props.accessibilityDisabled;
  }
  if (props.accessibilitySelected !== undefined) {
    state.selected = props.accessibilitySelected;
  }

  return filterUndefined({
    accessibilityLabel: props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint,
    accessibilityRole: mapRoleToNative(props.accessibilityRole),
    accessibilityElementsHidden: props.accessibilityHidden,
    importantForAccessibility: props.accessibilityHidden ? 'no-hide-descendants' : undefined,
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  });
}
