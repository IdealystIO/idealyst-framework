/**
 * @ignore
 * @deprecated Use TextInput instead. This component exists for backwards compatibility only.
 */
import React, { useEffect, useRef } from 'react';
import TextInput from '../TextInput/TextInput.native';
import type { TextInputProps } from '../TextInput/types';
import type { IdealystElement } from '../utils/refTypes';

// Track if we've already logged the deprecation warning
let hasLoggedWarning = false;

/**
 * @ignore
 * @deprecated Use TextInput instead. Input is maintained for backwards compatibility only.
 *
 * Migration:
 * - Replace `<Input />` with `<TextInput />`
 * - Replace `inputType` prop with `inputMode` (React Native only)
 *
 * @example
 * // Before
 * import { Input } from '@idealyst/components';
 * <Input inputType="email" />
 *
 * // After
 * import { TextInput } from '@idealyst/components';
 * <TextInput inputMode="email" />
 */
const Input = React.forwardRef<IdealystElement, TextInputProps>((props, ref) => {
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (!hasRenderedRef.current && !hasLoggedWarning) {
      hasRenderedRef.current = true;
      hasLoggedWarning = true;
      console.warn(
        'Input is deprecated and maintained for compatibility only. Please use TextInput instead.\n' +
        'Migration: Replace <Input /> with <TextInput /> and inputType with inputMode.'
      );
    }
  }, []);

  return <TextInput ref={ref as any} {...props} />;
});

Input.displayName = 'Input';

export default Input;
