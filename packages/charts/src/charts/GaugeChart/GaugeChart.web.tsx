/**
 * GaugeChart — Web
 *
 * Adds mouse hover interaction for segment scale effect.
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  ChartContainer,
  useChart,
} from '../../components/ChartContainer';
import { generateArcPath } from '../../core/path/arc';
import {
  GaugeChartCore,
  useGaugeLayout,
  GAUGE_START,
  GAUGE_SWEEP,
  HOVER_EXPAND,
} from './GaugeChartCore';
import type { GaugeChartProps } from './types';

const GaugeChartWebInner: React.FC<GaugeChartProps> = (props) => {
  const {
    segments,
    arcThickness = 32,
    cornerRadius = 4,
    segmentGap = 2,
    title,
    subtitle,
    formattedValue,
    renderFooter,
  } = props;

  const { width, height } = useChart();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const layout = useGaugeLayout({
    width,
    height,
    arcThickness,
    title,
    subtitle,
    formattedValue,
  });

  const padAngle = (segmentGap * Math.PI) / 180;

  // Pre-compute angle ranges for hit detection
  const segmentAngles = useMemo(() => {
    const totalValue = segments.reduce((sum, s) => sum + s.value, 0);
    const result: Array<{ startAngle: number; endAngle: number }> = [];

    let currentAngle = GAUGE_START;
    for (const segment of segments) {
      const proportion = totalValue > 0 ? segment.value / totalValue : 0;
      const endAngle = currentAngle + proportion * GAUGE_SWEEP;
      result.push({ startAngle: currentAngle, endAngle });
      currentAngle = endAngle;
    }
    return result;
  }, [segments]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - layout.cx;
    const mouseY = e.clientY - rect.top - layout.cy;

    const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    if (dist < layout.innerRadius - HOVER_EXPAND || dist > layout.outerRadius + HOVER_EXPAND) {
      setHoveredSegment(null);
      return;
    }

    let angle = Math.atan2(mouseY, mouseX);
    if (angle < 0) angle += 2 * Math.PI;

    for (let i = 0; i < segmentAngles.length; i++) {
      if (angle >= segmentAngles[i].startAngle && angle <= segmentAngles[i].endAngle) {
        setHoveredSegment(i);
        return;
      }
    }
    setHoveredSegment(null);
  }, [layout, segmentAngles]);

  const handleMouseLeave = useCallback(() => {
    setHoveredSegment(null);
  }, []);

  return (
    <>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: hoveredSegment !== null ? 'pointer' : 'default',
        }}
      >
        <GaugeChartCore {...props} hoveredSegment={hoveredSegment} />
      </div>

      {renderFooter && (
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}>
          {renderFooter()}
        </div>
      )}
    </>
  );
};

/**
 * GaugeChart Component
 *
 * A 180° semicircular meter with colored segments and a needle indicator.
 *
 * @example
 * ```tsx
 * <GaugeChart
 *   value={0.12}
 *   segments={[
 *     { value: 0.33, color: '#ef4444' },
 *     { value: 0.33, color: '#f59e0b' },
 *     { value: 0.34, color: '#22c55e' },
 *   ]}
 *   formattedValue="12%"
 *   title="Bonus Tracker"
 *   animate
 * />
 * ```
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  width,
  height,
  intent = 'primary',
  size = 'md',
  renderer,
  testID,
  ...gaugeProps
}) => {
  return (
    <ChartContainer
      width={width}
      height={height ?? 200}
      padding={0}
      intent={intent}
      size={size}
      renderer={renderer}
      testID={testID}
    >
      <GaugeChartWebInner {...gaugeProps} />
    </ChartContainer>
  );
};

export default GaugeChart;
