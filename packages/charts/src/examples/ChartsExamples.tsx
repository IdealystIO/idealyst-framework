/**
 * Charts Examples
 *
 * Demonstrates @idealyst/charts usage with LineChart and BarChart components,
 * now backed by D3 under the hood.
 */

import React, { useState } from 'react';
import {
  Screen,
  View,
  Text,
  Button,
  Card,
  Divider,
} from '@idealyst/components';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { GaugeChart } from '../charts/GaugeChart';
import type { ChartDataSeries, CurveType, TooltipContext, ReferenceLine, GaugeSegment } from '../types';

// =============================================================================
// Sample Data
// =============================================================================

const revenueData: ChartDataSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    intent: 'primary',
    data: [
      { x: 'Jan', y: 42 },
      { x: 'Feb', y: 58 },
      { x: 'Mar', y: 45 },
      { x: 'Apr', y: 72 },
      { x: 'May', y: 68 },
      { x: 'Jun', y: 89 },
      { x: 'Jul', y: 95 },
      { x: 'Aug', y: 82 },
      { x: 'Sep', y: 76 },
      { x: 'Oct', y: 104 },
      { x: 'Nov', y: 98 },
      { x: 'Dec', y: 120 },
    ],
  },
  {
    id: 'expenses',
    name: 'Expenses',
    intent: 'danger',
    data: [
      { x: 'Jan', y: 35 },
      { x: 'Feb', y: 40 },
      { x: 'Mar', y: 38 },
      { x: 'Apr', y: 45 },
      { x: 'May', y: 50 },
      { x: 'Jun', y: 55 },
      { x: 'Jul', y: 58 },
      { x: 'Aug', y: 52 },
      { x: 'Sep', y: 48 },
      { x: 'Oct', y: 60 },
      { x: 'Nov', y: 62 },
      { x: 'Dec', y: 70 },
    ],
  },
];

const quarterlyData: ChartDataSeries[] = [
  {
    id: 'sales',
    name: 'Sales ($K)',
    intent: 'primary',
    data: [
      { x: 'Q1', y: 145 },
      { x: 'Q2', y: 229 },
      { x: 'Q3', y: 253 },
      { x: 'Q4', y: 324 },
    ],
  },
];

const groupedData: ChartDataSeries[] = [
  {
    id: '2024',
    name: '2024',
    intent: 'secondary',
    data: [
      { x: 'Q1', y: 100 },
      { x: 'Q2', y: 150 },
      { x: 'Q3', y: 130 },
      { x: 'Q4', y: 180 },
    ],
  },
  {
    id: '2025',
    name: '2025',
    intent: 'primary',
    data: [
      { x: 'Q1', y: 145 },
      { x: 'Q2', y: 229 },
      { x: 'Q3', y: 253 },
      { x: 'Q4', y: 324 },
    ],
  },
];

const revenueReferenceLines: ReferenceLine[] = [
  {
    value: 80,
    axis: 'y',
    label: 'Revenue Target',
    color: '#16a34a',
    strokeStyle: 'dashed',
    labelPosition: 'end',
  },
  {
    value: 50,
    axis: 'y',
    label: 'Break-Even',
    color: '#ca8a04',
    strokeStyle: 'dotted',
    labelPosition: 'end',
  },
  {
    value: 'Jul',
    axis: 'x',
    label: 'H2 Start',
    color: '#9333ea',
    strokeStyle: 'dashed',
    labelPosition: 'start',
  },
];

const salesReferenceLines: ReferenceLine[] = [
  {
    value: 250,
    axis: 'y',
    label: 'Annual Target',
    color: '#dc2626',
    strokeStyle: 'dashed',
  },
];

const bonusSegments: GaugeSegment[] = [
  { value: 0.33, color: '#ef4444' },  // Red — poor
  { value: 0.34, color: '#f59e0b' },  // Yellow — fair
  { value: 0.33, color: '#22c55e' },  // Green — good
];

const healthSegments: GaugeSegment[] = [
  { value: 0.2, color: '#ef4444' },
  { value: 0.2, color: '#f97316' },
  { value: 0.2, color: '#eab308' },
  { value: 0.2, color: '#84cc16' },
  { value: 0.2, color: '#22c55e' },
];

const curveOptions: CurveType[] = [
  'linear',
  'monotone',
  'cardinal',
  'step',
  'basis',
];

// =============================================================================
// Component
// =============================================================================

