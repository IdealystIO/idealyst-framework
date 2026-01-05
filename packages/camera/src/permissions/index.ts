// Shared permission types are exported from main types.ts
// This file just re-exports the web implementation as default
export {
  checkPermission,
  requestPermission,
  requestCameraPermission,
  requestMicrophonePermission,
} from './permissions.web';
