/**
 * Style Generator
 *
 * Generates flat, Unistyles-compatible style files from component style definitions.
 * This runs at build time to "unroll" all function calls into static data.
 *
 * Key principles:
 * 1. Theme values stay as `theme.xxx` references (not evaluated)
 * 2. All variant combinations are pre-computed as compound variants
 * 3. No function calls in generated output
 */

import type { Theme } from '../theme';
import type { IdealystConfig, ComponentExtensions } from './types';

/**
 * Represents a style value that references the theme.
 * Used during code generation to output `theme.xxx` references.
 */
interface ThemeReference {
    __themeRef: true;
    path: string; // e.g., 'colors.surface.primary'
}

/**
 * Check if a value is a theme reference.
 */
function isThemeReference(value: unknown): value is ThemeReference {
    return typeof value === 'object' && value !== null && '__themeRef' in value;
}

/**
 * Create a theme reference for code generation.
 */
function themeRef(path: string): ThemeReference {
    return { __themeRef: true, path };
}

/**
 * Deep merge objects, with source taking precedence.
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = target[key];

            if (
                sourceValue !== null &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                !isThemeReference(sourceValue) &&
                targetValue !== null &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue) &&
                !isThemeReference(targetValue)
            ) {
                (result as any)[key] = deepMerge(targetValue, sourceValue);
            } else if (sourceValue !== undefined) {
                (result as any)[key] = sourceValue;
            }
        }
    }

    return result;
}

/**
 * Convert a JavaScript value to code string.
 * Theme references become `theme.xxx` expressions.
 */
function valueToCode(value: unknown, indent: number = 0): string {
    const spaces = '    '.repeat(indent);
    const innerSpaces = '    '.repeat(indent + 1);

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    if (isThemeReference(value)) {
        return `theme.${value.path}`;
    }

    if (typeof value === 'string') {
        // Check if it looks like a theme reference string
        if (value.startsWith('theme.')) {
            return value; // Already a theme reference
        }
        return JSON.stringify(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        const items = value.map(v => valueToCode(v, indent + 1));
        return `[\n${innerSpaces}${items.join(`,\n${innerSpaces}`)}\n${spaces}]`;
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length === 0) return '{}';

        const lines = entries.map(([k, v]) => {
            const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
            return `${innerSpaces}${key}: ${valueToCode(v, indent + 1)}`;
        });

        return `{\n${lines.join(',\n')}\n${spaces}}`;
    }

    return String(value);
}

// ============================================================================
// View Component Generator
// ============================================================================

/**
 * Generate background variants for View component.
 */
function generateBackgroundVariants(theme: Theme): Record<string, any> {
    const variants: Record<string, any> = {
        transparent: { backgroundColor: 'transparent' },
    };

    // Add all surface colors with theme references
    for (const surface in theme.colors.surface) {
        variants[surface] = {
            backgroundColor: themeRef(`colors.surface.${surface}`),
        };
    }

    return variants;
}

/**
 * Generate radius variants.
 */
function generateRadiusVariants(theme: Theme): Record<string, any> {
    const variants: Record<string, any> = {};

    for (const radius in theme.radii) {
        variants[radius] = {
            borderRadius: theme.radii[radius as keyof typeof theme.radii],
        };
    }

    return variants;
}

/**
 * Generate spacing variants (gap, padding, margin).
 */
function generateSpacingVariants(
    property: 'gap' | 'padding' | 'paddingVertical' | 'paddingHorizontal' | 'margin' | 'marginVertical' | 'marginHorizontal'
): Record<string, any> {
    const variants: Record<string, any> = {
        none: {},
    };

    // Map property to actual CSS properties
    const propertyMap: Record<string, string[]> = {
        gap: ['gap'],
        padding: ['padding'],
        paddingVertical: ['paddingTop', 'paddingBottom'],
        paddingHorizontal: ['paddingLeft', 'paddingRight'],
        margin: ['margin'],
        marginVertical: ['marginTop', 'marginBottom'],
        marginHorizontal: ['marginLeft', 'marginRight'],
    };

    const cssProps = propertyMap[property];
    const spacingValues = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

    for (const [size, value] of Object.entries(spacingValues)) {
        const styles: Record<string, number> = {};
        for (const prop of cssProps) {
            styles[prop] = value;
        }
        variants[size] = styles;
    }

    return variants;
}

