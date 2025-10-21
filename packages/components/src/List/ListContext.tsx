import { createContext, useContext } from 'react';
import type { ListSizeVariant, ListVariant } from './types';

interface ListContextValue {
  variant?: ListVariant;
  size?: ListSizeVariant;
}

const ListContext = createContext<ListContextValue>({
  variant: 'default',
  size: 'md',
});

export const ListProvider = ListContext.Provider;

export const useListContext = () => useContext(ListContext);
