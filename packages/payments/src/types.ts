// ============================================================================
// Product Types
// ============================================================================

export type ProductType = 'iap' | 'sub';

export type ProductPlatform = 'ios' | 'android';

export interface IAPProduct {
  /** Store-specific product identifier (SKU). */
  sku: string;
  /** Product title from the store. */
  title: string;
  /** Product description from the store. */
  description: string;
  /** Price as a number (e.g., 4.99). */
  price: number;
  /** Localized price string (e.g., "$4.99"). */
  priceFormatted: string;
  /** ISO 4217 currency code (e.g., "USD"). */
  currency: string;
  /** Product type: one-time purchase or subscription. */
  type: ProductType;
  /** Platform this product was fetched from. */
  platform: ProductPlatform;
}

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionPeriodUnit = 'day' | 'week' | 'month' | 'year';

export interface SubscriptionPeriod {
  /** Time unit. */
  unit: SubscriptionPeriodUnit;
  /** Number of units per period (e.g., 1 month, 3 months). */
  numberOfUnits: number;
}

export type DiscountPaymentMode = 'freeTrial' | 'payAsYouGo' | 'payUpFront';
export type DiscountType = 'introductory' | 'promotional';

export interface SubscriptionDiscount {
  /** Discount identifier (promotional only). */
  identifier?: string;
  /** Discounted price as a number. */
  price: number;
  /** Localized discounted price string. */
  priceFormatted: string;
  /** Discount billing period. */
  period: SubscriptionPeriod;
  /** How the discount is applied. */
  paymentMode: DiscountPaymentMode;
  /** Whether this is introductory or promotional. */
  type: DiscountType;
}

export interface IAPSubscription extends IAPProduct {
  /** Subscription billing period. */
  subscriptionPeriod: SubscriptionPeriod;
  /** Introductory offer, if any. */
  introductoryPrice?: SubscriptionDiscount;
  /** Promotional discounts (iOS). */
  discounts?: SubscriptionDiscount[];
}

// ============================================================================
// Purchase Types
// ============================================================================

export type PurchaseState = 'purchased' | 'pending' | 'restored';

export interface IAPPurchase {
  /** Product SKU. */
  sku: string;
  /** Store transaction ID. */
  transactionId: string;
  /** Transaction timestamp (ms since epoch). */
  transactionDate: number;
  /** Receipt data (base64 on iOS, JSON string on Android). */
  transactionReceipt: string;
  /** Google Play purchase token (Android only). */
  purchaseToken?: string;
  /** Whether the purchase has been acknowledged (Android only). */
  isAcknowledged?: boolean;
  /** Current purchase state. */
  purchaseState: PurchaseState;
}

// ============================================================================
// Configuration
// ============================================================================

export interface IAPConfig {
  /**
   * If true, transactions are automatically finished after purchase.
   * Default: false.
   *
   * WARNING: Set to false in production so you can validate receipts
   * on your server before finishing transactions.
   */
  autoFinishTransactions?: boolean;
}

// ============================================================================
// Provider State
// ============================================================================

export type IAPProviderState =
  | 'uninitialized'
  | 'initializing'
  | 'ready'
  | 'error';

export interface IAPProviderStatus {
  /** Current state of the IAP connection. */
  state: IAPProviderState;
  /** Whether the native store is available and connected. */
  isStoreAvailable: boolean;
  /** Error if state is 'error'. */
  error?: IAPError;
}

// ============================================================================
// Error Types
// ============================================================================

export type IAPErrorCode =
  | 'not_initialized'
  | 'not_available'
  | 'not_supported'
  | 'user_cancelled'
  | 'already_owned'
  | 'purchase_pending'
  | 'item_unavailable'
  | 'network_error'
  | 'store_error'
  | 'unknown';

export interface IAPError {
  code: IAPErrorCode;
  message: string;
  /** Original error from react-native-iap. */
  originalError?: unknown;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseIAPOptions {
  /** If provided, auto-initializes the IAP connection. */
  config?: IAPConfig;
  /** Product SKUs to auto-fetch after initialization. */
  productSkus?: string[];
  /** Subscription SKUs to auto-fetch after initialization. */
  subscriptionSkus?: string[];
}

export interface UseIAPResult {
  // State
  /** Whether the IAP connection is ready. */
  isReady: boolean;
  /** Whether a purchase or fetch is in progress. */
  isProcessing: boolean;
  /** Current error, if any. */
  error: IAPError | null;
  /** Fetched products. */
  products: IAPProduct[];
  /** Fetched subscriptions. */
  subscriptions: IAPSubscription[];
  /** The most recent purchase (useful for handling post-purchase flows). */
  currentPurchase: IAPPurchase | null;

  // Actions
  /** Initialize the IAP connection. */
  initialize: (config?: IAPConfig) => Promise<void>;
  /** Fetch products by SKU. */
  getProducts: (skus: string[]) => Promise<IAPProduct[]>;
  /** Fetch subscriptions by SKU. */
  getSubscriptions: (skus: string[]) => Promise<IAPSubscription[]>;
  /** Purchase a one-time product. */
  purchaseProduct: (sku: string) => Promise<IAPPurchase>;
  /** Purchase a subscription. */
  purchaseSubscription: (sku: string, offerToken?: string) => Promise<IAPPurchase>;
  /** Finish a transaction (call after server-side validation). */
  finishTransaction: (purchase: IAPPurchase, isConsumable?: boolean) => Promise<void>;
  /** Restore previous purchases. */
  restorePurchases: () => Promise<IAPPurchase[]>;
  /** Clear the current error. */
  clearError: () => void;
}
