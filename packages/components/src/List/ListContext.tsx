import { createContext, useContext } from 'react';
import type { ListSizeVariant, ListType } from './types';

interface ListContextValue {
  type?: ListType;
  size?: ListSizeVariant;
}

const ListContext = createContext<ListContextValue>({
  type: 'default',
  size: 'md',
});

export const ListProvider = ListContext.Provider;

export const useListContext = () => useContext(ListContext);
