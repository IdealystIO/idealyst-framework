/**
 * BarChart Component
 *
 * Renders bar charts with support for grouping, stacking, and both orientations.
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
import { useBarChart } from './useBarChart';
import { useStaggeredAnimation } from '../../hooks/useChartAnimation';
import type { BarChartProps } from './types';
import type { ChartDataSeries } from '../../types';

/**
 * Internal bar chart renderer (used within ChartContainer context)
 */
const BarChartInner: React.FC<
  BarChartProps & { data: ChartDataSeries[] }
> = ({
  data,
  orientation = 'vertical',
  grouped = false,
  stacked = false,
  barRadius = 4,
  barPadding = 0.2,
  groupPadding = 0.1,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  xAxis,
  yAxis,
  animate = true,
  animationDuration = 300,
  onBarPress,
}) => {
  const { width, height, padding, innerWidth, innerHeight } = useChart();
  const { renderer } = useRenderer();
  const { Canvas, Group, Rect } = renderer;

  // Get theme for colors
  let theme: Theme | undefined;
  try {
    const unistyles = useUnistyles();
    theme = unistyles.theme as Theme;
  } catch {
    // Not in Unistyles context
  }

  // Process data
  const { barData, categoryScale, valueScale } = useBarChart({
    data,
    innerWidth,
    innerHeight,
    orientation,
    grouped,
    stacked,
    barPadding,
    groupPadding,
    theme,
  });

  // Count total bars for stagger animation
  const totalBars = useMemo(() => {
    return barData.reduce((sum, series) => sum + series.bars.length, 0);
  }, [barData]);

  // Staggered animation for bars
  const { getItemProgress } = useStaggeredAnimation({
    enabled: animate,
    duration: animationDuration,
    itemCount: totalBars,
    staggerDelay: 50,
    maxStaggerDuration: 500,
    easing: 'easeOut',
  });

  // Determine which scale goes on which axis
  const xScale = orientation === 'vertical' ? categoryScale : valueScale;
  const yScale = orientation === 'vertical' ? valueScale : categoryScale;

  // Handle bar press
  const handleBarPress = useCallback(
    (seriesIndex: number, pointIndex: number) => {
      if (onBarPress) {
        const series = data[seriesIndex];
        const point = series.data[pointIndex];
        onBarPress(point, seriesIndex, pointIndex);
      }
    },
    [data, onBarPress]
  );

  // Calculate animated bar dimensions
  const getAnimatedBarProps = (
    bar: { x: number; y: number; width: number; height: number },
    globalBarIndex: number,
    isVertical: boolean
  ) => {
    const progress = getItemProgress(globalBarIndex);

    if (isVertical) {
      // Grow from bottom
      const animatedHeight = bar.height * progress;
      return {
        x: bar.x,
        y: bar.y + (bar.height - animatedHeight),
        width: bar.width,
        height: animatedHeight,
      };
    } else {
      // Grow from left
      const animatedWidth = bar.width * progress;
      return {
        x: bar.x,
        y: bar.y,
        width: animatedWidth,
        height: bar.height,
      };
    }
  };

  // Track global bar index for stagger
  let globalBarIndex = 0;

  return (
    <Canvas
      width={width}
      height={height}
      accessibilityLabel={`Bar chart with ${data.length} series`}
    >
      {/* Chart area with padding offset */}
      <Group x={padding.left} y={padding.top}>
        {/* Grid lines */}
        {showGrid && (
          <GridLines
            scale={orientation === 'vertical' ? valueScale : categoryScale}
            width={innerWidth}
            height={innerHeight}
            direction={orientation === 'vertical' ? 'horizontal' : 'vertical'}
            count={5}
          />
        )}

        {/* Bars with staggered entrance animation */}
        {barData.map((seriesData) =>
          seriesData.bars.map((bar) => {
            const currentIndex = globalBarIndex++;
            const animatedProps = getAnimatedBarProps(
              bar,
              currentIndex,
              orientation === 'vertical'
            );

            return (
              <Rect
                key={`bar-${seriesData.seriesIndex}-${bar.pointIndex}`}
                x={animatedProps.x}
                y={animatedProps.y}
                width={Math.max(0, animatedProps.width)}
                height={Math.max(0, animatedProps.height)}
                fill={seriesData.color}
                rx={barRadius}
                ry={barRadius}
              />
            );
          })
        )}

        {/* X Axis */}
        {showXAxis && (
          <XAxis
            scale={xScale}
            y={innerHeight}
            length={innerWidth}
            tickCount={orientation === 'vertical' ? undefined : 5}
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
            tickCount={orientation === 'vertical' ? 5 : undefined}
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
 * BarChart Component
 *
 * @example
 * ```tsx
 * // Simple bar chart
 * <BarChart
 *   data={[
 *     {
 *       id: 'sales',
 *       name: 'Sales',
 *       intent: 'primary',
 *       data: [
 *         { x: 'Jan', y: 100 },
 *         { x: 'Feb', y: 150 },
 *         { x: 'Mar', y: 120 },
 *       ],
 *     },
 *   ]}
 *   height={300}
 * />
 *
 * // Grouped bar chart
 * <BarChart
 *   data={[
 *     { id: '2023', name: '2023', intent: 'primary', data: [...] },
 *     { id: '2024', name: '2024', intent: 'success', data: [...] },
 *   ]}
 *   grouped
 *   showLegend
 * />
 *
 * // Stacked bar chart
 * <BarChart
 *   data={[...]}
 *   stacked
 * />
 *
 * // Horizontal bar chart
 * <BarChart
 *   data={[...]}
 *   orientation="horizontal"
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
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
      <BarChartInner data={data} {...chartProps} />
    </ChartContainer>
  );
};

export default BarChart;
