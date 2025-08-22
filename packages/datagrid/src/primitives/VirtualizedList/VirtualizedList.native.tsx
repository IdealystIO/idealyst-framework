import React from 'react';
import { FlatList, VirtualizedList as RNVirtualizedList } from 'react-native';

interface VirtualizedListProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  itemHeight: number | ((index: number) => number);
  height: number;
  width?: number | string;
  horizontal?: boolean;
  onScroll?: (event: any) => void;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  data,
  renderItem,
  itemHeight,
  height,
  horizontal = false,
  onScroll,
}) => {
  const getItemLayout = typeof itemHeight === 'number' 
    ? (data: any, index: number) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      })
    : undefined;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      horizontal={horizontal}
      onScroll={onScroll}
      style={{ height, width }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
};