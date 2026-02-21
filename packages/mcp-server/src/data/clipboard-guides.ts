export const clipboardGuides: Record<string, string> = {
  "idealyst://clipboard/overview": `# @idealyst/clipboard Overview

Cross-platform clipboard and OTP autofill for React and React Native applications. Provides a consistent async API for copy/paste operations, plus a mobile-only hook for automatic SMS OTP code detection.

## Features

- **Cross-Platform Clipboard** - Copy and paste text on React Native and Web
- **Simple API** - Async/await based with consistent interface
- **React Native** - Uses @react-native-clipboard/clipboard
- **Web** - Uses navigator.clipboard API
- **OTP Auto-Fill (Android)** - Automatically reads OTP codes from SMS via SMS Retriever API (no permissions needed)
- **OTP Auto-Fill (iOS)** - Provides TextInput props for native iOS keyboard OTP suggestion
- **TypeScript** - Full type safety and IntelliSense support

## Installation

\`\`\`bash
yarn add @idealyst/clipboard

# React Native also needs:
yarn add @react-native-clipboard/clipboard
cd ios && pod install

# For OTP autofill on Android (optional):
yarn add react-native-otp-verify
\`\`\`

## Quick Start

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';

// Copy text
await clipboard.copy('Hello, world!');

// Paste text
const text = await clipboard.paste();

// Check if clipboard has text
const hasText = await clipboard.hasText();
\`\`\`

## OTP Auto-Fill Quick Start

\`\`\`tsx
import { useOTPAutoFill, OTP_INPUT_PROPS } from '@idealyst/clipboard';
import { TextInput } from 'react-native';

function OTPScreen() {
  const { code, startListening, hash } = useOTPAutoFill({
    codeLength: 6,
    onCodeReceived: (otp) => verifyOTP(otp),
  });

  useEffect(() => {
    startListening();
  }, []);

  return (
    <TextInput
      value={code ?? ''}
      {...OTP_INPUT_PROPS}
    />
  );
}
\`\`\`

## Import Options

\`\`\`tsx
// Named import (recommended)
import { clipboard } from '@idealyst/clipboard';

// Default import
import clipboard from '@idealyst/clipboard';

// OTP hook and helpers
import { useOTPAutoFill, OTP_INPUT_PROPS } from '@idealyst/clipboard';
\`\`\`

## Platform Details

- **React Native**: Uses \`@react-native-clipboard/clipboard\` for clipboard operations
- **Web**: Uses \`navigator.clipboard\` API (requires secure context / HTTPS)
- **OTP (Android)**: Uses SMS Retriever API via \`react-native-otp-verify\` — zero permissions
- **OTP (iOS)**: Native keyboard autofill via \`textContentType="oneTimeCode"\`
- **OTP (Web)**: No-op — returns null values and noop functions
`,

  "idealyst://clipboard/api": `# Clipboard API Reference

Complete API reference for @idealyst/clipboard.

## clipboard.copy

Copy text to the system clipboard.

\`\`\`tsx
await clipboard.copy(text: string): Promise<void>

// Examples
await clipboard.copy('Hello, world!');
await clipboard.copy(inviteCode);
await clipboard.copy(JSON.stringify(data));
\`\`\`

## clipboard.paste

Read text from the system clipboard.

\`\`\`tsx
await clipboard.paste(): Promise<string>

// Examples
const text = await clipboard.paste();
const url = await clipboard.paste();
\`\`\`

## clipboard.hasText

Check if the clipboard contains text content.

\`\`\`tsx
await clipboard.hasText(): Promise<boolean>

// Example
const canPaste = await clipboard.hasText();
if (canPaste) {
  const text = await clipboard.paste();
}
\`\`\`

## clipboard.addListener

Listen for copy events (triggered when \`clipboard.copy()\` is called).

\`\`\`tsx
const unsubscribe = clipboard.addListener((content: string) => {
  console.log('Copied:', content);
});

// Later, unsubscribe
unsubscribe();
\`\`\`

---

## useOTPAutoFill

React hook for automatic OTP code detection from SMS on mobile.

**Android**: Uses SMS Retriever API to auto-read OTP from incoming SMS (no permissions required). SMS must include your app hash.

**iOS**: OTP is handled natively by the iOS keyboard. Use \`OTP_INPUT_PROPS\` on your TextInput to enable it.

**Web**: Returns no-op values.

\`\`\`tsx
const {
  code,           // string | null - received OTP code (Android only)
  startListening, // () => void - begin listening for SMS (Android only)
  stopListening,  // () => void - stop listening (Android only)
  hash,           // string | null - app hash for SMS body (Android only)
} = useOTPAutoFill(options?: {
  codeLength?: number;           // default: 6
  onCodeReceived?: (code: string) => void;
});
\`\`\`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| codeLength | number | 6 | Expected digit count of OTP code |
| onCodeReceived | (code: string) => void | — | Callback when OTP is detected |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| code | string \\| null | Detected OTP code (Android). Null on iOS/web. |
| startListening | () => void | Start SMS listener (Android). No-op on iOS/web. |
| stopListening | () => void | Stop SMS listener (Android). No-op on iOS/web. |
| hash | string \\| null | App hash for SMS Retriever (Android). Null on iOS/web. |

### Android SMS Format

For the SMS Retriever API to detect the message, the SMS must:
1. Start with \`<#>\`
2. Contain the OTP code as a sequence of digits
3. End with your app's 11-character hash (available via \`hash\`)

Example SMS:
\`\`\`
<#> Your verification code is: 123456
FA+9qCX9VSu
\`\`\`

---

## OTP_INPUT_PROPS

Constant with TextInput props to enable native OTP keyboard autofill.

\`\`\`tsx
import { OTP_INPUT_PROPS } from '@idealyst/clipboard';

// Value:
// {
//   textContentType: 'oneTimeCode',
//   autoComplete: 'sms-otp',
// }

<TextInput
  {...OTP_INPUT_PROPS}
  value={code}
  onChangeText={setCode}
/>
\`\`\`

- **iOS**: Enables the keyboard to suggest OTP codes from received SMS (iOS 12+)
- **Android**: Maps to the correct \`autoComplete\` value
- **Web**: Harmless — ignored by web TextInput
`,

  "idealyst://clipboard/examples": `# Clipboard Examples

Complete code examples for common @idealyst/clipboard patterns.

## Copy to Clipboard with Feedback

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';
import { useState, useCallback } from 'react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await clipboard.copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      label={copied ? 'Copied!' : 'Copy'}
      intent={copied ? 'positive' : 'neutral'}
      onPress={handleCopy}
    />
  );
}
\`\`\`

## Share / Copy Link

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';

async function copyShareLink(itemId: string) {
  const url = \`https://myapp.com/items/\${itemId}\`;
  await clipboard.copy(url);
}
\`\`\`

## Paste from Clipboard

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';

function PasteInput() {
  const [value, setValue] = useState('');

  const handlePaste = useCallback(async () => {
    const hasText = await clipboard.hasText();
    if (hasText) {
      const text = await clipboard.paste();
      setValue(text);
    }
  }, []);

  return (
    <View>
      <Input value={value} onChangeText={setValue} placeholder="Enter or paste text" />
      <Button label="Paste" onPress={handlePaste} iconName="content-paste" />
    </View>
  );
}
\`\`\`

## useClipboard Hook

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';
import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    await clipboard.copy(text);
    setCopiedText(text);
  }, []);

  const paste = useCallback(async () => {
    return clipboard.paste();
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return { copy, paste, copiedText, reset };
}
\`\`\`

## OTP Verification Screen

\`\`\`tsx
import { useOTPAutoFill, OTP_INPUT_PROPS } from '@idealyst/clipboard';
import { useEffect, useState } from 'react';
import { TextInput, Platform } from 'react-native';

function OTPVerificationScreen({ phoneNumber, onVerify }: {
  phoneNumber: string;
  onVerify: (code: string) => void;
}) {
  const [code, setCode] = useState('');

  const otp = useOTPAutoFill({
    codeLength: 6,
    onCodeReceived: (receivedCode) => {
      setCode(receivedCode);
      onVerify(receivedCode);
    },
  });

  // Start listening when screen mounts
  useEffect(() => {
    otp.startListening();
    return () => otp.stopListening();
  }, []);

  // Auto-fill from hook on Android
  useEffect(() => {
    if (otp.code) {
      setCode(otp.code);
    }
  }, [otp.code]);

  return (
    <View>
      <Text>Enter the code sent to {phoneNumber}</Text>

      <TextInput
        value={code}
        onChangeText={(text) => {
          setCode(text);
          if (text.length === 6) onVerify(text);
        }}
        keyboardType="number-pad"
        maxLength={6}
        {...OTP_INPUT_PROPS}
      />

      {Platform.OS === 'android' && otp.hash && (
        <Text style={{ fontSize: 10, color: '#999' }}>
          App hash (for SMS setup): {otp.hash}
        </Text>
      )}
    </View>
  );
}
\`\`\`

## Copy Invite Code

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';

function InviteCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Card>
      <Text>Your invite code</Text>
      <Text variant="headline">{code}</Text>
      <Button
        label={copied ? 'Copied!' : 'Copy Code'}
        iconName={copied ? 'check' : 'content-copy'}
        onPress={async () => {
          await clipboard.copy(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      />
    </Card>
  );
}
\`\`\`

## Error Handling

\`\`\`tsx
import { clipboard } from '@idealyst/clipboard';

async function safeCopy(text: string): Promise<boolean> {
  try {
    await clipboard.copy(text);
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    // On web, this can fail if not in a secure context or without user gesture
    return false;
  }
}

async function safePaste(): Promise<string | null> {
  try {
    const hasText = await clipboard.hasText();
    if (!hasText) return null;
    return await clipboard.paste();
  } catch (error) {
    console.error('Clipboard paste failed:', error);
    // Browser may deny permission
    return null;
  }
}
\`\`\`

## Best Practices

1. **Always use try-catch** — Clipboard operations can fail (permissions, secure context)
2. **Provide visual feedback** — Show a "Copied!" confirmation after copying
3. **Use OTP_INPUT_PROPS** — Always spread these on OTP text inputs for cross-platform autofill
4. **Start OTP listener on mount** — Call \`startListening()\` in useEffect, clean up with \`stopListening()\`
5. **Log the Android hash** — During development, log \`hash\` to configure your SMS gateway
6. **Graceful degradation** — OTP features degrade gracefully if native modules aren't installed
7. **Secure context (web)** — Clipboard API requires HTTPS on web
`,
};
