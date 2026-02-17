import {
    IntentValue,
    ShadowValue,
    InteractionConfig,
    ColorValue,
    Shade,
    Typography,
    TypographyValue,
    ButtonSizeValue,
    IconButtonSizeValue,
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
    AlertSizeValue,
    BreadcrumbSizeValue,
    ListSizeValue,
    MenuSizeValue,
    TextSizeValue,
    TabBarSizeValue,
    TableSizeValue,
    TooltipSizeValue,
    ViewSizeValue,
    FontScaleConfig,
} from './theme/structures';
import { applyFontScale, type ApplyFontScaleOptions } from './fontScale';

/**
 * Mapping of component names to their size value types.
 * Used for type-safe addSize/setSize methods.
 */
export type ComponentSizeMap = {
    button: ButtonSizeValue;
    iconButton: IconButtonSizeValue;
    chip: ChipSizeValue;
    badge: BadgeSizeValue;
    icon: IconSizeValue;
    input: InputSizeValue;
    radioButton: RadioButtonSizeValue;
    select: SelectSizeValue;
    slider: SliderSizeValue;
    switch: SwitchSizeValue;
    textarea: TextAreaSizeValue;
    avatar: AvatarSizeValue;
    progress: ProgressSizeValue;
    accordion: AccordionSizeValue;
    activityIndicator: ActivityIndicatorSizeValue;
    alert: AlertSizeValue;
    breadcrumb: BreadcrumbSizeValue;
    list: ListSizeValue;
    menu: MenuSizeValue;
    text: TextSizeValue;
    tabBar: TabBarSizeValue;
    table: TableSizeValue;
    tooltip: TooltipSizeValue;
    view: ViewSizeValue;
};

/**
 * Valid component names for size methods.
 */
export type SizeableComponent = keyof ComponentSizeMap;

/**
 * Built theme structure - self-contained, no external type dependencies.
 */
export type BuiltTheme<
    TIntents extends string,
    TRadii extends string,
    TShadows extends string,
    TPallet extends string,
    TSurface extends string,
    TText extends string,
    TBorder extends string,
    TSize extends string,
    TBreakpoints extends string = never,
> = {
    intents: Record<TIntents, IntentValue>;
    radii: Record<TRadii, number>;
    shadows: Record<TShadows, ShadowValue>;
    colors: {
        pallet: Record<TPallet, Record<Shade, ColorValue>>;
        surface: Record<TSurface, ColorValue>;
        text: Record<TText, ColorValue>;
        border: Record<TBorder, ColorValue>;
    };
    sizes: {
        button: Record<TSize, ButtonSizeValue>;
        iconButton: Record<TSize, IconButtonSizeValue>;
        chip: Record<TSize, ChipSizeValue>;
        badge: Record<TSize, BadgeSizeValue>;
        icon: Record<TSize, IconSizeValue>;
        input: Record<TSize, InputSizeValue>;
        radioButton: Record<TSize, RadioButtonSizeValue>;
        select: Record<TSize, SelectSizeValue>;
        slider: Record<TSize, SliderSizeValue>;
        switch: Record<TSize, SwitchSizeValue>;
        textarea: Record<TSize, TextAreaSizeValue>;
        avatar: Record<TSize, AvatarSizeValue>;
        progress: Record<TSize, ProgressSizeValue>;
        accordion: Record<TSize, AccordionSizeValue>;
        activityIndicator: Record<TSize, ActivityIndicatorSizeValue>;
        alert: Record<TSize, AlertSizeValue>;
        breadcrumb: Record<TSize, BreadcrumbSizeValue>;
        list: Record<TSize, ListSizeValue>;
        menu: Record<TSize, MenuSizeValue>;
        text: Record<TSize, TextSizeValue>;
        tabBar: Record<TSize, TabBarSizeValue>;
        table: Record<TSize, TableSizeValue>;
        tooltip: Record<TSize, TooltipSizeValue>;
        view: Record<TSize, ViewSizeValue>;
        typography: Record<Typography, TypographyValue>;
    };
    interaction: InteractionConfig;
    breakpoints: Record<TBreakpoints, number>;
    /** Font scale configuration. Undefined means no scaling (scale = 1.0). */
    fontScaleConfig?: FontScaleConfig;
    /**
     * Unscaled base size values. Stored when fontScale != 1.0 so that
     * runtime re-scaling can be done idempotently from the originals.
     * @internal
     */
    __baseSizes?: Record<string, any>;
};

