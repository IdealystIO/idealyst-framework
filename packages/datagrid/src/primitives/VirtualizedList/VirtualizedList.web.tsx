import React from 'react';
import { VariableSizeList, FixedSizeList } from 'react-window';

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
  width = '100%',
  horizontal = false,
  onScroll,
}) => {
  const isVariableSize = typeof itemHeight === 'function';
  const List = isVariableSize ? VariableSizeList : FixedSizeList;
  
  const listProps = {
    height: horizontal ? '100%' : height,
    width: horizontal ? height : width,
    itemCount: data.length,
    itemSize: itemHeight,
    layout: horizontal ? 'horizontal' : 'vertical',
    onScroll,
  };

  return (
    <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
      <List {...listProps}>
        {({ index, style }) => (
          <div style={{ ...style, display: 'table-row-group' }}>
            {renderItem({ item: data[index], index })}
          </div>
        )}
      </List>
    </div>
  );
};