/**
 * TabBar Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    items: [
      { value: 'tab1', label: 'Tab 1' },
      { value: 'tab2', label: 'Tab 2' },
      { value: 'tab3', label: 'Tab 3' },
    ],
    defaultValue: 'tab1',
  },
};
