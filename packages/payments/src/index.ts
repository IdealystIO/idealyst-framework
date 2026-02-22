// Default entry — re-exports web implementation.
// Platform-specific entry points (index.native.ts, index.web.ts) are resolved by bundlers.
export * from './types';
export { INITIAL_PROVIDER_STATUS } from './constants';
export { createIAPError, normalizeError } from './errors';
export {
  initializeIAP,
  getProducts,
  getSubscriptions,
  purchaseProduct,
  purchaseSubscription,
  finishTransaction,
  restorePurchases,
  getIAPStatus,
  endConnection,
} from './payments.web';

import { createUseIAPHook } from './usePayments';
import {
  initializeIAP,
  getProducts,
  getSubscriptions,
  purchaseProduct,
  purchaseSubscription,
  finishTransaction,
  restorePurchases,
  getIAPStatus,
  endConnection,
} from './payments.web';

export const useIAP = createUseIAPHook({
  initializeIAP,
  getProducts,
  getSubscriptions,
  purchaseProduct,
  purchaseSubscription,
  finishTransaction,
  restorePurchases,
  getIAPStatus,
  endConnection,
});
