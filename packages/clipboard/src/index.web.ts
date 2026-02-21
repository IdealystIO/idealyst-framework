import BaseClipboard from './clipboard';
import WebClipboard from './clipboard.web';

const clipboard = new BaseClipboard(new WebClipboard());

export default clipboard;
export { clipboard, BaseClipboard, WebClipboard };
export * from './types';
export { useOTPAutoFill } from './otp.web';
