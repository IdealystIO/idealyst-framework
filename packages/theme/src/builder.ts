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
} from './theme/structures';

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
> = BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>;

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

    /**
     * Set the sizes configuration.
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

    // =========================================================================
    // Individual Size Methods - Add new size variants
    // =========================================================================

    /**
     * Add a new size variant for button component.
     * @param name - The size name (e.g., '2xl', 'compact')
     * @param value - The size values
     */
    addButtonSize<K extends string>(
        name: K,
        value: ButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                button: {
                    ...(this.config.sizes?.button ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing button size variant.
     */
    setButtonSize<K extends TSize>(
        name: K,
        value: ButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                button: {
                    ...(this.config.sizes?.button ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for iconButton component.
     */
    addIconButtonSize<K extends string>(
        name: K,
        value: IconButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                iconButton: {
                    ...(this.config.sizes?.iconButton ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing iconButton size variant.
     */
    setIconButtonSize<K extends TSize>(
        name: K,
        value: IconButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                iconButton: {
                    ...(this.config.sizes?.iconButton ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for chip component.
     */
    addChipSize<K extends string>(
        name: K,
        value: ChipSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                chip: {
                    ...(this.config.sizes?.chip ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing chip size variant.
     */
    setChipSize<K extends TSize>(
        name: K,
        value: ChipSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                chip: {
                    ...(this.config.sizes?.chip ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for badge component.
     */
    addBadgeSize<K extends string>(
        name: K,
        value: BadgeSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                badge: {
                    ...(this.config.sizes?.badge ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing badge size variant.
     */
    setBadgeSize<K extends TSize>(
        name: K,
        value: BadgeSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                badge: {
                    ...(this.config.sizes?.badge ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for icon component.
     */
    addIconSize<K extends string>(
        name: K,
        value: IconSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                icon: {
                    ...(this.config.sizes?.icon ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing icon size variant.
     */
    setIconSize<K extends TSize>(
        name: K,
        value: IconSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                icon: {
                    ...(this.config.sizes?.icon ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for input component.
     */
    addInputSize<K extends string>(
        name: K,
        value: InputSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                input: {
                    ...(this.config.sizes?.input ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing input size variant.
     */
    setInputSize<K extends TSize>(
        name: K,
        value: InputSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                input: {
                    ...(this.config.sizes?.input ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for radioButton component.
     */
    addRadioButtonSize<K extends string>(
        name: K,
        value: RadioButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                radioButton: {
                    ...(this.config.sizes?.radioButton ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing radioButton size variant.
     */
    setRadioButtonSize<K extends TSize>(
        name: K,
        value: RadioButtonSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                radioButton: {
                    ...(this.config.sizes?.radioButton ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for select component.
     */
    addSelectSize<K extends string>(
        name: K,
        value: SelectSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                select: {
                    ...(this.config.sizes?.select ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing select size variant.
     */
    setSelectSize<K extends TSize>(
        name: K,
        value: SelectSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                select: {
                    ...(this.config.sizes?.select ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for slider component.
     */
    addSliderSize<K extends string>(
        name: K,
        value: SliderSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                slider: {
                    ...(this.config.sizes?.slider ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing slider size variant.
     */
    setSliderSize<K extends TSize>(
        name: K,
        value: SliderSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                slider: {
                    ...(this.config.sizes?.slider ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for switch component.
     */
    addSwitchSize<K extends string>(
        name: K,
        value: SwitchSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                switch: {
                    ...(this.config.sizes?.switch ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing switch size variant.
     */
    setSwitchSize<K extends TSize>(
        name: K,
        value: SwitchSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                switch: {
                    ...(this.config.sizes?.switch ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for textarea component.
     */
    addTextAreaSize<K extends string>(
        name: K,
        value: TextAreaSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                textarea: {
                    ...(this.config.sizes?.textarea ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing textarea size variant.
     */
    setTextAreaSize<K extends TSize>(
        name: K,
        value: TextAreaSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                textarea: {
                    ...(this.config.sizes?.textarea ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for avatar component.
     */
    addAvatarSize<K extends string>(
        name: K,
        value: AvatarSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                avatar: {
                    ...(this.config.sizes?.avatar ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing avatar size variant.
     */
    setAvatarSize<K extends TSize>(
        name: K,
        value: AvatarSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                avatar: {
                    ...(this.config.sizes?.avatar ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for progress component.
     */
    addProgressSize<K extends string>(
        name: K,
        value: ProgressSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                progress: {
                    ...(this.config.sizes?.progress ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing progress size variant.
     */
    setProgressSize<K extends TSize>(
        name: K,
        value: ProgressSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                progress: {
                    ...(this.config.sizes?.progress ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for accordion component.
     */
    addAccordionSize<K extends string>(
        name: K,
        value: AccordionSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                accordion: {
                    ...(this.config.sizes?.accordion ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing accordion size variant.
     */
    setAccordionSize<K extends TSize>(
        name: K,
        value: AccordionSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                accordion: {
                    ...(this.config.sizes?.accordion ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for activityIndicator component.
     */
    addActivityIndicatorSize<K extends string>(
        name: K,
        value: ActivityIndicatorSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                activityIndicator: {
                    ...(this.config.sizes?.activityIndicator ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing activityIndicator size variant.
     */
    setActivityIndicatorSize<K extends TSize>(
        name: K,
        value: ActivityIndicatorSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                activityIndicator: {
                    ...(this.config.sizes?.activityIndicator ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for alert component.
     */
    addAlertSize<K extends string>(
        name: K,
        value: AlertSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                alert: {
                    ...(this.config.sizes?.alert ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing alert size variant.
     */
    setAlertSize<K extends TSize>(
        name: K,
        value: AlertSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                alert: {
                    ...(this.config.sizes?.alert ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for breadcrumb component.
     */
    addBreadcrumbSize<K extends string>(
        name: K,
        value: BreadcrumbSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                breadcrumb: {
                    ...(this.config.sizes?.breadcrumb ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing breadcrumb size variant.
     */
    setBreadcrumbSize<K extends TSize>(
        name: K,
        value: BreadcrumbSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                breadcrumb: {
                    ...(this.config.sizes?.breadcrumb ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for list component.
     */
    addListSize<K extends string>(
        name: K,
        value: ListSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                list: {
                    ...(this.config.sizes?.list ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing list size variant.
     */
    setListSize<K extends TSize>(
        name: K,
        value: ListSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                list: {
                    ...(this.config.sizes?.list ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for menu component.
     */
    addMenuSize<K extends string>(
        name: K,
        value: MenuSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                menu: {
                    ...(this.config.sizes?.menu ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing menu size variant.
     */
    setMenuSize<K extends TSize>(
        name: K,
        value: MenuSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                menu: {
                    ...(this.config.sizes?.menu ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for text component.
     */
    addTextSize<K extends string>(
        name: K,
        value: TextSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                text: {
                    ...(this.config.sizes?.text ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing text size variant.
     */
    setTextSize<K extends TSize>(
        name: K,
        value: TextSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                text: {
                    ...(this.config.sizes?.text ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for tabBar component.
     */
    addTabBarSize<K extends string>(
        name: K,
        value: TabBarSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                tabBar: {
                    ...(this.config.sizes?.tabBar ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing tabBar size variant.
     */
    setTabBarSize<K extends TSize>(
        name: K,
        value: TabBarSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                tabBar: {
                    ...(this.config.sizes?.tabBar ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for table component.
     */
    addTableSize<K extends string>(
        name: K,
        value: TableSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                table: {
                    ...(this.config.sizes?.table ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing table size variant.
     */
    setTableSize<K extends TSize>(
        name: K,
        value: TableSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                table: {
                    ...(this.config.sizes?.table ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for tooltip component.
     */
    addTooltipSize<K extends string>(
        name: K,
        value: TooltipSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                tooltip: {
                    ...(this.config.sizes?.tooltip ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing tooltip size variant.
     */
    setTooltipSize<K extends TSize>(
        name: K,
        value: TooltipSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                tooltip: {
                    ...(this.config.sizes?.tooltip ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Add a new size variant for view component.
     */
    addViewSize<K extends string>(
        name: K,
        value: ViewSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize | K, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                view: {
                    ...(this.config.sizes?.view ?? {}),
                    [name]: value,
                },
            } as any,
        };
        return newBuilder;
    }

    /**
     * Set (replace) an existing view size variant.
     */
    setViewSize<K extends TSize>(
        name: K,
        value: ViewSizeValue
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints>();
        newBuilder.config = {
            ...this.config,
            sizes: {
                ...this.config.sizes,
                view: {
                    ...(this.config.sizes?.view ?? {}),
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
     * Add a new typography variant to the theme.
     * Note: Typography variants use a fixed set of names (h1-h6, subtitle1-2, body1-2, caption).
     * Use setTypography to modify existing variants.
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
    // Interaction Methods
    // =========================================================================

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
    // Breakpoint Methods
    // =========================================================================

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

    /**
     * Build the final theme object.
     */
    build(): BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize, TBreakpoints> {
        return this.config;
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