/**
 * Internal config type for building.
 */
type ThemeConfig<
    TIntents extends string,
    TRadii extends string,
    TShadows extends string,
    TPallet extends string,
    TSurface extends string,
    TText extends string,
    TBorder extends string,
    TSize extends string,
    TBreakpoints extends string,
> = BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> & {
    /** @internal Pending font scale to apply at build() time. Stored on config so it survives builder chaining. */
    __pendingFontScale?: { scale: number; options?: ApplyFontScaleOptions };
};

/**
 * Fluent builder for creating themes with full TypeScript inference.
 *
 * Build a theme, then register it to get automatic type inference for all components:
 *
 * @example
 * ```typescript
 * const myTheme = createTheme()
 *   .addIntent('primary', { primary: '#3b82f6', contrast: '#fff', light: '#bfdbfe', dark: '#1e40af' })
 *   .addIntent('brand', { primary: '#6366f1', contrast: '#fff', light: '#818cf8', dark: '#4f46e5' })
 *   .addRadius('sm', 4)
 *   .addRadius('full', 9999)
 *   .addSize('button', '2xl', { paddingVertical: 14, paddingHorizontal: 28, ... })
 *   .build();
 *
 * // Register the theme type
 * declare module '@idealyst/theme' {
 *   interface RegisteredTheme {
 *     theme: typeof myTheme;
 *   }
 * }
 *
 * // Now Intent = 'primary' | 'brand', Radius = 'sm' | 'full', etc.
 * ```
 */
export class ThemeBuilder<
    TIntents extends string = never,
    TRadii extends string = never,
    TShadows extends string = never,
    TPallet extends string = never,
    TSurface extends string = never,
    TText extends string = never,
    TBorder extends string = never,
    TSize extends string = never,
    TBreakpoints extends string = never,
