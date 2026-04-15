/**
 * GaugeChart — Native
 *
 * No hover interaction on native. Renders the gauge directly.
 */

import React from 'react';
import { View } from '@idealyst/components';
import {
  ChartContainer,
} from '../../components/ChartContainer';
import { GaugeChartCore } from './GaugeChartCore';
import type { GaugeChartProps } from './types';

const GaugeChartNativeInner: React.FC<GaugeChartProps> = (props) => {
  const { renderFooter } = props;

  return (
    <>
      <GaugeChartCore {...props} hoveredSegment={null} />

      {renderFooter && (
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
          {renderFooter()}
        </View>
      )}
    </>
  );
};

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
      <GaugeChartNativeInner {...gaugeProps} />
    </ChartContainer>
  );
};

export default GaugeChart;
