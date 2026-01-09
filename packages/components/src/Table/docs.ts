/**
 * Table Documentation Sample Props
 */

import type { SampleProps } from '@idealyst/tooling';

export const sampleProps: SampleProps = {
  props: {
    columns: [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      { key: 'role', title: 'Role', dataIndex: 'role' },
      { key: 'status', title: 'Status', dataIndex: 'status' },
    ],
    data: [
      { name: 'Alice', role: 'Developer', status: 'Active' },
      { name: 'Bob', role: 'Designer', status: 'Active' },
      { name: 'Charlie', role: 'Manager', status: 'Away' },
    ],
  },
};
