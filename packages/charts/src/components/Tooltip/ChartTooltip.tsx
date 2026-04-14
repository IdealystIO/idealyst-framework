/**
 * ChartTooltip
 *
 * A single floating tooltip that shows all series values at the hovered X column.
 * Measures itself to flip/clamp so it never clips outside the chart container.
 * Smoothly animates between positions via CSS transitions.
 */

import React, { useRef, useState, useLayoutEffect } from 'react';
import type { TooltipConfig, TooltipContext } from '../../types';

export interface ChartTooltipProps {
  /** Tooltip context with all series at the hovered X */
  context: TooltipContext | null;
  /** X position in container pixels (absolute left) */
  x: number | null;
  /** Total chart container width */
  chartWidth: number;
  /** Total chart container height */
  chartHeight: number;
  /** Tooltip configuration */
  config?: TooltipConfig;
}

/**
 * Format a data point value for display
 */
function formatValue(value: number | string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}

/**
 * Default tooltip content: shows label header + all series with colored dots
 */
const DefaultTooltipContent: React.FC<{ context: TooltipContext }> = ({ context }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Column label */}
      <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, marginBottom: 2 }}>
        {context.label}
      </div>
      {/* Series entries */}
      {context.entries.map((entry) => (
        <div
          key={entry.seriesIndex}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: entry.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              {entry.series.name || entry.series.id}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {formatValue(entry.point.y)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  context,
  x,
  chartWidth,
  chartHeight,
  config,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Measure tooltip after render so we can position correctly
  useLayoutEffect(() => {
    if (tooltipRef.current && context) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      setSize({ w: width, h: height });
    }
  }, [context]);

  if (!context || x === null) return null;

  const offset = config?.offset ?? 12;

  // Horizontal: prefer right of column, flip left if it would overflow
  const rightEdge = x + offset + size.w;
  const left = rightEdge <= chartWidth
    ? x + offset
    : x - offset - size.w;

  // Vertical: center in chart, clamp to stay within bounds
  const idealTop = (chartHeight - size.h) / 2;
  const top = Math.max(4, Math.min(idealTop, chartHeight - size.h - 4));

  const content = config?.renderContent
    ? config.renderContent(context)
    : <DefaultTooltipContent context={context} />;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        left,
        top,
        pointerEvents: 'none',
        zIndex: 10,
        // Visual style
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontSize: 12,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#1a1a1a',
        whiteSpace: 'nowrap' as const,
        // Smooth animation between columns
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
      }}
    >
      {content}
    </div>
  );
};
