/**
 * Select Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
    ],
    placeholder: 'Select an option',
  },
  state: {
    value: {
      initial: '',
      onChangeProp: 'onValueChange',
    },
  },
};
