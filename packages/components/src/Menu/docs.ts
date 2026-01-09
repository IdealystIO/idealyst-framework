/**
 * Menu Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    items: [
      { id: '1', label: 'Edit' },
      { id: '2', label: 'Duplicate' },
      { id: '3', label: 'Delete', intent: 'error' },
    ],
  },
  children: 'Click for menu',
};
