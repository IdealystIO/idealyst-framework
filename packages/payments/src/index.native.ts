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
} from './payments.native';

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
} from './payments.native';

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
