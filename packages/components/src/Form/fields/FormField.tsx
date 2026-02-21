import React from 'react';
import { useFormField } from '../useFormField';
import type { FormFieldProps } from '../types';

const FormField: React.FC<FormFieldProps> = ({ name, children }) => {
  const field = useFormField(name);
  return <>{children(field)}</>;
};

FormField.displayName = 'Form.Field';
export default FormField;
