# Table Component

A simple, enhanced HTML table component for displaying tabular data. For complex data grids with sorting, filtering, and pagination, use the `@idealyst/datagrid` package.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Three variants (default, bordered, striped)
- ✅ Multiple sizes (small, medium, large)
- ✅ Custom cell rendering
- ✅ Column alignment (left, center, right)
- ✅ Fixed column widths
- ✅ Clickable rows
- ✅ Sticky header (web)
- ✅ TypeScript support with generics
- ✅ Accessible with proper table semantics

## Basic Usage

```tsx
import { Table } from '@idealyst/components';
import type { TableColumn } from '@idealyst/components';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

<Table columns={columns} data={data} />
```

## Props

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn<T>[]` | **Required** | Column definitions |
| `data` | `T[]` | **Required** | Data array |
| `variant` | `'default' \| 'bordered' \| 'striped'` | `'default'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size |
| `stickyHeader` | `boolean` | `false` | Sticky header (web only) |
| `onRowPress` | `(row: T, index: number) => void` | - | Row click handler |
| `style` | `ViewStyle` | - | Custom styles |
| `testID` | `string` | - | Test identifier |

### TableColumn Type

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique column key |
| `title` | `string` | Column header text |
| `dataIndex` | `string` | Data property to display |
| `render` | `(value, row, index) => ReactNode` | Custom cell renderer |
| `width` | `number \| string` | Column width |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |

## Common Patterns

### Custom Cell Rendering
```tsx
const columns: TableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (status) => (
      <Badge color={status === 'active' ? 'success' : 'neutral'}>
        {status}
      </Badge>
    ),
  },
];
```

### With Actions
```tsx
const columns: TableColumn<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  {
    key: 'actions',
    title: 'Actions',
    render: (_, user) => (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button size="small" onPress={() => editUser(user)}>Edit</Button>
        <Button size="small" intent="error" onPress={() => deleteUser(user)}>Delete</Button>
      </View>
    ),
  },
];
```

### Clickable Rows
```tsx
<Table
  columns={columns}
  data={users}
  onRowPress={(user) => navigate(`/users/${user.id}`)}
/>
```

### Column Alignment & Width
```tsx
const columns: TableColumn<Product>[] = [
  { key: 'name', title: 'Product', dataIndex: 'name', align: 'left' },
  { key: 'price', title: 'Price', dataIndex: 'price', align: 'right', width: '120px' },
  { key: 'stock', title: 'Stock', dataIndex: 'stock', align: 'center', width: '100px' },
];
```

## Best Practices

1. **Use for simple tables** - For complex data grids, use `@idealyst/datagrid`
2. **Type safety** - Use TypeScript generics for type-safe columns and data
3. **Custom rendering** - Use `render` for badges, buttons, and formatted content
4. **Fixed widths** - Set column widths for consistent layout
5. **Clickable rows** - Use `onRowPress` for row selection
6. **Accessible** - Proper table semantics are built-in

## Table vs DataGrid

Use **Table** when:
- Displaying simple, static data
- No sorting, filtering, or pagination needed
- Small to medium datasets (< 100 rows)
- Basic presentation

Use **@idealyst/datagrid** when:
- Large datasets (100+ rows)
- Need sorting, filtering, pagination
- Virtual scrolling required
- Advanced features like row selection, inline editing

## Accessibility

- Proper `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` semantics (web)
- Screen reader compatible
- Keyboard navigation
- Touch-friendly row heights
