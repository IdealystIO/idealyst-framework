import { Theme } from '@idealyst/theme';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Generic styles type that covers most style properties.
 * This is intentionally broad to allow flexibility in extensions.
 */
export type Styles = ViewStyle & TextStyle & Partial<ImageStyle> & Record<string, any>;

/**
 * A style extension can be either:
 * - A partial style object
 * - A function that receives the theme and returns partial styles
 */
export type StyleExtension<T> = Partial<T> | ((theme: Theme) => Partial<T>);

// ============================================================================
// Component Styleable Elements
// Each type defines the valid styleable elements for a component.
// These are derived from the XxxStylesheet types in @idealyst/theme/components
// ============================================================================

/**
 * Button styleable elements.
 * @see ButtonStylesheet in @idealyst/theme/components/button
 */
export type ButtonStyleableElements = {
    button: Styles;
    text: Styles;
    icon: Styles;
    iconContainer: Styles;
};

/**
 * Card styleable elements.
 * @see CardStylesheet in @idealyst/theme/components/card
 */
export type CardStyleableElements = {
    card: Styles;
};

/**
 * Input styleable elements.
 * @see InputStylesheet in @idealyst/theme/components/input
 */
export type InputStyleableElements = {
    container: Styles;
    leftIconContainer: Styles;
    rightIconContainer: Styles;
    leftIcon: Styles;
    rightIcon: Styles;
    passwordToggle: Styles;
    passwordToggleIcon: Styles;
    input: Styles;
};

/**
 * Chip styleable elements.
 * @see ChipStylesheet in @idealyst/theme/components/chip
 */
export type ChipStyleableElements = {
    container: Styles;
    label: Styles;
    icon: Styles;
    deleteButton: Styles;
    deleteIcon: Styles;
};

/**
 * Alert styleable elements.
 * @see AlertStylesheet in @idealyst/theme/components/alert
 */
export type AlertStyleableElements = {
    container: Styles;
    iconContainer: Styles;
    content: Styles;
    title: Styles;
    message: Styles;
    actions: Styles;
    closeButton: Styles;
    closeIcon: Styles;
};

/**
 * Switch styleable elements.
 * @see SwitchStylesheet in @idealyst/theme/components/switch
 */
export type SwitchStyleableElements = {
    container: Styles;
    switchContainer: Styles;
    switchTrack: Styles;
    switchThumb: Styles;
    thumbIcon: Styles;
    label: Styles;
};

/**
 * Select styleable elements.
 * @see SelectStylesheet in @idealyst/theme/components/select
 */
export type SelectStyleableElements = {
    container: Styles;
    label: Styles;
    trigger: Styles;
    triggerContent: Styles;
    triggerText: Styles;
    placeholder: Styles;
    icon: Styles;
    chevron: Styles;
    chevronOpen: Styles;
    dropdown: Styles;
    searchContainer: Styles;
    searchInput: Styles;
    optionsList: Styles;
    option: Styles;
    optionContent: Styles;
    optionIcon: Styles;
    optionText: Styles;
    optionTextDisabled: Styles;
    helperText: Styles;
    overlay: Styles;
};

/**
 * Badge styleable elements.
 * @see BadgeStylesheet in @idealyst/theme/components/badge
 */
export type BadgeStyleableElements = {
    container: Styles;
    text: Styles;
};

/**
 * Avatar styleable elements.
 * @see AvatarStylesheet in @idealyst/theme/components/avatar
 */
export type AvatarStyleableElements = {
    container: Styles;
    image: Styles;
    fallback: Styles;
    fallbackText: Styles;
};

/**
 * Progress styleable elements.
 * @see ProgressStylesheet in @idealyst/theme/components/progress
 */
export type ProgressStyleableElements = {
    container: Styles;
    track: Styles;
    fill: Styles;
    label: Styles;
};

/**
 * Checkbox styleable elements.
 * @see CheckboxStylesheet in @idealyst/theme/components/checkbox
 */
export type CheckboxStyleableElements = {
    container: Styles;
    checkbox: Styles;
    checkIcon: Styles;
    label: Styles;
};