/**
 * Generate border variants for View.
 */
function generateBorderVariants(): Record<string, any> {
    return {
        none: { borderWidth: 0 },
        thin: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: themeRef('colors.border.primary'),
        },
        thick: {
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: themeRef('colors.border.primary'),
        },
    };
}

/**
 * Generate View component styles.
 */
function generateViewStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    let viewStyle: Record<string, any> = {
        display: 'flex',
        variants: {
            background: generateBackgroundVariants(theme),
            radius: generateRadiusVariants(theme),
            border: generateBorderVariants(),
            gap: generateSpacingVariants('gap'),
            padding: generateSpacingVariants('padding'),
            paddingVertical: generateSpacingVariants('paddingVertical'),
            paddingHorizontal: generateSpacingVariants('paddingHorizontal'),
            margin: generateSpacingVariants('margin'),
            marginVertical: generateSpacingVariants('marginVertical'),
            marginHorizontal: generateSpacingVariants('marginHorizontal'),
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    };

    // Apply extensions if provided
    if (extensions?.View) {
        const ext = typeof extensions.View === 'function'
            ? extensions.View(theme)
            : extensions.View;

        if (ext.view) {
            viewStyle = deepMerge(viewStyle, ext.view);
        }
    }

    return { view: viewStyle };
}

// ============================================================================
// Screen Component Generator
// ============================================================================

/**
 * Generate Screen component styles.
 */
function generateScreenStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    const backgroundVariants = generateBackgroundVariants(theme);

    let screenStyle: Record<string, any> = {
        flex: 1,
        variants: {
            background: backgroundVariants,
            safeArea: { true: {}, false: {} },
            gap: generateSpacingVariants('gap'),
            padding: generateSpacingVariants('padding'),
            paddingVertical: generateSpacingVariants('paddingVertical'),
            paddingHorizontal: generateSpacingVariants('paddingHorizontal'),
            margin: generateSpacingVariants('margin'),
            marginVertical: generateSpacingVariants('marginVertical'),
            marginHorizontal: generateSpacingVariants('marginHorizontal'),
        },
        _web: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            boxSizing: 'border-box',
        },
    };

    let screenContentStyle: Record<string, any> = {
        variants: {
            background: backgroundVariants,
            safeArea: { true: {}, false: {} },
            gap: generateSpacingVariants('gap'),
            padding: generateSpacingVariants('padding'),
            paddingVertical: generateSpacingVariants('paddingVertical'),
            paddingHorizontal: generateSpacingVariants('paddingHorizontal'),
            margin: generateSpacingVariants('margin'),
            marginVertical: generateSpacingVariants('marginVertical'),
            marginHorizontal: generateSpacingVariants('marginHorizontal'),
        },
    };

    // Apply extensions
    if (extensions?.Screen) {
        const ext = typeof extensions.Screen === 'function'
            ? extensions.Screen(theme)
            : extensions.Screen;

        if (ext.screen) {
            screenStyle = deepMerge(screenStyle, ext.screen);
        }
        if (ext.screenContent) {
            screenContentStyle = deepMerge(screenContentStyle, ext.screenContent);
        }
    }

    return {
        screen: screenStyle,
        screenContent: screenContentStyle,
    };
}

// ============================================================================
// Button Component Generator
// ============================================================================

/**
 * Generate Button component styles with all intent/type combinations as compound variants.
 */
function generateButtonStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    const intents = Object.keys(theme.intents);
    const types = ['contained', 'outlined', 'text'] as const;
    const sizes = Object.keys(theme.sizes.button);

    // Generate size variants using theme references
    const sizeVariants: Record<string, any> = {};
    for (const size of sizes) {
        sizeVariants[size] = {
            paddingVertical: themeRef(`sizes.button.${size}.paddingVertical`),
            paddingHorizontal: themeRef(`sizes.button.${size}.paddingHorizontal`),
            minHeight: themeRef(`sizes.button.${size}.minHeight`),
        };
    }

    // Generate intent variants (empty - styles come from compound variants)
    const intentVariants: Record<string, any> = {};
    for (const intent of intents) {
        intentVariants[intent] = {};
    }

    // Generate type variants (structure only)
    const typeVariants = {
        contained: { borderWidth: 0 },
        outlined: { borderWidth: 1, borderStyle: 'solid' as const },
        text: { borderWidth: 0 },
    };

    // Generate compound variants for all intent/type combinations
    const compoundVariants: any[] = [];
    for (const intent of intents) {
        for (const type of types) {
            const styles: Record<string, any> = {};

            if (type === 'contained') {
                styles.backgroundColor = themeRef(`intents.${intent}.primary`);
            } else if (type === 'outlined') {
                styles.backgroundColor = themeRef('colors.surface.primary');
                styles.borderColor = themeRef(`intents.${intent}.primary`);
            } else {
                styles.backgroundColor = 'transparent';
            }

            compoundVariants.push({
                intent,
                type,
                styles,
            });
        }
    }

    let buttonStyle: Record<string, any> = {
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontWeight: '600',
        textAlign: 'center',
        variants: {
            size: sizeVariants,
            intent: intentVariants,
            type: typeVariants,
            disabled: {
                true: { opacity: 0.6 },
                false: {
                    opacity: 1,
                    _web: {
                        cursor: 'pointer',
                        _hover: { opacity: 0.90 },
                        _active: { opacity: 0.75 },
                    },
                },
            },
            gradient: {
                darken: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)' } },
                lighten: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%)' } },
            },
        },
        compoundVariants,
        _web: {
            display: 'flex',
            transition: 'all 0.1s ease',
        },
    };

    // Generate text styles with compound variants for color
    const textCompoundVariants: any[] = [];
    for (const intent of intents) {
        for (const type of types) {
            const color = type === 'contained'
                ? themeRef(`intents.${intent}.contrast`)
                : themeRef(`intents.${intent}.primary`);

            textCompoundVariants.push({
                intent,
                type,
                styles: { color },
            });
        }
    }

    const textSizeVariants: Record<string, any> = {};
    for (const size of sizes) {
        textSizeVariants[size] = {
            fontSize: themeRef(`sizes.button.${size}.fontSize`),
            lineHeight: themeRef(`sizes.button.${size}.fontSize`),
        };
    }

    let textStyle: Record<string, any> = {
        fontWeight: '600',
        textAlign: 'center',
        variants: {
            size: textSizeVariants,
            intent: intentVariants,
            type: { contained: {}, outlined: {}, text: {} },
            disabled: {
                true: { opacity: 0.6 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: textCompoundVariants,
    };

    // Generate icon styles with compound variants
    const iconSizeVariants: Record<string, any> = {};
    for (const size of sizes) {
        iconSizeVariants[size] = {
            width: themeRef(`sizes.button.${size}.iconSize`),
            height: themeRef(`sizes.button.${size}.iconSize`),
        };
    }

    let iconStyle: Record<string, any> = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: iconSizeVariants,
            intent: intentVariants,
            type: { contained: {}, outlined: {}, text: {} },
        },
        compoundVariants: textCompoundVariants, // Same colors as text
    };

    let iconContainerStyle: Record<string, any> = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    };

    // Apply extensions
    if (extensions?.Button) {
        const ext = typeof extensions.Button === 'function'
            ? extensions.Button(theme)
            : extensions.Button;

        if (ext.button) buttonStyle = deepMerge(buttonStyle, ext.button);
        if (ext.text) textStyle = deepMerge(textStyle, ext.text);
        if (ext.icon) iconStyle = deepMerge(iconStyle, ext.icon);
        if (ext.iconContainer) iconContainerStyle = deepMerge(iconContainerStyle, ext.iconContainer);
    }

    return {
        button: buttonStyle,
        text: textStyle,
        icon: iconStyle,
        iconContainer: iconContainerStyle,
    };
}

// ============================================================================
// Text Component Generator
// ============================================================================

/**
 * Generate Text component styles.
 */
function generateTextStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    // Generate typography variants
    const typographyVariants: Record<string, any> = {};
    for (const key in theme.sizes.typography) {
        typographyVariants[key] = {
            fontSize: themeRef(`sizes.typography.${key}.fontSize`),
            lineHeight: themeRef(`sizes.typography.${key}.lineHeight`),
            fontWeight: themeRef(`sizes.typography.${key}.fontWeight`),
        };
    }

    // Generate color variants for text
    const colorVariants: Record<string, any> = {};
    for (const color in theme.colors.text) {
        colorVariants[color] = {
            color: themeRef(`colors.text.${color}`),
        };
    }

    let textStyle: Record<string, any> = {
        margin: 0,
        padding: 0,
        color: themeRef('colors.text.primary'),
        variants: {
            color: colorVariants,
            typography: typographyVariants,
            weight: {
                light: { fontWeight: '300' },
                normal: { fontWeight: '400' },
                medium: { fontWeight: '500' },
                semibold: { fontWeight: '600' },
                bold: { fontWeight: '700' },
            },
            align: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
            },
            gap: generateSpacingVariants('gap'),
            padding: generateSpacingVariants('padding'),
            paddingVertical: generateSpacingVariants('paddingVertical'),
            paddingHorizontal: generateSpacingVariants('paddingHorizontal'),
        },
        _web: {
            fontFamily: 'inherit',
        },
    };

    // Apply extensions
    if (extensions?.Text) {
        const ext = typeof extensions.Text === 'function'
            ? extensions.Text(theme)
            : extensions.Text;

        if (ext.text) textStyle = deepMerge(textStyle, ext.text);
    }

    return { text: textStyle };
}

// ============================================================================
// Card Component Generator
// ============================================================================

/**
 * Generate Card component styles.
 */
function generateCardStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    let cardStyle: Record<string, any> = {
        backgroundColor: themeRef('colors.surface.primary'),
        borderRadius: 8,
        overflow: 'hidden',
        variants: {
            shadow: {
                none: {},
                sm: themeRef('shadows.sm'),
                md: themeRef('shadows.md'),
                lg: themeRef('shadows.lg'),
            },
            padding: generateSpacingVariants('padding'),
        },
        _web: {
            boxSizing: 'border-box',
        },
    };

    // Apply extensions
    if (extensions?.Card) {
        const ext = typeof extensions.Card === 'function'
            ? extensions.Card(theme)
            : extensions.Card;

        if (ext.card) cardStyle = deepMerge(cardStyle, ext.card);
    }

    return { card: cardStyle };
}

// ============================================================================
// Input Component Generator
// ============================================================================

/**
 * Generate Input component styles.
 */
function generateInputStyles(theme: Theme, extensions?: ComponentExtensions): Record<string, any> {
    const sizes = Object.keys(theme.sizes.input);

    // Generate size variants
    const sizeVariants: Record<string, any> = {};
    for (const size of sizes) {
        sizeVariants[size] = {
            height: themeRef(`sizes.input.${size}.height`),
            paddingHorizontal: themeRef(`sizes.input.${size}.paddingHorizontal`),
            fontSize: themeRef(`sizes.input.${size}.fontSize`),
        };
    }

    let wrapperStyle: Record<string, any> = {
        width: '100%',
    };

    let inputStyle: Record<string, any> = {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeRef('colors.border.primary'),
        borderRadius: 8,
        backgroundColor: themeRef('colors.surface.primary'),
        color: themeRef('colors.text.primary'),
        variants: {
            size: sizeVariants,
            focused: {
                true: {
                    borderColor: themeRef('interaction.focusBorder'),
                },
                false: {},
            },
            error: {
                true: {
                    borderColor: themeRef('intents.error.primary'),
                },
                false: {},
            },
            disabled: {
                true: {
                    opacity: 0.6,
                },
                false: {},
            },
        },
        _web: {
            outline: 'none',
            boxSizing: 'border-box',
        },
    };

    let labelStyle: Record<string, any> = {
        color: themeRef('colors.text.primary'),
        marginBottom: 4,
        fontSize: 14,
        fontWeight: '500',
    };

    let hintStyle: Record<string, any> = {
        color: themeRef('colors.text.secondary'),
        marginTop: 4,
        fontSize: 12,
        variants: {
            error: {
                true: { color: themeRef('intents.error.primary') },
                false: {},
            },
        },
    };

    // Apply extensions
    if (extensions?.Input) {
        const ext = typeof extensions.Input === 'function'
            ? extensions.Input(theme)
            : extensions.Input;

        if (ext.wrapper) wrapperStyle = deepMerge(wrapperStyle, ext.wrapper);
        if (ext.input) inputStyle = deepMerge(inputStyle, ext.input);
        if (ext.label) labelStyle = deepMerge(labelStyle, ext.label);
        if (ext.hint) hintStyle = deepMerge(hintStyle, ext.hint);
    }

    return {
        wrapper: wrapperStyle,
        input: inputStyle,
        label: labelStyle,
        hint: hintStyle,
    };
}

