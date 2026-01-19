# @idealyst/datagrid

High-performance, cross-platform datagrid component for React and React Native, built on top of @idealyst/components.

## Features

- 🚀 **Virtualized Rendering** - Powered by react-window for web, native FlatList for mobile
- 📱 **Cross-Platform** - Works seamlessly on React and React Native
- 🎨 **Theme Integration** - Built with @idealyst/theme and Unistyles
- 📊 **Rich Features** - Sorting, selection, custom rendering, and more
- ⚡ **Performance** - Optimized for large datasets with virtualization
- 🔧 **Customizable** - Flexible column configuration and styling

## Installation

```bash
npm install @idealyst/datagrid
# or
yarn add @idealyst/datagrid
```

### Peer Dependencies

This package requires the following peer dependencies:

- `@idealyst/components` - Core component library
- `@idealyst/theme` - Theme system
- `react` >= 16.8.0
- `react-window` (for web virtualization)
- `react-native` >= 0.60.0 (for native)
- `react-native-unistyles` - Styling system

## Usage

### Basic Example

```tsx
import { DataGrid } from '@idealyst/datagrid';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  // ... more data
];

const columns = [
  { key: 'id', header: 'ID', width: 60 },
  { key: 'name', header: 'Name', width: 150 },
  { key: 'email', header: 'Email', width: 200 },
  { key: 'age', header: 'Age', width: 80, sortable: true },
];

function MyDataGrid() {
  return (
    <DataGrid
      data={data}
      columns={columns}
      height={400}
      virtualized={true}
    />
  );
}
```

### Advanced Features

#### Custom Cell Rendering

```tsx
const columns = [
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Badge variant="filled" intent={value === 'active' ? 'success' : 'neutral'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (value, row) => (
      <Button size="small" onPress={() => handleEdit(row)}>
        Edit
      </Button>
    ),
  },
];
```

#### Row Selection

```tsx
function SelectableDataGrid() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <DataGrid
      data={data}
      columns={columns}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      multiSelect={true}
      onRowClick={(row, index) => console.log('Clicked:', row)}
    />
  );
}
```

#### Sorting

```tsx
function SortableDataGrid() {
  const [sortedData, setSortedData] = useState(data);

  const handleSort = (column, direction) => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[column.key];
      const bVal = b[column.key];
      return direction === 'asc' 
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });
    setSortedData(sorted);
  };

  return (
    <DataGrid
      data={sortedData}
      columns={columns}
      onSort={handleSort}
    />
  );
}
```

#### Dynamic Styling

```tsx
<DataGrid
  data={data}
  columns={columns}
  rowStyle={(row, index) => ({
    backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
  })}
  headerStyle={{
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
  }}
/>
```

## API Reference

### DataGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | Required | Array of data objects |
| `columns` | `Column<T>[]` | Required | Column configuration |
| `height` | `number \| string` | `400` | Height of the grid |
| `width` | `number \| string` | `'100%'` | Width of the grid |
| `rowHeight` | `number` | `48` | Height of each row |
| `headerHeight` | `number` | `56` | Height of the header |
| `virtualized` | `boolean` | `true` | Enable virtualization for large datasets |
| `stickyHeader` | `boolean` | `true` | Keep header visible when scrolling |
| `selectedRows` | `number[]` | `[]` | Array of selected row indices |
| `multiSelect` | `boolean` | `false` | Allow multiple row selection |
| `onRowClick` | `(row: T, index: number) => void` | - | Row click handler |
| `onSelectionChange` | `(rows: number[]) => void` | - | Selection change handler |
| `onSort` | `(column: Column, direction: 'asc' \| 'desc') => void` | - | Sort handler |
| `onColumnResize` | `(columnKey: string, width: number) => void` | - | Column resize handler (web only) |
| `style` | `ViewStyle` | - | Container style |
| `headerStyle` | `ViewStyle` | - | Header style |
| `rowStyle` | `ViewStyle \| ((row: T, index: number) => ViewStyle)` | - | Row style |

### Column Configuration

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique column identifier |
| `header` | `string` | Column header text |
| `width` | `number` | Fixed column width |
| `minWidth` | `number` | Minimum column width |
| `maxWidth` | `number` | Maximum column width |
| `sortable` | `boolean` | Enable sorting for this column |
| `resizable` | `boolean` | Enable column resizing (web only) |
| `accessor` | `(row: T) => any` | Custom value accessor |
| `render` | `(value: any, row: T, index: number) => ReactNode` | Custom cell renderer |
| `headerStyle` | `ViewStyle` | Header cell style |
| `cellStyle` | `ViewStyle \| ((value: any, row: T) => ViewStyle)` | Cell style |

## Architecture

The DataGrid is built using a layered architecture:

1. **Platform Primitives** - Low-level components that handle platform differences:
   - `ScrollView` - Native scrolling for each platform
   - `VirtualizedList` - react-window for web, FlatList for native

2. **DataGrid Component** - Unified component that uses primitives:
   - Single implementation works on all platforms
   - Composes @idealyst/components for UI elements
   - Uses Unistyles for theming

This approach ensures maximum code reuse while optimizing for each platform's strengths.

## Performance Tips

1. **Use Virtualization** - Enable `virtualized={true}` for datasets > 100 rows
2. **Set Fixed Heights** - Provide `rowHeight` for better performance
3. **Optimize Renders** - Use `React.memo` for custom cell renderers
4. **Limit Columns** - Consider horizontal scrolling for many columns

## License

MIT