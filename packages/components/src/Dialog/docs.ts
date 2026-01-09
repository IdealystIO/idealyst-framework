/**
 * Dialog Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    title: 'Dialog Title',
  },
  children: 'Dialog content goes here. Click the X or backdrop to close.',
  state: {
    open: {
      initial: true,
      onChangeProp: 'onOpenChange',
    },
  },
};
