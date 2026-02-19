import React, { forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useBreakpoint, Breakpoint } from '@idealyst/theme';
import { GridProps, ResponsiveColumns } from './types';
import { gridStyles } from './Grid.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { useWebLayout } from '../hooks/useWebLayout';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

const BREAKPOINT_ORDER: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];

function resolveColumns(columns: ResponsiveColumns, breakpoint: Breakpoint | undefined): number {
    if (typeof columns === 'number') return columns;

    const bpIndex = breakpoint ? BREAKPOINT_ORDER.indexOf(breakpoint) : BREAKPOINT_ORDER.length - 1;
    for (let i = bpIndex; i < BREAKPOINT_ORDER.length; i++) {
        const bp = BREAKPOINT_ORDER[i];
        if (columns[bp] !== undefined) {
            return columns[bp]!;
        }
    }

    return 1;
}

/**
 * Grid component for Web.
 *
 * Uses CSS Grid for efficient, native grid layout with responsive column counts.
 */
const Grid = forwardRef<IdealystElement, GridProps>(({
    children,
    columns = 1,
    gap: gapProp = 'md',
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
    style,
    testID,
    id,
    onLayout,
}, ref) => {
    const layoutRef = useWebLayout<HTMLDivElement>(onLayout);
    const breakpoint = useBreakpoint();

    const resolvedColumns = useMemo(
        () => resolveColumns(columns, breakpoint),
        [columns, breakpoint]
    );

    gridStyles.useVariants({
        gap: gapProp,
        padding,
        paddingVertical,
        paddingHorizontal,
        margin,
        marginVertical,
        marginHorizontal,
    });

    const webProps = getWebProps(gridStyles.grid);
    const mergedRef = useMergeRefs(ref, webProps.ref, layoutRef);

    const gridTemplateColumns = `repeat(${resolvedColumns}, 1fr)`;

    return (
        <div
            {...webProps}
            ref={mergedRef as any}
            id={id}
            data-testid={testID}
            style={{
                ...flattenStyle(style),
                gridTemplateColumns,
            }}
        >
            {children}
        </div>
    );
});

Grid.displayName = 'Grid';

export default Grid;
