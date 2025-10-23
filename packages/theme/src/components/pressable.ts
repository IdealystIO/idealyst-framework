import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type PressableVariants = {
    disabled: boolean;
}

export type ExpandedPressableStyles = StylesheetStyles<keyof PressableVariants>;

export type PressableStylesheet = {
    container: ExpandedPressableStyles;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedPressableStyles>): ExpandedPressableStyles => {
    return deepMerge({
        variants: {
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'default',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                    },
                },
                false: {
                    _web: {
                        cursor: 'pointer',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                    },
                },
            },
        },
        _web: {
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
        },
    }, expanded);
}

export const createPressableStylesheet = (theme: Theme, expanded?: Partial<PressableStylesheet>): PressableStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
    };
}
