import React from 'react';
import { VariableSizeList, FixedSizeList, ListChildComponentProps } from 'react-window';

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

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={{ ...style, display: 'table-row-group' }}>
      {renderItem({ item: data[index], index })}
    </div>
  );

  const commonProps = {
    height: horizontal ? '100%' as const : height,
    width: horizontal ? height : width,
    itemCount: data.length,
    layout: horizontal ? 'horizontal' as const : 'vertical' as const,
    onScroll,
  };

  return (
    <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
      {isVariableSize ? (
        <VariableSizeList {...commonProps} itemSize={itemHeight as (index: number) => number}>
          {Row}
        </VariableSizeList>
      ) : (
        <FixedSizeList {...commonProps} itemSize={itemHeight as number}>
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
};