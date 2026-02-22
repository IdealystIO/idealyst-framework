// ============================================================================
// Web IAP Stub
//
// In-App Purchases are a native-only concept (StoreKit / Google Play Billing).
// This stub allows the hook and types to be imported on web without errors,
// but all operations throw descriptive errors.
// ============================================================================

import type {
  IAPConfig,
  IAPProviderStatus,
  IAPProduct,
  IAPSubscription,
  IAPPurchase,
} from './types';
import { INITIAL_PROVIDER_STATUS } from './constants';
import { createIAPError } from './errors';

const NOT_SUPPORTED_MESSAGE =
  'In-App Purchases are only available on native iOS and Android platforms. ' +
  'For web payments, use a payment processor like Stripe directly.';

let _status: IAPProviderStatus = { ...INITIAL_PROVIDER_STATUS };

export function getIAPStatus(): IAPProviderStatus {
  return { ..._status };
}

export async function initializeIAP(_config?: IAPConfig): Promise<void> {
  _status = {
    state: 'ready',
    isStoreAvailable: false,
  };
}

export async function getProducts(_skus: string[]): Promise<IAPProduct[]> {
  return [];
}

export async function getSubscriptions(
  _skus: string[],
): Promise<IAPSubscription[]> {
  return [];
}

export async function purchaseProduct(_sku: string): Promise<IAPPurchase> {
  throw createIAPError('not_supported', NOT_SUPPORTED_MESSAGE);
}

export async function purchaseSubscription(
  _sku: string,
  _offerToken?: string,
): Promise<IAPPurchase> {
  throw createIAPError('not_supported', NOT_SUPPORTED_MESSAGE);
}

export async function finishTransaction(
  _purchase: IAPPurchase,
  _isConsumable?: boolean,
): Promise<void> {
  throw createIAPError('not_supported', NOT_SUPPORTED_MESSAGE);
}

export async function restorePurchases(): Promise<IAPPurchase[]> {
  return [];
}

export async function endConnection(): Promise<void> {
  _status = { ...INITIAL_PROVIDER_STATUS };
}
