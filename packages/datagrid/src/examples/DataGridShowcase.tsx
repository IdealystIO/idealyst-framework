import React, { useState } from 'react';
import { View, Text, Button, Screen, Card, Badge } from '@idealyst/components';
import { DataGrid } from '../DataGrid';
import type { Column } from '../DataGrid/types';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  vendor: string;
  lastUpdated: string;
}

const generateSampleProducts = (count: number = 100): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Sports'];
  const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
  const products: Product[] = [];
  
  for (let i = 1; i <= count; i++) {
    const stock = Math.floor(Math.random() * 100);
    products.push({
      id: i,
      name: `Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat((Math.random() * 999 + 1).toFixed(2)),
      stock,
      status: stock === 0 ? 'out-of-stock' : stock < 10 ? 'low-stock' : 'in-stock',
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }
  
  return products;
};

interface DataGridShowcaseProps {
  /** Number of sample products to generate */
  productCount?: number;
  /** Whether to show all columns (false hides vendor and lastUpdated) */
  showAllColumns?: boolean;
  /** Height of the DataGrid */
  height?: number;
}

export function DataGridShowcase({ 
  productCount = 100, 
  showAllColumns = true,
  height = 500
}: DataGridShowcaseProps = {}) {
  const [products, setProducts] = useState<Product[]>(() => generateSampleProducts(productCount));
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [virtualized, setVirtualized] = useState(false);
  
  const baseColumns: Column<Product>[] = [
    {
      key: 'id',
      header: 'ID',
      width: showAllColumns ? 60 : 50,
      minWidth: 40,
      maxWidth: 100,
      sortable: true,
      resizable: true,
    },
    {
      key: 'name',
      header: showAllColumns ? 'Product Name' : 'Product',
      width: showAllColumns ? 150 : 120,
      minWidth: 80,
      maxWidth: 300,
      sortable: true,
      resizable: true,
    },
    {
      key: 'category',
      header: 'Category',
      width: showAllColumns ? 120 : 100,
      minWidth: 80,
      maxWidth: 200,
      sortable: true,
      resizable: true,
      render: (value) => (
        <Badge variant="outlined" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: showAllColumns ? 100 : 80,
      minWidth: 60,
      maxWidth: 150,
      sortable: true,
      resizable: true,
      render: (value) => (
        <Text weight="semibold" size={showAllColumns ? 'md' : 'sm'}>
          ${value.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: showAllColumns ? 80 : 60,
      minWidth: 50,
      maxWidth: 120,
      sortable: true,
      resizable: true,
      render: (value, row) => (
        <Text
          size="sm"
          style={{
            color: row.status === 'out-of-stock' ? '#ef4444' :
                   row.status === 'low-stock' ? '#f59e0b' : '#22c55e'
          }}
        >
          {value}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: showAllColumns ? 120 : 100,
      minWidth: 80,
      maxWidth: 180,
      resizable: true,
      render: (value) => {
        const intent = value === 'in-stock' ? 'success' :
                       value === 'low-stock' ? 'warning' : 'error';
        return (
          <Badge variant="filled" intent={intent} size="sm">
            {value}
          </Badge>
        );
      },
    },
  ];

  const additionalColumns: Column<Product>[] = showAllColumns ? [
    {
      key: 'vendor',
      header: 'Vendor',
      width: 100,
      minWidth: 70,
      maxWidth: 180,
      sortable: true,
      resizable: true,
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: 120,
      minWidth: 90,
      maxWidth: 180,
      sortable: true,
      resizable: true,
    },
  ] : [];

  const handleColumnResize = (columnKey: string, newWidth: number) => {
    console.log(`Column "${columnKey}" resized to ${newWidth}px`);
  };

  const columns = [...baseColumns, ...additionalColumns];
  
  const handleSort = (column: Column<Product>, direction: 'asc' | 'desc') => {
    const sorted = [...products].sort((a, b) => {
      const aVal = a[column.key as keyof Product];
      const bVal = b[column.key as keyof Product];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal);
      const bStr = String(bVal);
      return direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    setProducts(sorted);
  };
  
  const handleDeleteSelected = () => {
    const newProducts = products.filter((_, index) => !selectedRows.includes(index));
    setProducts(newProducts);
    setSelectedRows([]);
  };
  
  const handleResetData = () => {
    setProducts(generateSampleProducts(productCount));
    setSelectedRows([]);
  };
  
  return (
    <Screen background="primary" safeArea scrollable={false}>
      <View spacing={showAllColumns ? "lg" : "md"} style={{ padding: showAllColumns ? 16 : 12, flex: 1 }}>
        <Text size={showAllColumns ? "xl" : "lg"} weight="bold">
          DataGrid {showAllColumns ? 'Component ' : ''}Showcase
        </Text>
        
        <Card variant="outlined">
          <View spacing={showAllColumns ? "md" : "sm"}>
            <Text weight="semibold" size="md">Controls</Text>
            
            <View 
              spacing="sm" 
              style={{ 
                flexDirection: showAllColumns ? 'row' : 'column',
                alignItems: showAllColumns ? 'center' : 'stretch',
                flexWrap: showAllColumns ? 'wrap' : 'nowrap',
                gap: 8 
              }}
            >
              <Button
                variant="outlined"
                size="sm"
                onPress={() => setVirtualized(!virtualized)}
              >
                {virtualized ? 'Disable' : 'Enable'} Virtualization
              </Button>
              
              {!showAllColumns && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onPress={() => setSelectedRows([])}
                    disabled={selectedRows.length === 0}
                  >
                    Clear ({selectedRows.length})
                  </Button>
                  
                  <Button
                    variant="outlined"
                    intent="danger"
                    size="sm"
                    onPress={handleDeleteSelected}
                    disabled={selectedRows.length === 0}
                  >
                    Delete Selected
                  </Button>
                </View>
              )}

              {showAllColumns && (
                <>
                  <Button
                    variant="outlined"
                    size="sm"
                    onPress={() => setSelectedRows([])}
                    disabled={selectedRows.length === 0}
                  >
                    Clear Selection ({selectedRows.length})
                  </Button>
                  
                  <Button
                    variant="outlined"
                    intent="danger"
                    size="sm"
                    onPress={handleDeleteSelected}
                    disabled={selectedRows.length === 0}
                  >
                    Delete Selected
                  </Button>
                </>
              )}
              
              <Button
                variant="outlined"
                size="sm"
                onPress={handleResetData}
              >
                Reset Data
              </Button>
            </View>
            
            <View spacing="xs">
              <Text size="sm">• {showAllColumns ? 'Total ' : ''}Products: {products.length}</Text>
              <Text size="sm">• Selected: {selectedRows.length}</Text>
              <Text size="sm">• Virtualization: {virtualized ? (showAllColumns ? 'Enabled' : 'On') : (showAllColumns ? 'Disabled' : 'Off')}</Text>
            </View>
          </View>
        </Card>
        
        <Card variant="elevated" style={{ flex: 1, overflow: 'hidden' }}>
          <DataGrid
            data={products}
            columns={columns}
            height={height}
            virtualized={virtualized}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            multiSelect={true}
            onSort={handleSort}
            onColumnResize={handleColumnResize}
            stickyHeader={true}
            rowHeight={showAllColumns ? 48 : 44}
            headerHeight={48}
            rowStyle={(row, index) => ({
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
            })}
          />
        </Card>
        
        <Card variant="outlined">
          <View spacing={showAllColumns ? "sm" : "xs"}>
            <Text weight="semibold" size="md">Features {showAllColumns ? 'Demonstrated' : ''}</Text>
            <Text size="sm">✓ Virtualized rendering{showAllColumns ? ` with ${productCount} rows` : ''}</Text>
            <Text size="sm">✓ Sortable columns{showAllColumns ? ' (ID, Name, Category, Price, Stock, Vendor, Date)' : ''}</Text>
            <Text size="sm">✓ Resizable columns{showAllColumns ? ' (drag column borders to resize)' : ''}</Text>
            <Text size="sm">✓ Multi-row selection{showAllColumns ? ' with visual feedback' : ''}</Text>
            <Text size="sm">✓ Custom cell rendering{showAllColumns ? ' (badges, colored text)' : ''}</Text>
            <Text size="sm">✓ Sticky header{showAllColumns ? ' while scrolling' : ''}</Text>
            <Text size="sm">✓ Alternating row colors</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}