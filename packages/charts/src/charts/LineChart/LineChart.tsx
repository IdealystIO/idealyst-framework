/**
 * LineChart Component
 *
 * Renders line charts with support for multiple series, animations, and interactions.
 */

import React, { useMemo, useCallback } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import type { Theme } from '@idealyst/theme';
import {
  ChartContainer,
  useChart,
  useRenderer,
} from '../../components/ChartContainer';
import { XAxis, YAxis, GridLines } from '../../components/Axis';
import { useLineChart } from './useLineChart';
import { useChartAnimation } from '../../hooks/useChartAnimation';
import type { LineChartProps } from './types';
import type { ChartDataSeries } from '../../types';

/**
 * Internal line chart renderer (used within ChartContainer context)
 */
const LineChartInner: React.FC<
  LineChartProps & { data: ChartDataSeries[] }
> = ({
  data,
  curve = 'monotone',
  strokeWidth = 2,
  showDots = true,
  dotRadius = 4,
  showArea = false,
  areaOpacity = 0.1,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  xAxis,
  yAxis,
  animate = true,
  animationDuration = 750,
  onDataPointPress,
}) => {
  const { width, height, padding, innerWidth, innerHeight } = useChart();
  const { renderer } = useRenderer();
  const { Canvas, Group, Path, Circle, Defs, LinearGradient } = renderer;

  // Get theme for colors
  let theme: Theme | undefined;
  try {
    const unistyles = useUnistyles();
    theme = unistyles.theme as Theme;
  } catch {
    // Not in Unistyles context - use fallback colors
  }

  // Process data
  const { lineData, xScale, yScale } = useLineChart({
    data,
    innerWidth,
    innerHeight,
    curve,
    showArea,
    theme,
  });

  // Animation hook for entrance animation
  const { progress: animationProgress } = useChartAnimation({
    enabled: animate,
    duration: animationDuration,
    easing: 'easeOut',
  });

  // Handle data point press
  const handlePointPress = useCallback(
    (seriesIndex: number, pointIndex: number) => {
      if (onDataPointPress) {
        const series = data[seriesIndex];
        const point = series.data[pointIndex];
        onDataPointPress(point, seriesIndex, pointIndex);
      }
    },
    [data, onDataPointPress]
  );

  return (
    <Canvas
      width={width}
      height={height}
      accessibilityLabel={`Line chart with ${data.length} series`}
    >
      {/* Definitions for gradients */}
      {showArea && (
        <Defs>
          {lineData.map((line) => (
            <LinearGradient
              key={`gradient-${line.seriesIndex}`}
              id={`area-gradient-${line.seriesIndex}`}
              x1={0}
              y1={0}
              x2={0}
              y2={1}
              stops={[
                { offset: 0, color: line.color, opacity: areaOpacity * animationProgress },
                { offset: 1, color: line.color, opacity: 0 },
              ]}
            />
          ))}
        </Defs>
      )}

      {/* Chart area with padding offset */}
      <Group x={padding.left} y={padding.top}>
        {/* Grid lines */}
        {showGrid && (
          <>
            <GridLines
              scale={yScale}
              width={innerWidth}
              height={innerHeight}
              direction="horizontal"
              count={5}
            />
          </>
        )}

        {/* Area fills (rendered first, behind lines) */}
        {showArea &&
          lineData.map((line) =>
            line.areaPath ? (
              <Path
                key={`area-${line.seriesIndex}`}
                d={line.areaPath}
                fill={`url(#area-gradient-${line.seriesIndex})`}
                stroke="none"
                opacity={animationProgress}
              />
            ) : null
          )}

        {/* Lines with draw animation */}
        {lineData.map((line) => (
          <Path
            key={`line-${line.seriesIndex}`}
            d={line.linePath}
            fill="none"
            stroke={line.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            // Draw animation using stroke-dasharray technique
            strokeDasharray={animate ? [line.pathLength, line.pathLength] : undefined}
            strokeDashoffset={animate ? line.pathLength * (1 - animationProgress) : undefined}
          />
        ))}

        {/* Data points with fade-in animation */}
        {showDots &&
          lineData.map((line) =>
            line.points.map((point) => (
              <Circle
                key={`point-${line.seriesIndex}-${point.pointIndex}`}
                cx={point.x}
                cy={point.y}
                r={dotRadius * animationProgress}
                fill={line.color}
                stroke="#ffffff"
                strokeWidth={2}
                opacity={animationProgress}
              />
            ))
          )}

        {/* X Axis */}
        {showXAxis && (
          <XAxis
            scale={xScale}
            y={innerHeight}
            length={innerWidth}
            tickCount={xAxis?.tickCount ?? 5}
            tickFormat={xAxis?.tickFormat}
            label={xAxis?.label}
            showLine={xAxis?.show !== false}
            showTicks={xAxis?.show !== false}
            showLabels={xAxis?.show !== false}
          />
        )}

        {/* Y Axis */}
        {showYAxis && (
          <YAxis
            scale={yScale}
            x={0}
            length={innerHeight}
            position="left"
            tickCount={yAxis?.tickCount ?? 5}
            tickFormat={yAxis?.tickFormat}
            label={yAxis?.label}
            showLine={yAxis?.show !== false}
            showTicks={yAxis?.show !== false}
            showLabels={yAxis?.show !== false}
          />
        )}
      </Group>
    </Canvas>
  );
};

/**
 * LineChart Component
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={[
 *     {
 *       id: 'revenue',
 *       name: 'Revenue',
 *       intent: 'primary',
 *       data: [
 *         { x: 'Jan', y: 100 },
 *         { x: 'Feb', y: 150 },
 *         { x: 'Mar', y: 120 },
 *       ],
 *     },
 *   ]}
 *   height={300}
 *   curve="monotone"
 *   showDots
 *   showArea
 *   animate
 * />
 * ```
 */
export const LineChart: React.FC<LineChartProps> = ({
  data: rawData,
  width,
  height = 300,
  aspectRatio,
  padding,
  intent = 'primary',
  size = 'md',
  renderer,
  testID,
  ...chartProps
}) => {
  // Normalize data to array
  const data = useMemo((): ChartDataSeries[] => {
    if (Array.isArray(rawData)) return rawData;
    return [rawData as ChartDataSeries];
  }, [rawData]);

  return (
    <ChartContainer
      width={width}
      height={height}
      aspectRatio={aspectRatio}
      padding={padding}
      intent={intent}
      size={size}
      renderer={renderer}
      testID={testID}
    >
      <LineChartInner data={data} {...chartProps} />
    </ChartContainer>
  );
};

export default LineChart;
