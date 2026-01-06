import {
    IntentValue,
    ShadowValue,
    InteractionConfig,
    ColorValue,
    Shade,
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
> = BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize>;

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
> {
    private config: ThemeConfig<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize>;

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
        };
    }

    /**
     * Add a custom intent to the theme.
     */
    addIntent<K extends string>(
        name: K,
        value: IntentValue
    ): ThemeBuilder<TIntents | K, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize> {
        const newBuilder = new ThemeBuilder<TIntents | K, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize>();
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
    ): ThemeBuilder<TIntents, TRadii | K, TShadows, TPallet, TSurface, TText, TBorder, TSize> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii | K, TShadows, TPallet, TSurface, TText, TBorder, TSize>();
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
    ): ThemeBuilder<TIntents, TRadii, TShadows | K, TPallet, TSurface, TText, TBorder, TSize> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows | K, TPallet, TSurface, TText, TBorder, TSize>();
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
    ): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize>();
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
    }): ThemeBuilder<TIntents, TRadii, TShadows, P, S, T, B, TSize> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, P, S, T, B, TSize>();
        newBuilder.config = {
            ...this.config,
            colors,
        } as any;
        return newBuilder;
    }

    /**
     * Set the sizes configuration.
     */
    setSizes<S extends string>(sizes: {
        button: Record<S, ButtonSizeValue>;
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
        breadcrumb: Record<S, BreadcrumbSizeValue>;
        list: Record<S, ListSizeValue>;
        menu: Record<S, MenuSizeValue>;
        text: Record<S, TextSizeValue>;
        tabBar: Record<S, TabBarSizeValue>;
        table: Record<S, TableSizeValue>;
        tooltip: Record<S, TooltipSizeValue>;
        view: Record<S, ViewSizeValue>;
        typography: Record<Typography, TypographyValue>;
    }): ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, S> {
        const newBuilder = new ThemeBuilder<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, S>();
        newBuilder.config = {
            ...this.config,
            sizes,
        } as any;
        return newBuilder;
    }

    /**
     * Build the final theme object.
     */
    build(): BuiltTheme<TIntents, TRadii, TShadows, TPallet, TSurface, TText, TBorder, TSize> {
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
export function fromTheme<T extends BuiltTheme<any, any, any, any, any, any, any, any>>(
    base: T
): ThemeBuilder<
    keyof T['intents'] & string,
    keyof T['radii'] & string,
    keyof T['shadows'] & string,
    keyof T['colors']['pallet'] & string,
    keyof T['colors']['surface'] & string,
    keyof T['colors']['text'] & string,
    keyof T['colors']['border'] & string,
    keyof T['sizes']['button'] & string
> {
    const builder = new ThemeBuilder<
        keyof T['intents'] & string,
        keyof T['radii'] & string,
        keyof T['shadows'] & string,
        keyof T['colors']['pallet'] & string,
        keyof T['colors']['surface'] & string,
        keyof T['colors']['text'] & string,
        keyof T['colors']['border'] & string,
        keyof T['sizes']['button'] & string
    >();
    (builder as any).config = { ...base };
    return builder;
}
