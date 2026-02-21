import React, { forwardRef } from 'react';
import TextArea from '../../TextArea';
import { useFormField } from '../useFormField';
import type { FormTextAreaProps } from '../types';
import type { IdealystElement } from '../../utils/refTypes';

const FormTextArea = forwardRef<IdealystElement, FormTextAreaProps>(({
  name,
  disabled: localDisabled,
  ...rest
}, ref) => {
  const field = useFormField(name);

  return (
    <TextArea
      ref={ref}
      value={(field.value as string) ?? ''}
      onChange={(text) => field.onChange(text)}
      error={field.error}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
});

FormTextArea.displayName = 'Form.TextArea';
export default FormTextArea;
