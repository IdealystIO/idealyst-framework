import React from 'react';
import { RadioGroup } from '../../RadioButton';
import { useFormField } from '../useFormField';
import type { FormRadioGroupProps } from '../types';

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  disabled: localDisabled,
  ...rest
}) => {
  const field = useFormField(name);

  return (
    <RadioGroup
      value={(field.value as string) ?? ''}
      onValueChange={(value) => field.onChange(value)}
      disabled={field.disabled || localDisabled}
      {...rest}
    />
  );
};

FormRadioGroup.displayName = 'Form.RadioGroup';
export default FormRadioGroup;
