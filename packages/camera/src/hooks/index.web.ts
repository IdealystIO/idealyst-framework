import { createUseCameraHook } from './createUseCameraHook';
import { createCamera } from '../camera.web';

/**
 * React hook for camera functionality (web implementation).
 */
export const useCamera = createUseCameraHook(createCamera);

export { createUseCameraHook } from './createUseCameraHook';
