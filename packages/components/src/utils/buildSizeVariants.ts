import { AllComponentSizes, Size, Theme, Styles } from '@idealyst/theme'

/**
 * Builds a generic size variant. Not really useful on its own tbh, just good to show how it can be used.
 * Context really matters for sizes
 * @param theme 
 * @param builder 
 * @returns 
 */
export function buildSizeVariants<T extends keyof AllComponentSizes>(theme: Theme, component: T, builder: (value: AllComponentSizes[T][Size]) => Styles): Record<Size, Styles> {
    const variants = {} as Record<Size, Styles>;
    for (const size in theme.sizes[component]) {
        variants[size as Size] = builder(theme.sizes[component][size as Size]);
    }
    return variants;
}