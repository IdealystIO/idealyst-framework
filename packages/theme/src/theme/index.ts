import { RegisteredTheme } from "./extensions";

/**
 * All available border radius values.
 * Derived from your registered theme's radii.
 */
export type Radius = keyof RegisteredTheme['theme']['radii'];

/**
 * Theme type - derived from RegisteredTheme.
 */
export type Theme = RegisteredTheme['theme'];

export * from "./extensions";
export * from "./intent";
export * from "./size";
export * from "./color";
export * from "./shadow";
export * from "./breakpoint";

// Re-export structures except IntentValue and ShadowValue (those are re-exported with extensions from intent.ts and shadow.ts)
export type {
    InteractionConfig,
    ColorValue,
    Shade,
    SizeValue,
    BreakpointValue,
    Typography,
    TypographyValue,
    ButtonSizeValue,
    ChipSizeValue,
    BadgeSizeValue,
    IconSizeValue,
    InputSizeValue,
    RadioButtonSizeValue,
    SelectSizeValue,
    SliderSizeValue,
    SwitchSizeValue,
    TextAreaSizeValue,
    AvatarSizeValue,
    ProgressSizeValue,
    AccordionSizeValue,
    ActivityIndicatorSizeValue,
    BreadcrumbSizeValue,
    ListSizeValue,
    MenuSizeValue,
    TextSizeValue,
    TabBarSizeValue,
    TableSizeValue,
    TooltipSizeValue,
    ViewSizeValue,
    FontScaleConfig,
} from "./structures";
