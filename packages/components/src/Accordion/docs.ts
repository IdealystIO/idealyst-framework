/**
 * Accordion Documentation Sample Props
 *
 * This file defines the sample props needed to render the Accordion component
 * in documentation. These are extracted by the component analyzer.
 */

import type { SampleProps } from '@idealyst/tooling';

/**
 * Sample props for rendering Accordion in documentation.
 * The `items` prop is required for Accordion to render.
 */
export const sampleProps: SampleProps = {
  props: {
    items: [
      { id: '1', title: 'Section 1', content: 'Content for section 1' },
      { id: '2', title: 'Section 2', content: 'Content for section 2' },
      { id: '3', title: 'Section 3', content: 'Content for section 3' },
    ],
  },
};
