/**
 * Input Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    placeholder: 'Enter text...',
  },
  state: {
    value: {
      initial: '',
      onChangeProp: 'onChangeText',
    },
  },
};
