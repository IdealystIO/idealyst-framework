import { createUseCameraHook } from './createUseCameraHook';
import { createCamera } from '../camera.native';

/**
 * React hook for camera functionality (native implementation).
 */
export const useCamera = createUseCameraHook(createCamera);

export { createUseCameraHook } from './createUseCameraHook';
