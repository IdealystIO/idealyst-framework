import React, { forwardRef } from 'react';
import Select from '../../Select';
import { useFormField } from '../useFormField';
import type { FormSelectProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormSelect = forwardRef<IdealystElement, FormSelectProps>(({
  name,
  disabled: localDisabled,
  ...rest
}, ref) => {
  const field = useFormField(name);

  return (
    <Select
      ref={ref}
      value={(field.value as string) ?? ''}
      onChange={(value) => field.onChange(value)}
      error={Boolean(field.error)}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
});

FormSelect.displayName = 'Form.Select';
export default FormSelect;
