import type { PermissionStatus, PermissionResult } from '../types';

// Lazy load react-native-image-picker for permission checks
let ImagePicker: typeof import('react-native-image-picker') | null = null;

async function getImagePicker() {
  if (!ImagePicker) {
    ImagePicker = await import('react-native-image-picker');
  }
  return ImagePicker;
}

/**
 * Map image picker permission to our PermissionStatus.
 */
function mapPermissionStatus(status: string): PermissionStatus {
  switch (status) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    case 'blocked':
      return 'blocked';
    case 'unavailable':
      return 'unavailable';
    case 'limited':
      return 'granted'; // Limited access is still usable
    default:
      return 'undetermined';
  }
}

/**
 * Check photo library permission on native.
 */
export async function checkPhotoLibraryPermission(): Promise<PermissionStatus> {
  try {
    const imagePicker = await getImagePicker();

    // Check if the library exists and has the right method
    if (typeof imagePicker.launchImageLibrary !== 'function') {
      return 'unavailable';
    }

    // We can't directly check permissions without triggering the picker
    // Return undetermined as we need to request to know
    return 'undetermined';
  } catch {
    return 'unavailable';
  }
}

/**
 * Request photo library permission on native.
 */
export async function requestPhotoLibraryPermission(): Promise<PermissionStatus> {
  try {
    const imagePicker = await getImagePicker();

    // Launch the image library to trigger permission request
    // This is a common pattern since react-native-image-picker doesn't expose
    // a direct permission request API
    const result = await imagePicker.launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 0,
    });

    if (result.didCancel) {
      return 'granted'; // User cancelled but permission was granted
    }

    if (result.errorCode === 'permission') {
      return 'denied';
    }

    return 'granted';
  } catch (error) {
    // If permission was denied, we'll get an error
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.toLowerCase().includes('permission')) {
      return 'denied';
    }

    return 'unavailable';
  }
}

/**
 * Check camera permission on native.
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  try {
    const imagePicker = await getImagePicker();

    if (typeof imagePicker.launchCamera !== 'function') {
      return 'unavailable';
    }

    return 'undetermined';
  } catch {
    return 'unavailable';
  }
}

/**
 * Request camera permission on native.
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  try {
    const imagePicker = await getImagePicker();

    // Launch camera to trigger permission request
    const result = await imagePicker.launchCamera({
      mediaType: 'photo',
      saveToPhotos: false,
    });

    if (result.didCancel) {
      return 'granted'; // User cancelled but permission was granted
    }

    if (result.errorCode === 'permission') {
      return 'denied';
    }

    if (result.errorCode === 'camera_unavailable') {
      return 'unavailable';
    }

    return 'granted';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.toLowerCase().includes('permission')) {
      return 'denied';
    }

    return 'unavailable';
  }
}

/**
 * Check all file-related permissions.
 */
export async function checkPermissions(): Promise<PermissionResult> {
  const [photoLibrary, camera] = await Promise.all([
    checkPhotoLibraryPermission(),
    checkCameraPermission(),
  ]);

  return {
    photoLibrary,
    camera,
    canAskAgain: photoLibrary === 'undetermined' || camera === 'undetermined',
  };
}

/**
 * Request all file-related permissions.
 */
export async function requestPermissions(): Promise<PermissionResult> {
  // Request photo library first (more commonly needed)
  const photoLibrary = await requestPhotoLibraryPermission();

  // Only request camera if photo library was granted
  let camera: PermissionStatus = 'undetermined';
  if (photoLibrary === 'granted') {
    camera = await requestCameraPermission();
  }

  return {
    photoLibrary,
    camera,
    canAskAgain: photoLibrary === 'blocked' || camera === 'blocked' ? false : true,
  };
}
