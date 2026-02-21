import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { OTPAutoFillOptions, OTPAutoFillResult } from './types';

/**
 * Hook for automatic OTP code detection from SMS on mobile.
 *
 * **Android**: Uses the SMS Retriever API via `react-native-otp-verify` to automatically
 * read OTP codes from incoming SMS without requiring any permissions. The SMS must end
 * with your app's hash (available via `hash` return value).
 *
 * **iOS**: OTP autofill is handled natively by the iOS keyboard when `textContentType="oneTimeCode"`
 * is set on the TextInput. Use the exported `OTP_INPUT_PROPS` to enable this. This hook
 * returns a no-op result on iOS since the OS handles everything.
 *
 * SMS format required for Android:
 * ```
 * Your verification code is: 123456
 * <#> AppHash
 * ```
 */
export function useOTPAutoFill(options?: OTPAutoFillOptions): OTPAutoFillResult {
  const { codeLength = 6, onCodeReceived } = options ?? {};
  const [code, setCode] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const listenerRef = useRef<(() => void) | null>(null);
  const onCodeReceivedRef = useRef(onCodeReceived);
  onCodeReceivedRef.current = onCodeReceived;

  // Only use SMS Retriever on Android
  const isAndroid = Platform.OS === 'android';

  useEffect(() => {
    if (!isAndroid) return;

    let mounted = true;

    (async () => {
      try {
        const OtpVerify = await import('react-native-otp-verify');
        const appHash = await OtpVerify.getHash();
        if (mounted && appHash?.[0]) {
          setHash(appHash[0]);
        }
      } catch {
        // react-native-otp-verify not installed — degrade gracefully
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAndroid]);

  const extractCode = useCallback(
    (message: string): string | null => {
      // Match a sequence of digits with the expected length
      const regex = new RegExp(`\\b(\\d{${codeLength}})\\b`);
      const match = message.match(regex);
      return match ? match[1] : null;
    },
    [codeLength]
  );

  const startListening = useCallback(() => {
    if (!isAndroid) return;

    (async () => {
      try {
        const OtpVerify = await import('react-native-otp-verify');
        await OtpVerify.startOtpListener((message: string) => {
          const extracted = extractCode(message);
          if (extracted) {
            setCode(extracted);
            onCodeReceivedRef.current?.(extracted);
          }
        });
      } catch {
        // react-native-otp-verify not installed — degrade gracefully
      }
    })();
  }, [isAndroid, extractCode]);

  const stopListening = useCallback(() => {
    if (!isAndroid) return;

    (async () => {
      try {
        const OtpVerify = await import('react-native-otp-verify');
        OtpVerify.removeListener();
        listenerRef.current = null;
      } catch {
        // react-native-otp-verify not installed
      }
    })();
  }, [isAndroid]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isAndroid) {
        stopListening();
      }
    };
  }, [isAndroid, stopListening]);

  return {
    code,
    startListening,
    stopListening,
    hash,
  };
}
