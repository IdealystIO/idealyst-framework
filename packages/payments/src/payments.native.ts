// ============================================================================
// Native IAP Implementation
// Wraps react-native-iap v14.x for StoreKit 2 (iOS) and Google Play Billing (Android)
//
// v14 API changes from earlier versions:
// - getProducts/getSubscriptions → fetchProducts({ skus, type })
// - requestPurchase returns void — results come via purchaseUpdatedListener
// - Errors come via purchaseErrorListener
// - Product fields: id (not productId), displayPrice (not localizedPrice)
// - Purchase fields: productId, id (transaction ID)
// ============================================================================

import { Platform } from 'react-native';
import type {
  IAPConfig,
  IAPProviderStatus,
  IAPProduct,
  IAPSubscription,
  IAPPurchase,
  ProductPlatform,
  SubscriptionPeriod,
  SubscriptionPeriodUnit,
  SubscriptionDiscount,
  DiscountPaymentMode,
} from './types';
import { INITIAL_PROVIDER_STATUS } from './constants';
import { createIAPError, normalizeError } from './errors';

// Graceful optional import — react-native-iap may not be installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let RNIap: any = null;
try {
  RNIap = require('react-native-iap');
} catch {
  // Will degrade gracefully when methods are called
}

// Module-level state
let _status: IAPProviderStatus = { ...INITIAL_PROVIDER_STATUS };
let _config: IAPConfig = {};

// Listener subscriptions (EmitterSubscription-like objects with .remove())
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _purchaseUpdateSubscription: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _purchaseErrorSubscription: any = null;

// Pending purchase promise callbacks — one purchase at a time
let _pendingResolve: ((raw: unknown) => void) | null = null;
let _pendingReject: ((error: unknown) => void) | null = null;

/**
 * Get the current IAP provider status.
 */
export function getIAPStatus(): IAPProviderStatus {
  return { ..._status };
}

/**
 * Initialize the IAP connection to the native store.
 * Sets up purchaseUpdatedListener and purchaseErrorListener to bridge
 * v14's event-based purchase flow back to Promises.
 */
export async function initializeIAP(config?: IAPConfig): Promise<void> {
  if (!RNIap) {
    _status = {
      state: 'error',
      isStoreAvailable: false,
      error: createIAPError(
        'not_available',
        'react-native-iap is not installed. Run: yarn add react-native-iap',
      ),
    };
    return;
  }

  _status = { ..._status, state: 'initializing' };
  _config = config ?? {};

  try {
    await RNIap.initConnection();

    // Set up purchase listeners — these fire when requestPurchase completes or fails
    _purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      (purchase: unknown) => {
        if (_pendingResolve) {
          const resolve = _pendingResolve;
          _pendingResolve = null;
          _pendingReject = null;
          resolve(purchase);
        }
      },
    );

    _purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: unknown) => {
        if (_pendingReject) {
          const reject = _pendingReject;
          _pendingResolve = null;
          _pendingReject = null;
          reject(error);
        }
      },
    );

    _status = {
      state: 'ready',
      isStoreAvailable: true,
    };
  } catch (error) {
    _status = {
      state: 'error',
      isStoreAvailable: false,
      error: normalizeError(error),
    };
  }
}

/**
 * Fetch products (one-time purchases) from the store by SKU.
 */
