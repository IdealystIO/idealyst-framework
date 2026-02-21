import { useFormContext } from './FormContext';
import type { FieldRenderProps } from './types';

export function useFormField(name: string): FieldRenderProps {
  const { form } = useFormContext();

  const value = form.getValue(name);
  const touched = Boolean(form.touched[name]);
  const submitAttempted = form.submitCount > 0;

  return {
    name,
    value,
    onChange: (val) => form.setValue(name, val as any),
    onBlur: () => form.setTouched(name),
    error: (touched || submitAttempted) ? form.getError(name) : undefined,
    touched,
    dirty: Boolean(form.values[name] !== undefined),
    disabled: form.disabled,
  };
}
