/**
 * RadioButton Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    value: 'option1',
    label: 'Option 1',
  },
  state: {
    checked: {
      initial: false,
      onChangeProp: 'onPress',
      toggle: true,
    },
  },
};