export async function getProducts(skus: string[]): Promise<IAPProduct[]> {
  assertReady();

  try {
    const products = await RNIap!.fetchProducts({ skus, type: 'in-app' });
    return products.map((p: unknown) => mapProduct(p, 'iap'));
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Fetch subscriptions from the store by SKU.
 */
export async function getSubscriptions(
  skus: string[],
): Promise<IAPSubscription[]> {
  assertReady();

  try {
    const products = await RNIap!.fetchProducts({ skus, type: 'subs' });
    return products.map(mapSubscription);
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Purchase a one-time product.
 */
export async function purchaseProduct(sku: string): Promise<IAPPurchase> {
  assertReady();

  try {
    const rawPurchase = await requestPurchaseWithEvents({
      request: {
        apple: { sku },
        google: { skus: [sku] },
      },
      type: 'in-app',
    });

    const mapped = mapPurchase(rawPurchase);

    if (_config.autoFinishTransactions) {
      await RNIap!.finishTransaction({ purchase: rawPurchase, isConsumable: false });
    }

    return mapped;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Purchase a subscription.
 * On Android, an `offerToken` from the subscription's offer details may be required.
 */
export async function purchaseSubscription(
  sku: string,
  offerToken?: string,
): Promise<IAPPurchase> {
  assertReady();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleRequest: any = { skus: [sku] };
    if (offerToken) {
      googleRequest.offerToken = offerToken;
    }

    const rawPurchase = await requestPurchaseWithEvents({
      request: {
        apple: { sku },
        google: googleRequest,
      },
      type: 'subs',
    });

    const mapped = mapPurchase(rawPurchase);

    if (_config.autoFinishTransactions) {
      await RNIap!.finishTransaction({ purchase: rawPurchase, isConsumable: false });
    }

    return mapped;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Finish a transaction. Call this after server-side receipt validation.
 *
 * @param purchase The purchase to finish.
 * @param isConsumable Whether the product is consumable (can be purchased again).
 */
export async function finishTransaction(
  purchase: IAPPurchase,
  isConsumable?: boolean,
): Promise<void> {
  assertReady();

  try {
    // finishTransaction expects the raw purchase object; we reconstruct the
    // minimal shape that react-native-iap needs (id + productId + purchaseToken)
    await RNIap!.finishTransaction({
      purchase: {
        id: purchase.transactionId,
        productId: purchase.sku,
        purchaseToken: purchase.purchaseToken,
      },
      isConsumable: isConsumable ?? false,
    });
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Restore previous purchases (e.g., after reinstall or on a new device).
 */
export async function restorePurchases(): Promise<IAPPurchase[]> {
  assertReady();

  try {
    const purchases = await RNIap!.getAvailablePurchases();
    return purchases.map((p: unknown) => mapPurchase(p, 'restored'));
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * End the IAP connection. Call on cleanup (e.g., app unmount).
 * Removes purchase listeners and rejects any pending purchase promise.
 */
export async function endConnection(): Promise<void> {
  if (!RNIap) return;

  // Reject any pending purchase
  if (_pendingReject) {
    const reject = _pendingReject;
    _pendingResolve = null;
    _pendingReject = null;
    reject(createIAPError('not_initialized', 'IAP connection ended while purchase was pending'));
  }

  // Remove listeners
  if (_purchaseUpdateSubscription) {
    _purchaseUpdateSubscription.remove();
    _purchaseUpdateSubscription = null;
  }
  if (_purchaseErrorSubscription) {
    _purchaseErrorSubscription.remove();
    _purchaseErrorSubscription = null;
  }

  try {
    await RNIap.endConnection();
  } catch {
    // Ignore errors during cleanup
  }

  _status = { ...INITIAL_PROVIDER_STATUS };
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Bridge v14's fire-and-forget requestPurchase to a Promise.
 * Stores resolve/reject callbacks that are settled by the purchase listeners
 * set up in initializeIAP.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function requestPurchaseWithEvents(params: any): Promise<any> {
  if (_pendingResolve || _pendingReject) {
    return Promise.reject(
      createIAPError('unknown', 'A purchase is already in progress'),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<any>((resolve, reject) => {
    _pendingResolve = resolve;
    _pendingReject = reject;

    // requestPurchase returns void in v14 — result comes through listeners
    RNIap!.requestPurchase(params).catch((error: unknown) => {
      // If requestPurchase itself throws (e.g., invalid params),
      // settle the promise immediately
      if (_pendingReject) {
        const pendingReject = _pendingReject;
        _pendingResolve = null;
        _pendingReject = null;
        pendingReject(error);
      }
    });
  });
}

function assertReady(): void {
  if (!RNIap) {
    throw createIAPError(
      'not_available',
      'react-native-iap is not installed',
    );
  }
  if (_status.state !== 'ready') {
    throw createIAPError(
      'not_initialized',
      'IAP connection not initialized. Call initializeIAP() first.',
    );
  }
}

function getPlatform(): ProductPlatform {
  return Platform.OS === 'ios' ? 'ios' : 'android';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(raw: any, type: 'iap' | 'sub' = 'iap'): IAPProduct {
  return {
    sku: raw.id ?? raw.productId ?? '',
    title: raw.title ?? raw.displayName ?? '',
    description: raw.description ?? '',
    price: typeof raw.price === 'number' ? raw.price : parseFloat(raw.price ?? '0'),
    priceFormatted: raw.displayPrice ?? raw.localizedPrice ?? String(raw.price ?? ''),
    currency: raw.currency ?? '',
    type,
    platform: getPlatform(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSubscription(raw: any): IAPSubscription {
  const base = mapProduct(raw, 'sub');

  return {
    ...base,
    subscriptionPeriod: parseSubscriptionPeriod(raw),
    introductoryPrice: raw.introductoryPrice
      ? mapDiscount(raw.introductoryPrice, 'introductory')
      : undefined,
    discounts: raw.discounts?.map((d: unknown) =>
      mapDiscount(d, 'promotional'),
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSubscriptionPeriod(raw: any): SubscriptionPeriod {
  // iOS: subscriptionPeriodUnitIOS / subscriptionPeriodNumberIOS
  if (raw.subscriptionPeriodUnitIOS) {
    return {
      unit: mapPeriodUnit(raw.subscriptionPeriodUnitIOS),
      numberOfUnits: parseInt(raw.subscriptionPeriodNumberIOS ?? '1', 10),
    };
  }

  // Android: subscriptionOfferDetailsAndroid may contain period info
  if (raw.subscriptionOfferDetailsAndroid?.length) {
    const offer = raw.subscriptionOfferDetailsAndroid[0];
    const pricingPhases = offer?.pricingPhases?.pricingPhaseList;
    if (pricingPhases?.length) {
      const billingPeriod = pricingPhases[0]?.billingPeriod;
      if (billingPeriod) {
        return parseISO8601Period(billingPeriod);
      }
    }
  }

  // Fallback: subscriptionPeriodAndroid (older format)
  if (raw.subscriptionPeriodAndroid) {
    return parseISO8601Period(raw.subscriptionPeriodAndroid);
  }

  return { unit: 'month', numberOfUnits: 1 };
}

function mapPeriodUnit(unit: string): SubscriptionPeriodUnit {
  switch (unit.toUpperCase()) {
    case 'DAY':
      return 'day';
    case 'WEEK':
      return 'week';
    case 'MONTH':
      return 'month';
    case 'YEAR':
      return 'year';
    default:
      return 'month';
  }
}

function parseISO8601Period(period: string): SubscriptionPeriod {
  // Simple ISO 8601 duration parser for P{n}{unit} (e.g., P1M, P3M, P1Y, P7D)
  const match = period.match(/P(\d+)([DWMY])/i);
  if (!match) return { unit: 'month', numberOfUnits: 1 };

  const num = parseInt(match[1], 10);
  switch (match[2].toUpperCase()) {
    case 'D':
      return { unit: 'day', numberOfUnits: num };
    case 'W':
      return { unit: 'week', numberOfUnits: num };
    case 'M':
      return { unit: 'month', numberOfUnits: num };
    case 'Y':
      return { unit: 'year', numberOfUnits: num };
    default:
      return { unit: 'month', numberOfUnits: num };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDiscount(raw: any, type: 'introductory' | 'promotional'): SubscriptionDiscount {
  const paymentModeMap: Record<string, DiscountPaymentMode> = {
    FREETRIAL: 'freeTrial',
    FREE_TRIAL: 'freeTrial',
    PAYASYOUGO: 'payAsYouGo',
    PAY_AS_YOU_GO: 'payAsYouGo',
    PAYUPFRONT: 'payUpFront',
    PAY_UP_FRONT: 'payUpFront',
  };

  return {
    identifier: raw.identifier,
    price: parseFloat(raw.price ?? '0'),
    priceFormatted: raw.displayPrice ?? raw.localizedPrice ?? raw.price ?? '',
    period: raw.subscriptionPeriod
      ? parseISO8601Period(raw.subscriptionPeriod)
      : { unit: 'month', numberOfUnits: 1 },
    paymentMode:
      paymentModeMap[(raw.paymentMode ?? '').toUpperCase()] ?? 'freeTrial',
    type,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPurchase(raw: any, stateOverride?: IAPPurchase['purchaseState']): IAPPurchase {
  // v14: transaction ID is in `id`, product is in `productId`
  return {
    sku: raw.productId ?? raw.id ?? '',
    transactionId: raw.id ?? raw.transactionId ?? '',
    transactionDate: raw.transactionDate
      ? (typeof raw.transactionDate === 'number'
          ? raw.transactionDate
          : parseInt(raw.transactionDate, 10))
      : Date.now(),
    transactionReceipt: raw.transactionReceipt ?? raw.dataAndroid ?? '',
    purchaseToken: raw.purchaseToken,
    isAcknowledged: raw.isAcknowledgedAndroid,
    purchaseState: stateOverride ?? 'purchased',
  };
}
