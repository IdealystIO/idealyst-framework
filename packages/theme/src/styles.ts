export type Styles = Record<string, any> & {
    _web?: Styles,
}
export type Variants = Record<string, Record<string, Styles>>
export type CompoundDefinition<V extends string> = Partial<Record<V, any>> & { styles: Styles }
export type CompoundVariants<V extends string> = CompoundDefinition<V>[]
export type ExpandedStyles<V extends string> = Styles & {
    compoundVariants?: CompoundVariants<V>;
    variants?: Variants;
}
export type StylesheetStyles<V extends string> = ExpandedStyles<V> | ((dynamic: Partial<V>) => ExpandedStyles<V>);