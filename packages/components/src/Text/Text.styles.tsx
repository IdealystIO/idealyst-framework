import { StyleSheet } from "react-native-unistyles";
import { Theme } from '@idealyst/theme';
import { TextAlignVariant, TextColorVariant, TextWeightVariant, TextTypographyVariant } from "./types";

export type TextVariants = {
    typography: TextTypographyVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
}

type TextStyleParams = {
    color?: TextColorVariant;
}

/**
 * Create typography variants from theme - will be inlined by Babel plugin
 */
function createTypographyVariants(theme: Theme) {
    return {
        h1: {
            fontSize: theme.sizes.typography.h1.fontSize,
            lineHeight: theme.sizes.typography.h1.lineHeight,
            fontWeight: theme.sizes.typography.h1.fontWeight,
        },
        h2: {
            fontSize: theme.sizes.typography.h2.fontSize,
            lineHeight: theme.sizes.typography.h2.lineHeight,
            fontWeight: theme.sizes.typography.h2.fontWeight,
        },
        h3: {
            fontSize: theme.sizes.typography.h3.fontSize,
            lineHeight: theme.sizes.typography.h3.lineHeight,
            fontWeight: theme.sizes.typography.h3.fontWeight,
        },
        h4: {
            fontSize: theme.sizes.typography.h4.fontSize,
            lineHeight: theme.sizes.typography.h4.lineHeight,
            fontWeight: theme.sizes.typography.h4.fontWeight,
        },
        h5: {
            fontSize: theme.sizes.typography.h5.fontSize,
            lineHeight: theme.sizes.typography.h5.lineHeight,
            fontWeight: theme.sizes.typography.h5.fontWeight,
        },
        h6: {
            fontSize: theme.sizes.typography.h6.fontSize,
            lineHeight: theme.sizes.typography.h6.lineHeight,
            fontWeight: theme.sizes.typography.h6.fontWeight,
        },
        subtitle1: {
            fontSize: theme.sizes.typography.subtitle1.fontSize,
            lineHeight: theme.sizes.typography.subtitle1.lineHeight,
            fontWeight: theme.sizes.typography.subtitle1.fontWeight,
        },
        subtitle2: {
            fontSize: theme.sizes.typography.subtitle2.fontSize,
            lineHeight: theme.sizes.typography.subtitle2.lineHeight,
            fontWeight: theme.sizes.typography.subtitle2.fontWeight,
        },
        body1: {
            fontSize: theme.sizes.typography.body1.fontSize,
            lineHeight: theme.sizes.typography.body1.lineHeight,
            fontWeight: theme.sizes.typography.body1.fontWeight,
        },
        body2: {
            fontSize: theme.sizes.typography.body2.fontSize,
            lineHeight: theme.sizes.typography.body2.lineHeight,
            fontWeight: theme.sizes.typography.body2.fontWeight,
        },
        caption: {
            fontSize: theme.sizes.typography.caption.fontSize,
            lineHeight: theme.sizes.typography.caption.lineHeight,
            fontWeight: theme.sizes.typography.caption.fontWeight,
        },
    };
}

/**
 * Create text styles - will be inlined by Babel plugin
 */
function createTextStyles(theme: Theme) {
    return ({ color }: TextStyleParams) => ({
        margin: 0,
        padding: 0,
        color: theme.colors.text[color ?? 'primary'] || theme.colors.text.primary,
        variants: {
            typography: createTypographyVariants(theme),
            weight: {
                light: { fontWeight: '300' },
                normal: { fontWeight: '400' },
                medium: { fontWeight: '500' },
                semibold: { fontWeight: '600' },
                bold: { fontWeight: '700' },
            } as const,
            align: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
            } as const,
            gap: {
                xs: { gap: theme.sizes.view.xs.spacing },
                sm: { gap: theme.sizes.view.sm.spacing },
                md: { gap: theme.sizes.view.md.spacing },
                lg: { gap: theme.sizes.view.lg.spacing },
                xl: { gap: theme.sizes.view.xl.spacing },
            },
            padding: {
                xs: { padding: theme.sizes.view.xs.padding },
                sm: { padding: theme.sizes.view.sm.padding },
                md: { padding: theme.sizes.view.md.padding },
                lg: { padding: theme.sizes.view.lg.padding },
                xl: { padding: theme.sizes.view.xl.padding },
            },
            paddingVertical: {
                xs: { paddingVertical: theme.sizes.view.xs.padding },
                sm: { paddingVertical: theme.sizes.view.sm.padding },
                md: { paddingVertical: theme.sizes.view.md.padding },
                lg: { paddingVertical: theme.sizes.view.lg.padding },
                xl: { paddingVertical: theme.sizes.view.xl.padding },
            },
            paddingHorizontal: {
                xs: { paddingHorizontal: theme.sizes.view.xs.padding },
                sm: { paddingHorizontal: theme.sizes.view.sm.padding },
                md: { paddingHorizontal: theme.sizes.view.md.padding },
                lg: { paddingHorizontal: theme.sizes.view.lg.padding },
                xl: { paddingHorizontal: theme.sizes.view.xl.padding },
            },
        } as const,
        _web: {
            fontFamily: 'inherit',
        },
    });
}

// The Babel plugin will inline createTextStyles and createTypographyVariants
export const textStyles = StyleSheet.create((theme: Theme) => ({
    text: createTextStyles(theme),
}));
