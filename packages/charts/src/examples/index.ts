/**
 * Chart Examples
 *
 * Example components demonstrating chart usage.
 */

import type { ChartDataSeries } from '../types';

/**
 * Sample data for line chart examples
 */
export const sampleLineChartData: ChartDataSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    intent: 'primary',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 },
      { x: 'Mar', y: 120 },
      { x: 'Apr', y: 180 },
      { x: 'May', y: 160 },
      { x: 'Jun', y: 200 },
    ],
  },
  {
    id: 'expenses',
    name: 'Expenses',
    intent: 'danger',
    data: [
      { x: 'Jan', y: 80 },
      { x: 'Feb', y: 90 },
      { x: 'Mar', y: 85 },
      { x: 'Apr', y: 95 },
      { x: 'May', y: 100 },
      { x: 'Jun', y: 110 },
    ],
  },
];

/**
 * Sample data for bar chart examples
 */
export const sampleBarChartData: ChartDataSeries[] = [
  {
    id: 'sales',
    name: 'Sales',
    intent: 'primary',
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 180 },
      { x: 'Q3', y: 150 },
      { x: 'Q4', y: 220 },
    ],
  },
];

/**
 * Sample data for grouped bar chart
 */
export const sampleGroupedBarData: ChartDataSeries[] = [
  {
    id: '2023',
    name: '2023',
    intent: 'secondary',
    data: [
      { x: 'Q1', y: 100 },
      { x: 'Q2', y: 150 },
      { x: 'Q3', y: 130 },
      { x: 'Q4', y: 180 },
    ],
  },
  {
    id: '2024',
    name: '2024',
    intent: 'primary',
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 180 },
      { x: 'Q3', y: 150 },
      { x: 'Q4', y: 220 },
    ],
  },
];

/**
 * Sample time series data
 */
export const sampleTimeSeriesData: ChartDataSeries[] = [
  {
    id: 'stock',
    name: 'Stock Price',
    intent: 'success',
    data: [
      { x: new Date('2024-01-01'), y: 100 },
      { x: new Date('2024-02-01'), y: 105 },
      { x: new Date('2024-03-01'), y: 98 },
      { x: new Date('2024-04-01'), y: 115 },
      { x: new Date('2024-05-01'), y: 112 },
      { x: new Date('2024-06-01'), y: 125 },
      { x: new Date('2024-07-01'), y: 130 },
      { x: new Date('2024-08-01'), y: 128 },
      { x: new Date('2024-09-01'), y: 140 },
      { x: new Date('2024-10-01'), y: 138 },
      { x: new Date('2024-11-01'), y: 145 },
      { x: new Date('2024-12-01'), y: 155 },
    ],
  },
];

/**
 * Example usage snippets:
 *
 * @example Basic Line Chart with Animation
 * ```tsx
 * import { LineChart } from '@idealyst/charts';
 *
 * <LineChart
 *   data={sampleLineChartData}
 *   height={300}
 *   curve="monotone"
 *   showDots
 *   animate
 *   animationDuration={750}
 * />
 * ```
 *
 * @example Line Chart with Area Fill
 * ```tsx
 * <LineChart
 *   data={sampleTimeSeriesData}
 *   height={300}
 *   curve="monotone"
 *   showArea
 *   areaOpacity={0.15}
 *   animate
 * />
 * ```
 *
 * @example Animated Bar Chart
 * ```tsx
 * import { BarChart } from '@idealyst/charts';
 *
 * <BarChart
 *   data={sampleBarChartData}
 *   height={300}
 *   animate
 *   animationDuration={300}
 * />
 * ```
 *
 * @example Grouped Bar Chart
 * ```tsx
 * <BarChart
 *   data={sampleGroupedBarData}
 *   height={300}
 *   grouped
 *   animate
 * />
 * ```
 *
 * @example Horizontal Bar Chart
 * ```tsx
 * <BarChart
 *   data={sampleBarChartData}
 *   height={300}
 *   orientation="horizontal"
 *   animate
 * />
 * ```
 *
 * @example Disabling Animation
 * ```tsx
 * <LineChart
 *   data={sampleLineChartData}
 *   height={300}
 *   animate={false}
 * />
 * ```
 *
 * @example Custom Animation Duration
 * ```tsx
 * <LineChart
 *   data={sampleLineChartData}
 *   height={300}
 *   animate
 *   animationDuration={1500}  // Slower entrance animation
 * />
 * ```
 */
