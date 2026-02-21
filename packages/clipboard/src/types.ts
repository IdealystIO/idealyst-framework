// ============================================================================
// Clipboard Types
// ============================================================================

export interface IClipboard {
  copy(text: string): Promise<void>;
  paste(): Promise<string>;
  hasText(): Promise<boolean>;
}

export type ClipboardListener = (content: string) => void;

export interface IClipboardWithListener extends IClipboard {
  addListener(listener: ClipboardListener): () => void;
}

// ============================================================================
// OTP Types
// ============================================================================

export interface OTPAutoFillOptions {
  /** Expected length of the OTP code. Used to extract the code from SMS on Android. */
  codeLength?: number;
  /** Callback fired when an OTP code is received (Android only — iOS uses native keyboard autofill). */
  onCodeReceived?: (code: string) => void;
}

export interface OTPAutoFillResult {
  /** The received OTP code, or null if not yet received. Android only. */
  code: string | null;
  /** Start listening for incoming OTP SMS. Android only — no-op on iOS and web. */
  startListening: () => void;
  /** Stop listening for incoming OTP SMS. Android only — no-op on iOS and web. */
  stopListening: () => void;
  /** The app hash required in SMS body for Android SMS Retriever API. Null on iOS and web. */
  hash: string | null;
}

/**
 * Props to spread on a TextInput to enable iOS OTP keyboard autofill.
 * On iOS 12+, the keyboard will suggest OTP codes from received SMS.
 * On Android / web, these are harmless no-ops.
 */
export const OTP_INPUT_PROPS = {
  textContentType: 'oneTimeCode' as const,
  autoComplete: 'sms-otp' as const,
};