/**
 * RadioButton styleable elements.
 * @see RadioButtonStylesheet in @idealyst/theme/components/radio-button
 */
export type RadioButtonStyleableElements = {
    container: Styles;
    radio: Styles;
    radioDot: Styles;
    label: Styles;
};

/**
 * Slider styleable elements.
 * @see SliderStylesheet in @idealyst/theme/components/slider
 */
export type SliderStyleableElements = {
    container: Styles;
    track: Styles;
    trackFill: Styles;
    thumb: Styles;
    thumbIcon: Styles;
    mark: Styles;
    label: Styles;
};

/**
 * TextArea styleable elements.
 * @see TextAreaStylesheet in @idealyst/theme/components/textarea
 */
export type TextAreaStyleableElements = {
    container: Styles;
    input: Styles;
    label: Styles;
    helperText: Styles;
};

/**
 * Accordion styleable elements.
 * @see AccordionStylesheet in @idealyst/theme/components/accordion
 */
export type AccordionStyleableElements = {
    container: Styles;
    item: Styles;
    header: Styles;
    headerText: Styles;
    icon: Styles;
    content: Styles;
};

/**
 * Dialog styleable elements.
 * @see DialogStylesheet in @idealyst/theme/components/dialog
 */
export type DialogStyleableElements = {
    overlay: Styles;
    container: Styles;
    header: Styles;
    title: Styles;
    closeButton: Styles;
    closeIcon: Styles;
    content: Styles;
    footer: Styles;
};

/**
 * Menu styleable elements.
 * @see MenuStylesheet in @idealyst/theme/components/menu
 */
export type MenuStyleableElements = {
    container: Styles;
    trigger: Styles;
    dropdown: Styles;
    item: Styles;
    itemIcon: Styles;
    itemText: Styles;
    divider: Styles;
};

/**
 * MenuItem styleable elements.
 * @see MenuItemStylesheet in @idealyst/theme/components/menu-item
 */
export type MenuItemStyleableElements = {
    container: Styles;
    icon: Styles;
    text: Styles;
};

/**
 * List styleable elements.
 * @see ListStylesheet in @idealyst/theme/components/list
 */
export type ListStyleableElements = {
    container: Styles;
    item: Styles;
    itemIcon: Styles;
    itemText: Styles;
    itemDescription: Styles;
    itemRight: Styles;
    section: Styles;
    sectionHeader: Styles;
    divider: Styles;
};

/**
 * TabBar styleable elements.
 * @see TabBarStylesheet in @idealyst/theme/components/tab-bar
 */
export type TabBarStyleableElements = {
    container: Styles;
    tab: Styles;
    tabIcon: Styles;
    tabText: Styles;
    indicator: Styles;
};

/**
 * Table styleable elements.
 * @see TableStylesheet in @idealyst/theme/components/table
 */
export type TableStyleableElements = {
    container: Styles;
    header: Styles;
    headerCell: Styles;
    headerText: Styles;
    row: Styles;
    cell: Styles;
    cellText: Styles;
};

/**
 * Tooltip styleable elements.
 * @see TooltipStylesheet in @idealyst/theme/components/tooltip
 */
export type TooltipStyleableElements = {
    container: Styles;
    content: Styles;
    text: Styles;
    arrow: Styles;
};

/**
 * Popover styleable elements.
 * @see PopoverStylesheet in @idealyst/theme/components/popover
 */
export type PopoverStyleableElements = {
    overlay: Styles;
    container: Styles;
    content: Styles;
    arrow: Styles;
};

/**
 * Breadcrumb styleable elements.
 * @see BreadcrumbStylesheet in @idealyst/theme/components/breadcrumb
 */
export type BreadcrumbStyleableElements = {
    container: Styles;
    item: Styles;
    itemText: Styles;
    separator: Styles;
};

/**
 * ActivityIndicator styleable elements.
 * @see ActivityIndicatorStylesheet in @idealyst/theme/components/activity-indicator
 */
export type ActivityIndicatorStyleableElements = {
    container: Styles;
    spinner: Styles;
};

/**
 * Skeleton styleable elements.
 * @see SkeletonStylesheet in @idealyst/theme/components/skeleton
 */
