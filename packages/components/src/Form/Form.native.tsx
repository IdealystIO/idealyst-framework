import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { formStyles } from './Form.styles';
import { FormContext } from './FormContext';
import type { FormProps } from './types';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Form component for managing form state and validation.
 * Wraps children in a context provider and renders a View on native.
 */
const Form = forwardRef<IdealystElement, FormProps>(({
  form,
  children,
  style,
  testID,
  id,
}, ref) => {
  return (
    <FormContext.Provider value={{ form }}>
      <View
        ref={ref as any}
        nativeID={id}
        style={[
          formStyles.container,
          style as any,
        ]}
        testID={testID}
      >
        {children}
      </View>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';

export default Form;
