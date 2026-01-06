/**
 * Component Style Extensions
 *
 * This module provides a type-safe way to globally customize component styles.
 *
 * @example Basic usage
 * ```typescript
 * import { extendComponent } from '@idealyst/components';
 *
 * // Add shadows and rounded corners to all buttons
 * extendComponent('Button', {
 *   button: {
 *     borderRadius: 20,
 *     shadowColor: '#000',
 *     shadowOpacity: 0.1,
 *     shadowRadius: 4,
 *   },
 * });
 * ```
 *
 * @example Theme-aware extensions
 * ```typescript
 * extendComponent('Card', (theme) => ({
 *   card: {
 *     ...theme.shadows.md,
 *     borderColor: theme.colors.border.primary,
 *   },
 * }));
 * ```
 *
 * @module
 */

// Public API
export {
    // Extension functions
    extendComponent,
    clearExtension,
    clearAllExtensions,
    hasExtension,
    getExtendedComponents,
    getExtensionCount,
    // Replacement functions
    replaceStyles,
    clearReplacement,
    clearAllReplacements,
    hasReplacement,
} from './extendComponent';

// Internal API (for component stylesheets)
export { getExtension, getReplacement } from './extendComponent';
export {
    withExtension,
    withSimpleExtension,
    normalizeStyleFn,
    normalizeSimpleStyleFn,
    applyExtensions,
} from './applyExtension';

// Types
export type {
    ComponentStyleElements,
    ComponentStyleExtensions,
    ComponentName,
    StyleExtension,
    ElementStyle,
    Styles,
    // Individual component styleable elements
    ButtonStyleableElements,
    CardStyleableElements,
    InputStyleableElements,
    ChipStyleableElements,
    AlertStyleableElements,
    SwitchStyleableElements,
    SelectStyleableElements,
    BadgeStyleableElements,
    AvatarStyleableElements,
    ProgressStyleableElements,
    CheckboxStyleableElements,
    RadioButtonStyleableElements,
    SliderStyleableElements,
    TextAreaStyleableElements,
    AccordionStyleableElements,
    DialogStyleableElements,
    MenuStyleableElements,
    MenuItemStyleableElements,
    ListStyleableElements,
    TabBarStyleableElements,
    TableStyleableElements,
    TooltipStyleableElements,
    PopoverStyleableElements,
    BreadcrumbStyleableElements,
    ActivityIndicatorStyleableElements,
    SkeletonStyleableElements,
    DividerStyleableElements,
    TextStyleableElements,
    ViewStyleableElements,
    IconStyleableElements,
    ImageStyleableElements,
    PressableStyleableElements,
    ScreenStyleableElements,
} from './types';
