import BaseClipboard from './clipboard';
import NativeClipboard from './clipboard.native';

const clipboard = new BaseClipboard(new NativeClipboard());

export default clipboard;
export { clipboard, BaseClipboard, NativeClipboard };
export * from './types';
export { useOTPAutoFill } from './otp.native';
