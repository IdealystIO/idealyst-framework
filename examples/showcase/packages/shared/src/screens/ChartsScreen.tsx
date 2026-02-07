import React, { useState } from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  Select,
  Switch,
} from '@idealyst/components';
import { LineChart, BarChart } from '@idealyst/charts';
import type { ChartDataSeries, CurveType } from '@idealyst/charts';

// Sample data for line chart
const lineChartData: ChartDataSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    intent: 'primary',
    data: [
      { x: 'Jan', y: 120 },
      { x: 'Feb', y: 150 },
      { x: 'Mar', y: 130 },
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
      { x: 'Feb', y: 95 },
      { x: 'Mar', y: 85 },
      { x: 'Apr', y: 100 },
      { x: 'May', y: 110 },
      { x: 'Jun', y: 105 },
    ],
  },
];

// Sample data for bar chart
const barChartData: ChartDataSeries[] = [
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

// Sample data for grouped bar chart
const groupedBarData: ChartDataSeries[] = [
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
    intent: 'success',
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 180 },
      { x: 'Q3', y: 150 },
      { x: 'Q4', y: 220 },
    ],
  },
];

const curveOptions = [
  { label: 'Monotone', value: 'monotone' },
  { label: 'Linear', value: 'linear' },
  { label: 'Step', value: 'step' },
  { label: 'Cardinal', value: 'cardinal' },
];

export const ChartsScreen: React.FC = () => {
  const [curve, setCurve] = useState<CurveType>('monotone');
  const [showDots, setShowDots] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [barOrientation, setBarOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [showGrouped, setShowGrouped] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  // Replay animation by remounting component
  const replayAnimation = () => {
    setChartKey((k) => k + 1);
  };

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="xl">
        {/* Header */}
        <View gap="sm">
          <Text typography="h3">Charts</Text>
          <Text color="secondary">
            Cross-platform animated charts using @idealyst/charts
          </Text>
        </View>

        {/* Line Chart Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="chart-line" size={24} intent="primary" />
            <Text typography="subtitle1">Line Chart</Text>
          </View>

          <Card type="outlined" padding="md" gap="md">
            <Text typography="caption" color="secondary">
              Multi-series line chart with animation and curve options
            </Text>

            {/* Chart */}
            <View style={{ height: 280 }}>
              <LineChart
                key={`line-${chartKey}`}
                data={lineChartData}
                height={260}
                curve={curve}
                showDots={showDots}
                showArea={showArea}
                areaOpacity={0.15}
                animate={animate}
                animationDuration={750}
              />
            </View>

            {/* Controls */}
            <View gap="sm">
              <Select
                label="Curve Type"
                value={curve}
                onChange={(v) => setCurve(v as CurveType)}
                options={curveOptions}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Show Dots</Text>
                <Switch checked={showDots} onChange={setShowDots} intent="primary" />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Show Area Fill</Text>
                <Switch checked={showArea} onChange={setShowArea} intent="primary" />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Animate</Text>
                <Switch checked={animate} onChange={setAnimate} intent="primary" />
              </View>

              <Button
                type="outlined"
                size="sm"
                onPress={replayAnimation}
                leftIcon={<Icon name="refresh" size={16} />}
              >
                Replay Animation
              </Button>
            </View>
          </Card>
        </View>

        {/* Bar Chart Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="chart-bar" size={24} intent="primary" />
            <Text typography="subtitle1">Bar Chart</Text>
          </View>

          <Card type="outlined" padding="md" gap="md">
            <Text typography="caption" color="secondary">
              Bar chart with staggered entrance animation
            </Text>

            {/* Chart */}
            <View style={{ height: 280 }}>
              <BarChart
                key={`bar-${chartKey}-${showGrouped}`}
                data={showGrouped ? groupedBarData : barChartData}
                height={260}
                orientation={barOrientation}
                grouped={showGrouped}
                barRadius={4}
                animate={animate}
                animationDuration={300}
              />
            </View>

            {/* Controls */}
            <View gap="sm">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Horizontal</Text>
                <Switch
                  checked={barOrientation === 'horizontal'}
                  onChange={(v) => setBarOrientation(v ? 'horizontal' : 'vertical')}
                  intent="primary"
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Grouped (Multi-series)</Text>
                <Switch checked={showGrouped} onChange={setShowGrouped} intent="primary" />
              </View>

              <Button
                type="outlined"
                size="sm"
                onPress={replayAnimation}
                leftIcon={<Icon name="refresh" size={16} />}
              >
                Replay Animation
              </Button>
            </View>
          </Card>
        </View>

        {/* Info Section */}
        <View gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="information-outline" size={24} intent="primary" />
            <Text typography="subtitle1">About @idealyst/charts</Text>
          </View>

          <Card type="outlined" padding="md" gap="sm">
            <Text typography="body2">
              Cross-platform animated charting library with dual-renderer architecture:
            </Text>
            <View style={{ paddingLeft: 16 }} gap="xs">
              <Text typography="body2">• SVG renderer for web (default)</Text>
              <Text typography="body2">• Skia renderer for native (GPU-accelerated)</Text>
              <Text typography="body2">• Full animation support with entrance transitions</Text>
              <Text typography="body2">• Theme integration with intent-based colors</Text>
              <Text typography="body2">• Multiple curve types for line charts</Text>
              <Text typography="body2">• Grouped and stacked bar charts</Text>
            </View>
            <Text typography="caption" color="secondary" style={{ marginTop: 8 }}>
              More chart types coming soon: PieChart, AreaChart, ScatterChart, CandlestickChart
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default ChartsScreen;