export function ChartsExamples() {
  const [selectedCurve, setSelectedCurve] = useState<CurveType>('monotone');
  const [showArea, setShowArea] = useState(false);
  const [showDots, setShowDots] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  const resetAnimations = () => setAnimKey((k) => k + 1);

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header */}
        <View gap="sm">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View gap="xs">
              <Text typography="h3">Charts</Text>
              <Text color="secondary">
                Powered by D3 scales and shape generators under the hood
              </Text>
            </View>
            <Button
              size="sm"
              type="outlined"
              leftIcon="refresh"
              onPress={resetAnimations}
            >
              Reset Animations
            </Button>
          </View>
        </View>

        {/* Line Chart */}
        <Card padding="md" gap="md">
          <Text typography="h5" weight="bold">Revenue vs Expenses</Text>
          <Text typography="caption" color="secondary">
            Monthly comparison with {selectedCurve} interpolation — hover to see values
          </Text>

          <LineChart
            key={`line-${animKey}`}
            data={revenueData}
            height={280}
            curve={selectedCurve}
            showDots={showDots}
            showArea={showArea}
            areaOpacity={0.12}
            animate
            animationDuration={750}
            showGrid
            showTooltip
            referenceLines={revenueReferenceLines}
            tooltip={{
              renderContent: (ctx: TooltipContext) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6 }}>{ctx.label}</div>
                  {ctx.entries.map((entry) => (
                    <div key={entry.seriesIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: entry.color }} />
                        <span style={{ fontSize: 12, opacity: 0.8 }}>{entry.series.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${entry.point.y}K</span>
                    </div>
                  ))}
                </div>
              ),
            }}
            yAxis={{ tickFormat: (v) => `$${v}K` }}
          />

          {/* Curve selector */}
          <View gap="sm">
            <Text typography="caption" weight="semibold">Curve Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {curveOptions.map((curve) => (
                <Button
                  key={curve}
                  size="sm"
                  type={selectedCurve === curve ? 'contained' : 'outlined'}
                  onPress={() => setSelectedCurve(curve)}
                >
                  {curve}
                </Button>
              ))}
            </View>
          </View>

          {/* Toggles */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              size="sm"
              type={showArea ? 'contained' : 'outlined'}
              onPress={() => setShowArea(!showArea)}
              leftIcon="chart-areaspline"
            >
              Area Fill
            </Button>
            <Button
              size="sm"
              type={showDots ? 'contained' : 'outlined'}
              onPress={() => setShowDots(!showDots)}
              leftIcon="circle-outline"
            >
              Data Points
            </Button>
          </View>
        </Card>

        <Divider />

        {/* Bar Chart */}
        <Card padding="md" gap="md">
          <Text typography="h5" weight="bold">Quarterly Sales</Text>
          <Text typography="caption" color="secondary">
            Single series bar chart with staggered animation — hover bars to see values
          </Text>

          <BarChart
            key={`bar-${animKey}`}
            data={quarterlyData}
            height={250}
            animate
            animationDuration={400}
            showGrid
            showTooltip
            referenceLines={salesReferenceLines}
            yAxis={{ tickFormat: (v) => `$${v}K` }}
          />
        </Card>

        {/* Grouped Bar Chart */}
        <Card padding="md" gap="md">
          <Text typography="h5" weight="bold">Year-over-Year Comparison</Text>
          <Text typography="caption" color="secondary">
            Grouped bar chart comparing 2024 vs 2025
          </Text>

          <BarChart
            key={`grouped-${animKey}`}
            data={groupedData}
            height={250}
            grouped
            animate
            showGrid
            showTooltip
            showLegend
            yAxis={{ tickFormat: (v) => `$${v}K` }}
          />
        </Card>

        <Divider />

        {/* Gauge Charts */}
        <Card padding="md" gap="md">
          <Text typography="h5" weight="bold">Gauge Meters</Text>
          <Text typography="caption" color="secondary">
            180-degree arc meters with colored segments and animated needle
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <View style={{ flex: 1, minWidth: 220 }}>
              <GaugeChart
                key={`gauge1-${animKey}`}
                value={0.12}
                segments={bonusSegments}
                title="Bonus Tracker"
                formattedValue="12%"
                valueColor="#ef4444"
                subtitle="Pace: 1.6 Feet/day \u00B7 Projected: 23 Feet"
                height={200}
                animate
              />
            </View>
            <View style={{ flex: 1, minWidth: 220 }}>
              <GaugeChart
                key={`gauge2-${animKey}`}
                value={0.72}
                segments={healthSegments}
                title="System Health"
                formattedValue="72%"
                valueColor="#22c55e"
                subtitle="All services operational"
                height={200}
                arcThickness={20}
                animate
              />
            </View>
          </View>
        </Card>

        {/* Info Card */}
        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">About @idealyst/charts</Text>
          <Text color="secondary">
            Charts use a renderer abstraction layer with SVG on web and
            react-native-svg on native. The math layer (scales, curves, arcs)
            is powered by D3 modules — d3-scale, d3-shape, and d3-array —
            all pure JavaScript with zero DOM dependencies.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

export default ChartsExamples;
