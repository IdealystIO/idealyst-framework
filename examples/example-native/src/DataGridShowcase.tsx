import React from 'react';
import { ScrollView } from 'react-native';
import { DataGridShowcase as BaseDataGridShowcase } from '@idealyst/datagrid/examples';

export function DataGridShowcase() {
  return (
    <ScrollView>
      <BaseDataGridShowcase 
        productCount={50}
        showAllColumns={false}
        height={400}
      />
    </ScrollView>
  );
}