// ============================================================================
// Code Generation
// ============================================================================

/**
 * Generate code for a component's StyleSheet.create call.
 */
function generateComponentCode(
    componentName: string,
    styles: Record<string, any>,
    exportName: string
): string {
    const stylesCode = valueToCode(styles, 1);

    return `// GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by @idealyst/theme from idealyst.config.ts

import { StyleSheet } from 'react-native-unistyles';

export const ${exportName} = StyleSheet.create((theme) => (${stylesCode}));
`;
}

/**
 * Generate Unistyles configuration code.
 */
function generateUnistylesConfig(config: IdealystConfig): string {
    const themeNames = Object.keys(config.themes);

    const themeImports = themeNames
        .map(name => `import { ${name}Theme } from './${name}Theme.generated';`)
        .join('\n');

    const themeDeclarations = themeNames
        .map(name => `    ${name}: typeof ${name}Theme;`)
        .join('\n');

    const themeAssignments = themeNames
        .map(name => `      ${name}: ${name}Theme,`)
        .join('\n');

    return `// GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by @idealyst/theme from idealyst.config.ts

import { StyleSheet } from 'react-native-unistyles';
${themeImports}

// Unistyles theme type declarations
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
${themeDeclarations}
  }
}

// Configure Unistyles
StyleSheet.configure({
    settings: {
        initialTheme: '${themeNames[0]}',
    },
    themes: {
${themeAssignments}
    }
});

export const unistylesConfigured = true;
`;
}

/**
 * Main generator function.
 * Returns an object with all generated file contents.
 */
export function generateStyles(config: IdealystConfig): Record<string, string> {
    const files: Record<string, string> = {};

    // Use light theme as reference for generating styles
    // (variants are the same across themes, only values differ)
    const referenceTheme = config.themes.light;

    // Generate View styles
    const viewStyles = generateViewStyles(referenceTheme, config.extensions);
    files['View.styles.generated.ts'] = generateComponentCode('View', viewStyles, 'viewStyles');

    // Generate Screen styles
    const screenStyles = generateScreenStyles(referenceTheme, config.extensions);
    files['Screen.styles.generated.ts'] = generateComponentCode('Screen', screenStyles, 'screenStyles');

    // Generate Button styles
    const buttonStyles = generateButtonStyles(referenceTheme, config.extensions);
    files['Button.styles.generated.ts'] = generateComponentCode('Button', buttonStyles, 'buttonStyles');

    // Generate Text styles
    const textStyles = generateTextStyles(referenceTheme, config.extensions);
    files['Text.styles.generated.ts'] = generateComponentCode('Text', textStyles, 'textStyles');

    // Generate Card styles
    const cardStyles = generateCardStyles(referenceTheme, config.extensions);
    files['Card.styles.generated.ts'] = generateComponentCode('Card', cardStyles, 'cardStyles');

    // Generate Input styles
    const inputStyles = generateInputStyles(referenceTheme, config.extensions);
    files['Input.styles.generated.ts'] = generateComponentCode('Input', inputStyles, 'inputStyles');

    // Generate Unistyles config
    files['unistyles.generated.ts'] = generateUnistylesConfig(config);

    // Generate theme files (export the theme objects as-is)
    for (const [name, theme] of Object.entries(config.themes)) {
        files[`${name}Theme.generated.ts`] = `// GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by @idealyst/theme from idealyst.config.ts

export const ${name}Theme = ${JSON.stringify(theme, null, 2)};
`;
    }

    return files;
}

/**
 * Export types for external use.
 */
export type { IdealystConfig, ComponentExtensions };
