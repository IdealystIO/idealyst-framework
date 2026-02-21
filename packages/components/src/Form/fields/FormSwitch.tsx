import React, { forwardRef } from 'react';
import Switch from '../../Switch';
import { useFormField } from '../useFormField';
import type { FormSwitchProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormSwitch = forwardRef<IdealystElement, FormSwitchProps>(({
  name,
  disabled: localDisabled,
  ...rest
}, ref) => {
  const field = useFormField(name);

  return (
    <Switch
      ref={ref}
      checked={Boolean(field.value)}
      onChange={(checked: boolean) => field.onChange(checked)}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
});

FormSwitch.displayName = 'Form.Switch';
export default FormSwitch;
