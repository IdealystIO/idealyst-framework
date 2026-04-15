/**
 * GaugeChart Core Renderer
 *
 * Shared rendering logic for the gauge — platform wrappers provide
 * hover state and the outer interaction layer.
 */

import React, { useMemo } from 'react';
import {
  useChart,
  useRenderer,
} from '../../components/ChartContainer';
import { generateArcPath } from '../../core/path/arc';
import { useChartAnimation } from '../../hooks/useChartAnimation';
import type { GaugeChartProps } from './types';

// The gauge spans 180°: left (9 o'clock) to right (3 o'clock).
const GAUGE_START = Math.PI;
const GAUGE_END = 2 * Math.PI;
const GAUGE_SWEEP = GAUGE_END - GAUGE_START;

const HOVER_EXPAND = 3;

/**
 * Generate SVG path data for a needle triangle.
 */
function buildNeedlePath(
  cx: number,
  cy: number,
  angle: number,
  length: number,
  baseWidth: number,
): string {
  const tipX = cx + length * Math.cos(angle);
  const tipY = cy + length * Math.sin(angle);

  const perpAngle = angle + Math.PI / 2;
  const halfBase = baseWidth / 2;

  const bLX = cx + halfBase * Math.cos(perpAngle);
  const bLY = cy + halfBase * Math.sin(perpAngle);
  const bRX = cx - halfBase * Math.cos(perpAngle);
  const bRY = cy - halfBase * Math.sin(perpAngle);

  return `M ${tipX} ${tipY} L ${bLX} ${bLY} L ${bRX} ${bRY} Z`;
}

/** Segment arc data used by both rendering and hit detection */
export interface SegmentArc {
  d: string;
  dExpanded: string;
  color: string;
  startAngle: number;
  endAngle: number;
}

export interface GaugeLayout {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
}

export interface GaugeChartCoreProps extends GaugeChartProps {
  /** Currently hovered segment index (null = none) */
  hoveredSegment: number | null;
}

/**
 * Core gauge renderer — used within ChartContainer context.
 * Does NOT render any platform-specific wrapper (div/View).
 */
export const GaugeChartCore: React.FC<GaugeChartCoreProps> = ({
  value,
  segments,
  arcThickness = 32,
  cornerRadius = 4,
  segmentGap = 2,
  needleColor = '#1e293b',
  backgroundColor,
  formattedValue,
  valueColor,
  title,
  subtitle,
  hoveredSegment,
  animate = true,
  animationDuration = 750,
}) => {
  const { width, height } = useChart();
  const { renderer } = useRenderer();
  const { Canvas, Group, Path, Circle, Text } = renderer;

  const { progress } = useChartAnimation({
    enabled: animate,
    duration: animationDuration,
    easing: 'easeOut',
  });

  const clampedValue = Math.max(0, Math.min(1, value));
  const animatedValue = clampedValue * progress;

  // Layout
  const titleSpace = title ? 24 : 0;
  const footerSpace = (subtitle) ? 28 : 0;
  const valueSpace = formattedValue ? 8 : 0;

  const availableHeight = height - titleSpace - footerSpace - valueSpace;
  const outerRadius = Math.min(width / 2, availableHeight) - 4;
  const innerRadius = outerRadius - arcThickness;

  const cx = width / 2;
  const cy = titleSpace + outerRadius + 4;

  const padAngle = (segmentGap * Math.PI) / 180;

  // Segment arcs
  const segmentData = useMemo((): SegmentArc[] => {
    const totalValue = segments.reduce((sum, s) => sum + s.value, 0);
    const result: SegmentArc[] = [];

    let currentAngle = GAUGE_START;
    for (const segment of segments) {
      const proportion = totalValue > 0 ? segment.value / totalValue : 0;
      const sweepAngle = proportion * GAUGE_SWEEP;
      const endAngle = currentAngle + sweepAngle;

      const arcConfig = {
        startAngle: currentAngle,
        endAngle,
        innerRadius,
        outerRadius,
        cornerRadius,
        padAngle,
      };

      result.push({
        d: generateArcPath(cx, cy, arcConfig),
        dExpanded: generateArcPath(cx, cy, {
          ...arcConfig,
          innerRadius: innerRadius - HOVER_EXPAND,
          outerRadius: outerRadius + HOVER_EXPAND,
        }),
        color: segment.color,
        startAngle: currentAngle,
        endAngle,
      });
      currentAngle = endAngle;
    }

    return result;
  }, [segments, cx, cy, innerRadius, outerRadius, cornerRadius, padAngle]);

  // Background arc
  const backgroundPath = useMemo(() => {
    if (!backgroundColor) return null;
    return generateArcPath(cx, cy, {
      startAngle: GAUGE_START,
      endAngle: GAUGE_END,
      innerRadius,
      outerRadius,
      cornerRadius,
    });
  }, [backgroundColor, cx, cy, innerRadius, outerRadius, cornerRadius]);

  // Needle
  const needleAngle = GAUGE_START + animatedValue * GAUGE_SWEEP;
  const needlePath = buildNeedlePath(cx, cy, needleAngle, innerRadius - 6, 8);

  return (
    <Canvas
      width={width}
      height={height}
      accessibilityLabel={`Gauge showing ${Math.round(clampedValue * 100)}%`}
    >
      {title && (
        <Text
          x={16}
          y={16}
          fontSize={14}
          fontWeight="bold"
          fill="#1e293b"
          textAnchor="start"
          dominantBaseline="auto"
        >
          {title}
        </Text>
      )}

      {formattedValue && (
        <Text
          x={width - 16}
          y={16}
          fontSize={20}
          fontWeight="bold"
          fill={valueColor ?? '#ef4444'}
          textAnchor="end"
          dominantBaseline="auto"
        >
          {formattedValue}
        </Text>
      )}

      <Group x={0} y={0}>
        {backgroundPath && (
          <Path d={backgroundPath} fill={backgroundColor!} stroke="none" opacity={0.15} />
        )}

        {segmentData.map((seg, i) => (
          <Path
            key={i}
            d={hoveredSegment === i ? seg.dExpanded : seg.d}
            fill={seg.color}
            stroke="none"
            opacity={progress}
          />
        ))}

        <Path d={needlePath} fill={needleColor} stroke="none" />
        <Circle cx={cx} cy={cy} r={6} fill={needleColor} />
      </Group>

      {subtitle && (
        <Text
          x={cx}
          y={cy + 20}
          fontSize={12}
          fill="#64748b"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          {subtitle}
        </Text>
      )}
    </Canvas>
  );
};

/**
 * Compute layout values needed by both core and platform wrappers
 * for hit detection.
 */
export function useGaugeLayout(props: {
  width: number;
  height: number;
  arcThickness: number;
  title?: string;
  subtitle?: string;
  formattedValue?: string;
}): GaugeLayout {
  const { width, height, arcThickness, title, subtitle, formattedValue } = props;

  const titleSpace = title ? 24 : 0;
  const footerSpace = subtitle ? 28 : 0;
  const valueSpace = formattedValue ? 8 : 0;

  const availableHeight = height - titleSpace - footerSpace - valueSpace;
  const outerRadius = Math.min(width / 2, availableHeight) - 4;
  const innerRadius = outerRadius - arcThickness;

  return {
    cx: width / 2,
    cy: titleSpace + outerRadius + 4,
    innerRadius,
    outerRadius,
  };
}

export { GAUGE_START, GAUGE_SWEEP, HOVER_EXPAND };
