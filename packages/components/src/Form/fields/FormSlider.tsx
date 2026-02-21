import React, { forwardRef } from 'react';
import Slider from '../../Slider';
import { useFormField } from '../useFormField';
import type { FormSliderProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormSlider = forwardRef<IdealystElement, FormSliderProps>(({
  name,
  disabled: localDisabled,
  ...rest
}, ref) => {
  const field = useFormField(name);

  return (
    <Slider
      ref={ref}
      value={(field.value as number) ?? 0}
      onChange={(value: number) => field.onChange(value)}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
});

FormSlider.displayName = 'Form.Slider';
export default FormSlider;