> {
    private config: ThemeConfig<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>;

    constructor() {
        this.config = {
            intents: {} as any,
            radii: {} as any,
            shadows: {} as any,
            colors: {
                pallet: {} as any,
                surface: {} as any,
                text: {} as any,
                border: {} as any,
            },
            sizes: {} as any,
            interaction: {} as any,
            breakpoints: {} as any,
        };
    }

    // =========================================================================
    // Intent Methods
    // =========================================================================

    /**
     * Add a custom intent to the theme.
     */
    addIntent<K extends string>(
        name: K,
        value: IntentValue
    ): ThemeBuilder<TIntents | K, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents | K, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            intents: {
                ...this.config.intents,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing intent in the theme.
     * Use this to override an intent inherited from a base theme.
     */
    setIntent<K extends TIntents>(
        name: K,
        value: IntentValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            intents: {
                ...this.config.intents,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    // =========================================================================
    // Radius Methods
    // =========================================================================

    /**
     * Add a custom border radius value.
     */
    addRadius<K extends string>(
        name: K,
        value: number
    ): ThemeBuilder<TIntents, TRadii | K, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii | K, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            radii: {
                ...this.config.radii,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing radius value in the theme.
     * Use this to override a radius inherited from a base theme.
     */
    setRadius<K extends TRadii>(
        name: K,
        value: number
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            radii: {
                ...this.config.radii,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    // =========================================================================
    // Shadow Methods
    // =========================================================================

    /**
     * Add a custom shadow value.
     */
    addShadow<K extends string>(
        name: K,
        value: ShadowValue
    ): ThemeBuilder<TIntents, TRadii, TShadows | K, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows | K, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            shadows: {
                ...this.config.shadows,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing shadow value in the theme.
     * Use this to override a shadow inherited from a base theme.
     */
    setShadow<K extends TShadows>(
        name: K,
        value: ShadowValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            shadows: {
                ...this.config.shadows,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    // =========================================================================
    // Interaction Methods
    // =========================================================================

    /**
     * Set the interaction configuration.
     */
    setInteraction(
        interaction: InteractionConfig
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            interaction,
        };
        return newBuilder;
    }

    /**
     * Update specific interaction properties without replacing the entire config.
     * Use this to modify individual opacity values or focus styles.
     *
     * @example
     * ```typescript
     * fromTheme(lightTheme)
     *   .updateInteraction({ opacity: { disabled: 0.3 } })
     *   .build();
     * ```
     */
    updateInteraction(
        partial: {
            focusedBackground?: string;
            focusBorder?: string;
            opacity?: Partial<InteractionConfig['opacity']>;
        }
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        const currentInteraction = this.config.interaction ?? {} as InteractionConfig;
        const currentOpacity = currentInteraction.opacity ?? { hover: 0.9, active: 0.75, disabled: 0.5 };

        newBuilder.config = {
            ...this.config,
            interaction: {
                focusedBackground: partial.focusedBackground ?? currentInteraction.focusedBackground,
                focusBorder: partial.focusBorder ?? currentInteraction.focusBorder,
                opacity: {
                    ...currentOpacity,
                    ...partial.opacity,
                },
            },
        };
        return newBuilder;
    }

    // =========================================================================
    // Color Methods
    // =========================================================================

    /**
     * Set the colors configuration.
     */
    setColors<
        P extends string,
        S extends string,
        T extends string,
        B extends string,
    >(colors: {
        pallet: Record<P, Record<Shade, ColorValue>>;
        surface: Record<S, ColorValue>;
        text: Record<T, ColorValue>;
        border: Record<B, ColorValue>;
    }): ThemeBuilder<TIntents, TRadii, TShadows, P, S, T, B, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, P, S, T, B, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors,
        } as any;
        return newBuilder;
    }

    /**
     * Add a new pallet color to the theme.
     * Expands the available pallet colors.
     */
    addPalletColor<K extends string>(
        name: K,
        shades: Record<Shade, ColorValue>
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet | K, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet | K, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                pallet: {
                    ...this.config.colors.pallet,
                    [name]: shades,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing pallet color in the theme.
     * Use this to override a pallet color inherited from a base theme.
     */
    setPalletColor<K extends TPallet>(
        name: K,
        shades: Record<Shade, ColorValue>
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                pallet: {
                    ...this.config.colors.pallet,
                    [name]: shades,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Add a new surface color to the theme.
     * Expands the available surface colors.
     */
    addSurfaceColor<K extends string>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface | K, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface | K, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                surface: {
                    ...this.config.colors.surface,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing surface color in the theme.
     * Use this to override a surface color inherited from a base theme.
     */
    setSurfaceColor<K extends TSurface>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                surface: {
                    ...this.config.colors.surface,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Add a new text color to the theme.
     * Expands the available text colors.
     */
    addTextColor<K extends string>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText | K, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText | K, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                text: {
                    ...this.config.colors.text,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing text color in the theme.
     * Use this to override a text color inherited from a base theme.
     */
    setTextColor<K extends TText>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                text: {
                    ...this.config.colors.text,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Add a new border color to the theme.
     * Expands the available border colors.
     */
    addBorderColor<K extends string>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder | K, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder | K, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                border: {
                    ...this.config.colors.border,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing border color in the theme.
     * Use this to override a border color inherited from a base theme.
     */
    setBorderColor<K extends TBorder>(
        name: K,
        value: ColorValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            colors: {
                ...this.config.colors,
                border: {
                    ...this.config.colors.border,
                    [name]: value,
                } as any,
            },
        };
        return newBuilder;
    }

    // =========================================================================
    // Size Methods
    // =========================================================================

    /**
     * Set all sizes at once.
     */
    setSizes<S extends string>(sizes: {
        button: Record<S, ButtonSizeValue>;
        iconButton: Record<S, IconButtonSizeValue>;
        chip: Record<S, ChipSizeValue>;
        badge: Record<S, BadgeSizeValue>;
        icon: Record<S, IconSizeValue>;
        input: Record<S, InputSizeValue>;
        radioButton: Record<S, RadioButtonSizeValue>;
        select: Record<S, SelectSizeValue>;
        slider: Record<S, SliderSizeValue>;
        switch: Record<S, SwitchSizeValue>;
        textarea: Record<S, TextAreaSizeValue>;
        avatar: Record<S, AvatarSizeValue>;
        progress: Record<S, ProgressSizeValue>;
        accordion: Record<S, AccordionSizeValue>;
        activityIndicator: Record<S, ActivityIndicatorSizeValue>;
        alert: Record<S, AlertSizeValue>;
        breadcrumb: Record<S, BreadcrumbSizeValue>;
        list: Record<S, ListSizeValue>;
        menu: Record<S, MenuSizeValue>;
        text: Record<S, TextSizeValue>;
        tabBar: Record<S, TabBarSizeValue>;
        table: Record<S, TableSizeValue>;
        tooltip: Record<S, TooltipSizeValue>;
        view: Record<S, ViewSizeValue>;
        typography: Record<Typography, TypographyValue>;
    }): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, S, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, S, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes,
        } as any;
        return newBuilder;
    }

    /**
     * Add a new size variant for a specific component.
     * This adds the size to all components in the theme.
     *
     * @param component - The component type (e.g., 'button', 'input', 'avatar')
     * @param name - The size name (e.g., '2xl', 'compact', 'tiny')
     * @param value - The size values for that component
     *
     * @example
     * ```typescript
     * createTheme()
     *   .addSize('button', '2xl', {
     *     paddingVertical: 14,
     *     paddingHorizontal: 28,
     *     minHeight: 64,
     *     fontSize: 22,
     *     lineHeight: 36,
     *     iconSize: 22,
     *   })
     *   .addSize('input', '2xl', {
     *     height: 64,
     *     paddingHorizontal: 20,
     *     fontSize: 18,
     *     iconSize: 24,
     *     iconMargin: 12,
     *   })
     *   .build();
     * ```
     */
    addSize<C extends SizeableComponent, K extends string>(
        component: C,
        name: K,
        value: ComponentSizeMap[C]
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                [component]: {
                    ...((this.config.sizes as any)?.[component] ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing size variant for a specific component.
     * Use this to override a size inherited from a base theme.
     *
     * @param component - The component type (e.g., 'button', 'input', 'avatar')
     * @param name - The existing size name to override
     * @param value - The new size values for that component
     *
     * @example
     * ```typescript
     * fromTheme(lightTheme)
     *   .setSize('button', 'md', {
     *     paddingVertical: 10,
     *     paddingHorizontal: 20,
     *     minHeight: 44,
     *     fontSize: 18,
     *     lineHeight: 28,
     *     iconSize: 18,
     *   })
     *   .build();
     * ```
     */
    setSize<C extends SizeableComponent, K extends TSize>(
        component: C,
        name: K,
        value: ComponentSizeMap[C]
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                [component]: {
                    ...((this.config.sizes as any)?.[component] ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    // =========================================================================
    // Typography Methods
    // =========================================================================

    /**
     * Set (replace) a typography variant in the theme.
     * Typography variants use a fixed set of names (h1-h6, subtitle1-2, body1-2, caption).
     *
     * @example
     * ```typescript
     * fromTheme(lightTheme)
     *   .setTypography('h1', { fontSize: 40, lineHeight: 48, fontWeight: '700' })
     *   .build();
     * ```
     */
    setTypography<K extends Typography>(
        name: K,
        value: TypographyValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                typography: {
                    ...(this.config.sizes?.typography ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    // =========================================================================
    // Breakpoint Methods
    // =========================================================================

    /**
     * Add a single breakpoint to the theme.
     *
     * IMPORTANT: At least one breakpoint must have value 0 (typically 'xs').
     * This simulates CSS cascading behavior in Unistyles.
     *
     * @param name - The breakpoint name (e.g., 'xs', 'sm', 'md')
     * @param value - The minimum width in pixels for this breakpoint
     *
     * @example
     * ```typescript
     * createTheme()
     *   .addBreakpoint('xs', 0)
     *   .addBreakpoint('sm', 576)
     *   .addBreakpoint('md', 768)
     *   .build();
     * ```
     */
    addBreakpoint<K extends string>(
        name: K,
        value: number
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints | K> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints | K>();
        newBuilder.config = {
            ...this.config,
            breakpoints: {
                ...this.config.breakpoints,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing breakpoint value.
     * Use this to override a breakpoint inherited from a base theme.
     *
     * @example
     * ```typescript
     * fromTheme(lightTheme)
     *   .setBreakpoint('md', 800) // Change md breakpoint from 768 to 800
     *   .build();
     * ```
     */
    setBreakpoint<K extends TBreakpoints>(
        name: K,
        value: number
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            breakpoints: {
                ...this.config.breakpoints,
                [name]: value,
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set all breakpoints at once.
     *
     * IMPORTANT: At least one breakpoint must have value 0.
     * Breakpoints define responsive behavior based on viewport width.
     *
     * @param breakpoints - Object mapping breakpoint names to pixel values
     *
     * @example
     * ```typescript
     * createTheme()
     *   .setBreakpoints({
     *     xs: 0,    // Required: starts at 0
     *     sm: 576,
     *     md: 768,
     *     lg: 992,
     *     xl: 1200,
     *   })
     *   .build();
     * ```
     */
    setBreakpoints<B extends Record<string, number>>(
        breakpoints: B
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, keyof B & string> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, keyof B & string>();
        newBuilder.config = {
            ...this.config,
            breakpoints,
        } as any;
        return newBuilder;
    }

    // =========================================================================
    // Font Scale
    // =========================================================================

    /**
     * Set a global font scale factor.
     * When build() is called, all font-related size properties (fontSize, lineHeight,
     * iconSize, etc.) will be multiplied by this factor.
     *
     * The unscaled base values are preserved on the built theme so that
     * runtime re-scaling via applyFontScale() is idempotent.
     *
     * @param scale - The scale factor (1.0 = no change, 1.5 = 50% larger)
     * @param options - Optional configuration
     * @param options.scaleIcons - Whether to also scale iconSize properties (default: true)
     * @param options.minScale - Minimum clamped scale (default: 0.5)
     * @param options.maxScale - Maximum clamped scale (default: 3.0)
     *
     * @example
     * ```typescript
     * createTheme()
     *   .setSizes({ ... })
     *   .setFontScale(1.2)
     *   .build();
     * ```
     *
     * @example Using OS font scale at init
     * ```typescript
     * import { UnistylesRuntime } from 'react-native-unistyles';
     *
     * createTheme()
     *   .setSizes({ ... })
     *   .setFontScale(UnistylesRuntime.fontScale)
     *   .build();
     * ```
     */
    setFontScale(
        scale: number,
        options?: ApplyFontScaleOptions,
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            __pendingFontScale: { scale, options },
        };
        return newBuilder;
    }

    // =========================================================================
    // Build
    // =========================================================================

    /**
     * Build the final theme object.
     */
    build(): BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const { __pendingFontScale, ...config } = this.config as any;
        if (__pendingFontScale) {
            return applyFontScale(config, __pendingFontScale.scale, __pendingFontScale.options);
        }
        return config;
    }
}

/**
 * Create a new theme builder.
 */
export function createTheme(): ThemeBuilder {
    return new ThemeBuilder();
}

/**
 * Create a builder from an existing theme to add more values.
 */
export function fromTheme<T extends BuiltTheme<any, any, any, any, any, any, any, any, any>>(
    base: T
): ThemeBuilder<
    keyof T['intents'] & string,
    keyof T['radii'] & string,
    keyof T['shadows'] & string,
    keyof T['colors']['pallet'] & string,
    keyof T['colors']['surface'] & string,
    keyof T['colors']['text'] & string,
    keyof T['colors']['border'] & string,
    keyof T['sizes']['button'] & string,
    keyof T['breakpoints'] & string
> {
    const builder = new ThemeBuilder<
        keyof T['intents'] & string,
        keyof T['radii'] & string,
        keyof T['shadows'] & string,
        keyof T['colors']['pallet'] & string,
        keyof T['colors']['surface'] & string,
        keyof T['colors']['text'] & string,
        keyof T['colors']['border'] & string,
        keyof T['sizes']['button'] & string,
        keyof T['breakpoints'] & string
    >();
    (builder as any).config = { ...base };
    return builder;
}
