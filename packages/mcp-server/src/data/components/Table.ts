export const Table = {
  category: "data",
  description: "Data table component for displaying structured tabular data",
  props: `
- \`columns\`: TableColumn<T>[] - Column definitions
  - \`key\`: string - Unique column key
  - \`title\`: string - Column header title
  - \`dataIndex\`: string - Key in data object (optional)
  - \`render\`: (value, row, index) => ReactNode - Custom cell renderer
  - \`width\`: number | string - Column width
  - \`align\`: 'left' | 'center' | 'right' - Text alignment
- \`data\`: T[] - Array of data objects
- \`variant\`: 'default' | 'bordered' | 'striped' - Visual style
- \`size\`: 'small' | 'medium' | 'large' - Cell padding/size
- \`stickyHeader\`: boolean - Keep header fixed on scroll
- \`onRowPress\`: (row: T, index: number) => void - Row click handler
- \`style\`: ViewStyle - Additional styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Column-based configuration",
    "Custom cell renderers",
    "Three visual variants",
    "Three sizes",
    "Sticky header support",
    "Row click handling",
    "Column alignment",
    "Custom column widths",
  ],
  bestPractices: [
    "Use render function for complex cell content",
    "Enable stickyHeader for long tables",
    "Use 'striped' variant for better readability",
    "Set column widths for important columns",
    "Keep column count reasonable for mobile",
    "Use appropriate size for data density",
  ],
  usage: `
import { Table } from '@idealyst/components';

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  {
    key: 'status',
    title: 'Status',
    render: (_, row) => <Badge>{row.status}</Badge>,
  },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
];

<Table columns={columns} data={data} variant="striped" />
`,
  examples: {
    basic: `import { Table } from '@idealyst/components';

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id' },
  { key: 'name', title: 'Name', dataIndex: 'name' },
];

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

<Table columns={columns} data={data} />`,

    variants: `import { Table, View } from '@idealyst/components';

const columns = [{ key: 'name', title: 'Name', dataIndex: 'name' }];
const data = [{ name: 'Test' }];

<View spacing="md">
  <Table columns={columns} data={data} variant="default" />
  <Table columns={columns} data={data} variant="bordered" />
  <Table columns={columns} data={data} variant="striped" />
</View>`,

    "with-icons": `import { Table, Badge, Icon, View, Text } from '@idealyst/components';

const columns = [
  {
    key: 'user',
    title: 'User',
    render: (_, row) => (
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Icon name="account-circle" size="sm" />
        <Text>{row.name}</Text>
      </View>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (_, row) => (
      <Badge color={row.active ? 'green' : 'gray'}>
        {row.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];

<Table columns={columns} data={users} />`,

    interactive: `import { Table, Button, View, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [selected, setSelected] = useState(null);

  const columns = [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
    { key: 'product', title: 'Product', dataIndex: 'name' },
    { key: 'price', title: 'Price', dataIndex: 'price', align: 'right' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <Button
          size="small"
          variant="outlined"
          onPress={() => setSelected(row)}
        >
          View
        </Button>
      ),
    },
  ];

  const data = [
    { id: 1, name: 'Product A', price: '$29.99' },
    { id: 2, name: 'Product B', price: '$49.99' },
  ];

  return (
    <View spacing="md">
      <Table
        columns={columns}
        data={data}
        variant="bordered"
        onRowPress={(row) => setSelected(row)}
      />
      {selected && <Text>Selected: {selected.name}</Text>}
    </View>
  );
}`,
  },
};
