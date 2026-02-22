import type { IAPError, IAPErrorCode } from './types';

export function createIAPError(
  code: IAPErrorCode,
  message: string,
  originalError?: unknown,
): IAPError {
  return { code, message, originalError };
}

/**
 * Normalize a react-native-iap error (or any thrown value) into an IAPError.
 *
 * react-native-iap v14 uses kebab-case ErrorCode enum values (e.g. 'user-cancelled').
 * Older versions used E_ prefix strings (e.g. 'E_USER_CANCELLED').
 * Both formats are handled here.
 */
export function normalizeError(error: unknown): IAPError {
  if (error && typeof error === 'object' && 'code' in error) {
    const iapError = error as { code?: string; message?: string };

    switch (iapError.code) {
      // v14: 'user-cancelled' | legacy: 'E_USER_CANCELLED'
      case 'user-cancelled':
      case 'E_USER_CANCELLED':
        return createIAPError(
          'user_cancelled',
          'Purchase was cancelled by user',
          error,
        );
      // v14: 'already-owned' | legacy: 'E_ALREADY_OWNED'
      case 'already-owned':
      case 'E_ALREADY_OWNED':
        return createIAPError(
          'already_owned',
          'This item has already been purchased',
          error,
        );
      // v14: 'not-prepared' | legacy: 'E_NOT_PREPARED'
      case 'not-prepared':
      case 'E_NOT_PREPARED':
        return createIAPError(
          'not_initialized',
          'IAP connection not initialized. Call initializeIAP() first.',
          error,
        );
      // v14: 'deferred-payment' | legacy: 'E_DEFERRED'
      case 'deferred-payment':
      case 'pending':
      case 'E_DEFERRED':
        return createIAPError(
          'purchase_pending',
          'Purchase is pending approval (e.g., Ask to Buy)',
          error,
        );
      // v14: 'item-unavailable' | legacy: 'E_ITEM_UNAVAILABLE'
      case 'item-unavailable':
      case 'E_ITEM_UNAVAILABLE':
        return createIAPError(
          'item_unavailable',
          'The requested product is not available in the store',
          error,
        );
      // v14: 'network-error' | legacy: 'E_NETWORK_ERROR'
      case 'network-error':
      case 'E_NETWORK_ERROR':
        return createIAPError(
          'network_error',
          iapError.message || 'A network error occurred',
          error,
        );
      // v14: 'service-error' | legacy: 'E_SERVICE_ERROR'
      case 'service-error':
      case 'E_SERVICE_ERROR':
        return createIAPError(
          'store_error',
          iapError.message || 'The store service encountered an error',
          error,
        );
      // v14: 'iap-not-available'
      case 'iap-not-available':
        return createIAPError(
          'not_available',
          'In-App Purchases are not available on this device',
          error,
        );
      default:
        return createIAPError(
          'unknown',
          iapError.message || 'An unknown IAP error occurred',
          error,
        );
    }
  }

  if (error instanceof Error) {
    return createIAPError('unknown', error.message, error);
  }

  return createIAPError('unknown', String(error), error);
}
