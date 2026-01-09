/**
 * TextArea Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    placeholder: 'Enter text...',
    rows: 3,
  },
  state: {
    value: {
      initial: '',
      onChangeProp: 'onChange',
    },
  },
};