export type SkeletonStyleableElements = {
    container: Styles;
    bone: Styles;
};

/**
 * Divider styleable elements.
 * @see DividerStylesheet in @idealyst/theme/components/divider
 */
export type DividerStyleableElements = {
    divider: Styles;
};

/**
 * Text styleable elements.
 * @see TextStylesheet in @idealyst/theme/components/text
 */
export type TextStyleableElements = {
    text: Styles;
};

/**
 * View styleable elements.
 * @see ViewStylesheet in @idealyst/theme/components/view
 */
export type ViewStyleableElements = {
    view: Styles;
};

/**
 * Icon styleable elements.
 * @see IconStylesheet in @idealyst/theme/components/icon
 */
export type IconStyleableElements = {
    icon: Styles;
};

/**
 * Image styleable elements.
 * @see ImageStylesheet in @idealyst/theme/components/image
 */
export type ImageStyleableElements = {
    container: Styles;
    image: Styles;
};

/**
 * Pressable styleable elements.
 * @see PressableStylesheet in @idealyst/theme/components/pressable
 */
export type PressableStyleableElements = {
    pressable: Styles;
};

/**
 * Screen styleable elements.
 * @see ScreenStylesheet in @idealyst/theme/components/screen
 */
export type ScreenStyleableElements = {
    container: Styles;
    content: Styles;
};

// ============================================================================
// Master Component Style Elements Map
// ============================================================================

/**
 * Extension interface for custom components.
 * Users can extend this via declaration merging to add their own components.
 *
 * @example
 * ```typescript
 * // In your app's type declarations (e.g., src/types/components.d.ts)
 * declare module '@idealyst/components' {
 *   interface ComponentStyleExtensions {
 *     MyCustomButton: {
 *       container: Styles;
 *       label: Styles;
 *       icon: Styles;
 *     };
 *     MyCard: {
 *       wrapper: Styles;
 *       header: Styles;
 *       body: Styles;
 *     };
 *   }
 * }
 *
 * // Then use extendComponent with your custom component
 * extendComponent('MyCustomButton', {
 *   container: { borderRadius: 20 },
 *   label: { fontWeight: 'bold' },
 * });
 * ```
 */
export interface ComponentStyleExtensions {}

/**
 * Built-in component style elements.
 * Maps component names to their styleable elements.
 */
interface BuiltInComponentStyleElements {
    Button: ButtonStyleableElements;
    Card: CardStyleableElements;
    Input: InputStyleableElements;
    Chip: ChipStyleableElements;
    Alert: AlertStyleableElements;
    Switch: SwitchStyleableElements;
    Select: SelectStyleableElements;
    Badge: BadgeStyleableElements;
    Avatar: AvatarStyleableElements;
    Progress: ProgressStyleableElements;
    Checkbox: CheckboxStyleableElements;
    RadioButton: RadioButtonStyleableElements;
    Slider: SliderStyleableElements;
    TextArea: TextAreaStyleableElements;
    Accordion: AccordionStyleableElements;
    Dialog: DialogStyleableElements;
    Menu: MenuStyleableElements;
    MenuItem: MenuItemStyleableElements;
    List: ListStyleableElements;
    TabBar: TabBarStyleableElements;
    Table: TableStyleableElements;
    Tooltip: TooltipStyleableElements;
    Popover: PopoverStyleableElements;
    Breadcrumb: BreadcrumbStyleableElements;
    ActivityIndicator: ActivityIndicatorStyleableElements;
    Skeleton: SkeletonStyleableElements;
    Divider: DividerStyleableElements;
    Text: TextStyleableElements;
    View: ViewStyleableElements;
    Icon: IconStyleableElements;
    Image: ImageStyleableElements;
    Pressable: PressableStyleableElements;
    Screen: ScreenStyleableElements;
}

/**
 * Combined component style elements including built-in and custom components.
 * This is the source of truth for type-safe component extensions.
 */
export type ComponentStyleElements = BuiltInComponentStyleElements & ComponentStyleExtensions;

/**
 * All available component names for extensions.
 */
export type ComponentName = keyof ComponentStyleElements;
