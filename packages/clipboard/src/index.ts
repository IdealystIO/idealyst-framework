import BaseClipboard from './clipboard';

// Platform-specific entry points (index.native.ts, index.web.ts) replace this with real instances
// This provides type compatibility for `import { clipboard } from '@idealyst/clipboard'`
const clipboard = null as unknown as BaseClipboard;

export { BaseClipboard, clipboard };
export default BaseClipboard;
export * from './types';
export { useOTPAutoFill } from './otp.web';
