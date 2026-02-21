import React, { forwardRef } from 'react';
import Checkbox from '../../Checkbox';
import { useFormField } from '../useFormField';
import type { FormCheckboxProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormCheckbox = forwardRef<IdealystElement, FormCheckboxProps>(({
  name,
  disabled: localDisabled,
  ...rest
}, ref) => {
  const field = useFormField(name);

  return (
    <Checkbox
      ref={ref}
      checked={Boolean(field.value)}
      onChange={(checked: boolean) => field.onChange(checked)}
      error={field.error}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
});

FormCheckbox.displayName = 'Form.Checkbox';
export default FormCheckbox;
