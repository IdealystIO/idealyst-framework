import { createContext, useContext } from 'react';
import type { FormContextValue } from './types';

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used within a <Form> component');
  }
  return ctx;
}
