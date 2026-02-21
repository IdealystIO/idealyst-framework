import { OTPAutoFillOptions, OTPAutoFillResult } from './types';

const noop = () => {};

/**
 * No-op implementation of useOTPAutoFill for web.
 *
 * On web, OTP autofill is handled by the browser via `autocomplete="one-time-code"`
 * on input elements. Use the exported `OTP_INPUT_PROPS` on your TextInput for
 * cross-platform compatibility — it maps to the correct browser autocomplete attribute.
 */
export function useOTPAutoFill(_options?: OTPAutoFillOptions): OTPAutoFillResult {
  return {
    code: null,
    startListening: noop,
    stopListening: noop,
    hash: null,
  };
}
