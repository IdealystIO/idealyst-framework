export const paymentsGuides: Record<string, string> = {
  "idealyst://payments/overview": `# @idealyst/payments Overview

Cross-platform In-App Purchase (IAP) wrapper for React Native. Wraps \`react-native-iap\` for StoreKit 2 (iOS) and Google Play Billing (Android).

## Features

- **StoreKit 2** — Native iOS in-app purchases and subscriptions
- **Google Play Billing** — Native Android in-app purchases and subscriptions
- **Cross-Platform** — Single API for React Native and web (web is stub/noop)
- **Flat Functions + Hook** — Use \`initializeIAP()\`, \`purchaseProduct()\` directly, or \`useIAP()\` hook
- **Receipt Validation** — \`autoFinishTransactions: false\` by default for server-side validation
- **Graceful Degradation** — Falls back cleanly when react-native-iap isn't installed
- **TypeScript** — Full type safety

## Installation

\`\`\`bash
yarn add @idealyst/payments

# React Native — required for IAP:
yarn add react-native-iap
cd ios && pod install
\`\`\`

## Web Support

Web provides a functional stub — \`initializeIAP()\` succeeds but product fetches return empty arrays. Purchase actions throw descriptive errors since IAP is native-only.

## Quick Start

\`\`\`tsx
import { useIAP } from '@idealyst/payments';

function SubscriptionScreen() {
  const {
    isReady,
    subscriptions,
    isProcessing,
    purchaseSubscription,
    finishTransaction,
  } = useIAP({
    subscriptionSkus: ['pro_monthly', 'pro_yearly'],
  });

  const handleSubscribe = async (sku: string) => {
    const purchase = await purchaseSubscription(sku);
    await validateReceiptOnServer(purchase.transactionReceipt);
    await finishTransaction(purchase);
  };

  if (!isReady) return <Text>Loading...</Text>;

  return (
    <View>
      {subscriptions.map((sub) => (
        <Button
          key={sub.sku}
          onPress={() => handleSubscribe(sub.sku)}
          disabled={isProcessing}
        >
          {sub.title} — {sub.priceFormatted}
        </Button>
      ))}
    </View>
  );
}
\`\`\`

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Products (one-time) | Yes | Yes | Stub |
| Subscriptions | Yes | Yes | Stub |
| Restore Purchases | Yes | Yes | Stub |
| useIAP hook | Yes | Yes | Stub |
| purchaseProduct | Yes | Yes | Throws |
| purchaseSubscription | Yes | Yes | Throws |
`,

  "idealyst://payments/api": `# Payments API Reference

Complete API reference for @idealyst/payments (In-App Purchases).

---

## Flat Functions

### initializeIAP

Initialize the IAP connection to the native store.

\`\`\`tsx
import { initializeIAP } from '@idealyst/payments';

await initializeIAP();

// Or with config:
await initializeIAP({
  autoFinishTransactions: false, // default — validate receipts server-side first
});
\`\`\`

**IAPConfig:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| autoFinishTransactions | boolean | false | Auto-finish transactions after purchase. Set to false for server-side receipt validation. |

### getProducts

Fetch one-time purchase products from the store.

\`\`\`tsx
import { getProducts } from '@idealyst/payments';

const products = await getProducts(['gem_pack_100', 'gem_pack_500']);
// [
//   { sku: 'gem_pack_100', title: '100 Gems', price: 0.99, priceFormatted: '$0.99', ... },
//   { sku: 'gem_pack_500', title: '500 Gems', price: 3.99, priceFormatted: '$3.99', ... },
// ]
\`\`\`

### getSubscriptions

Fetch subscription products from the store.

\`\`\`tsx
import { getSubscriptions } from '@idealyst/payments';

const subs = await getSubscriptions(['pro_monthly', 'pro_yearly']);
// [
//   { sku: 'pro_monthly', title: 'Pro Monthly', price: 9.99, subscriptionPeriod: { unit: 'month', numberOfUnits: 1 }, ... },
//   { sku: 'pro_yearly', title: 'Pro Yearly', price: 79.99, subscriptionPeriod: { unit: 'year', numberOfUnits: 1 }, ... },
// ]
\`\`\`

### purchaseProduct

Purchase a one-time product. Returns the purchase record.

\`\`\`tsx
import { purchaseProduct } from '@idealyst/payments';

const purchase = await purchaseProduct('gem_pack_100');
console.log(purchase.transactionId);
console.log(purchase.transactionReceipt); // send to server for validation
\`\`\`

### purchaseSubscription

Purchase a subscription. On Android, an \`offerToken\` may be required.

\`\`\`tsx
import { purchaseSubscription } from '@idealyst/payments';

const purchase = await purchaseSubscription('pro_monthly');
// or with offer token on Android:
const purchase = await purchaseSubscription('pro_monthly', offerToken);
\`\`\`

### finishTransaction

Finish a transaction after server-side receipt validation. **You must call this** for purchases to be acknowledged by the store.

\`\`\`tsx
import { finishTransaction } from '@idealyst/payments';

// After validating receipt on your server:
await finishTransaction(purchase);

// For consumable products (can be purchased again):
await finishTransaction(purchase, true);
\`\`\`

### restorePurchases

Restore previous purchases (e.g., after reinstall or on a new device).

\`\`\`tsx
import { restorePurchases } from '@idealyst/payments';

const purchases = await restorePurchases();
// Each purchase has purchaseState: 'restored'
\`\`\`

### getIAPStatus

Get the current IAP provider status.

\`\`\`tsx
import { getIAPStatus } from '@idealyst/payments';

const status = getIAPStatus();
// { state: 'ready', isStoreAvailable: true }
\`\`\`

### endConnection

End the IAP connection. Call on cleanup.

\`\`\`tsx
import { endConnection } from '@idealyst/payments';

await endConnection();
\`\`\`

---

## useIAP Hook

Convenience hook that wraps the flat functions with React state management.

\`\`\`tsx
import { useIAP } from '@idealyst/payments';

const {
  // State
  isReady,             // boolean — IAP connection ready
  isProcessing,        // boolean — purchase or fetch in progress
  error,               // IAPError | null
  products,            // IAPProduct[] — fetched products
  subscriptions,       // IAPSubscription[] — fetched subscriptions
  currentPurchase,     // IAPPurchase | null — most recent purchase

  // Actions
  initialize,          // (config?: IAPConfig) => Promise<void>
  getProducts,         // (skus: string[]) => Promise<IAPProduct[]>
  getSubscriptions,    // (skus: string[]) => Promise<IAPSubscription[]>
  purchaseProduct,     // (sku: string) => Promise<IAPPurchase>
  purchaseSubscription,// (sku: string, offerToken?: string) => Promise<IAPPurchase>
  finishTransaction,   // (purchase: IAPPurchase, isConsumable?: boolean) => Promise<void>
  restorePurchases,    // () => Promise<IAPPurchase[]>
  clearError,          // () => void
} = useIAP(options?);
\`\`\`

**UseIAPOptions:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| config | IAPConfig | — | Auto-initialize with this config |
| productSkus | string[] | — | Product SKUs to auto-fetch after init |
| subscriptionSkus | string[] | — | Subscription SKUs to auto-fetch after init |

---

## Types

### IAPProduct

\`\`\`tsx
interface IAPProduct {
  sku: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  currency: string;
  type: 'iap' | 'sub';
  platform: 'ios' | 'android';
}
\`\`\`

### IAPSubscription

\`\`\`tsx
interface IAPSubscription extends IAPProduct {
  subscriptionPeriod: SubscriptionPeriod;
  introductoryPrice?: SubscriptionDiscount;
  discounts?: SubscriptionDiscount[];
}

interface SubscriptionPeriod {
  unit: 'day' | 'week' | 'month' | 'year';
  numberOfUnits: number;
}
\`\`\`

### IAPPurchase

\`\`\`tsx
interface IAPPurchase {
  sku: string;
  transactionId: string;
  transactionDate: number;
  transactionReceipt: string;
  purchaseToken?: string;       // Android only
  isAcknowledged?: boolean;     // Android only
  purchaseState: 'purchased' | 'pending' | 'restored';
}
\`\`\`

### IAPError

\`\`\`tsx
interface IAPError {
  code: IAPErrorCode;
  message: string;
  originalError?: unknown;
}

type IAPErrorCode =
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
\`\`\`
`,

  "idealyst://payments/examples": `# Payments Examples

Complete code examples for common @idealyst/payments IAP patterns.

## Subscription Screen with Hook

\`\`\`tsx
import { useIAP } from '@idealyst/payments';
import { Button, View, Text } from '@idealyst/components';

function SubscriptionScreen() {
  const {
    isReady,
    subscriptions,
    isProcessing,
    error,
    purchaseSubscription,
    finishTransaction,
    restorePurchases,
    clearError,
  } = useIAP({
    subscriptionSkus: ['pro_monthly', 'pro_yearly'],
  });

  const handleSubscribe = async (sku: string) => {
    try {
      const purchase = await purchaseSubscription(sku);

      // IMPORTANT: Validate receipt on your server before finishing
      await fetch('/api/validate-receipt', {
        method: 'POST',
        body: JSON.stringify({
          receipt: purchase.transactionReceipt,
          sku: purchase.sku,
        }),
      });

      await finishTransaction(purchase);
      console.log('Subscription active!');
    } catch (err) {
      // Error is automatically set in hook state
      console.error('Purchase failed:', err);
    }
  };

  const handleRestore = async () => {
    try {
      const purchases = await restorePurchases();
      console.log('Restored:', purchases.length, 'purchases');
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  if (!isReady) return <Text>Loading store...</Text>;

  return (
    <View>
      {subscriptions.map((sub) => (
        <View key={sub.sku}>
          <Text>{sub.title}</Text>
          <Text>{sub.priceFormatted} / {sub.subscriptionPeriod.unit}</Text>
          <Button
            onPress={() => handleSubscribe(sub.sku)}
            disabled={isProcessing}
            intent="primary"
          >
            Subscribe
          </Button>
        </View>
      ))}

      <Button onPress={handleRestore} disabled={isProcessing} intent="secondary">
        Restore Purchases
      </Button>

      {error && error.code !== 'user_cancelled' && (
        <View>
          <Text intent="danger">{error.message}</Text>
          <Button onPress={clearError}>Dismiss</Button>
        </View>
      )}
    </View>
  );
}
\`\`\`

## Consumable Product Purchase

\`\`\`tsx
import { useIAP } from '@idealyst/payments';

function GemStoreScreen() {
  const {
    isReady,
    products,
    isProcessing,
    purchaseProduct,
    finishTransaction,
  } = useIAP({
    productSkus: ['gems_100', 'gems_500', 'gems_1000'],
  });

  const handleBuy = async (sku: string) => {
    try {
      const purchase = await purchaseProduct(sku);

      // Validate + credit gems on server
      await fetch('/api/credit-gems', {
        method: 'POST',
        body: JSON.stringify({
          receipt: purchase.transactionReceipt,
          sku: purchase.sku,
        }),
      });

      // Finish as consumable so it can be purchased again
      await finishTransaction(purchase, true);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  if (!isReady) return <Text>Loading...</Text>;

  return (
    <View>
      {products.map((product) => (
        <Button
          key={product.sku}
          onPress={() => handleBuy(product.sku)}
          disabled={isProcessing}
        >
          {product.title} — {product.priceFormatted}
        </Button>
      ))}
    </View>
  );
}
\`\`\`

## Flat Functions (No Hook)

\`\`\`tsx
import {
  initializeIAP,
  getSubscriptions,
  purchaseSubscription,
  finishTransaction,
  restorePurchases,
  endConnection,
} from '@idealyst/payments';
import type { IAPError } from '@idealyst/payments';

// Initialize once at app startup
async function setupIAP() {
  await initializeIAP({ autoFinishTransactions: false });
}

// Fetch available subscriptions
async function fetchPlans() {
  return await getSubscriptions(['pro_monthly', 'pro_yearly']);
}

// Process a subscription purchase
async function subscribe(sku: string) {
  try {
    const purchase = await purchaseSubscription(sku);

    // Validate on server
    const valid = await validateReceipt(purchase.transactionReceipt);
    if (valid) {
      await finishTransaction(purchase);
      return purchase;
    }

    throw new Error('Receipt validation failed');
  } catch (err) {
    const iapErr = err as IAPError;
    if (iapErr.code === 'user_cancelled') {
      return null; // User cancelled — not an error
    }
    throw iapErr;
  }
}

// Cleanup on app exit
async function cleanup() {
  await endConnection();
}
\`\`\`

## Best Practices

1. **Always validate receipts** — Never trust client-side purchase data. Validate \`transactionReceipt\` on your server before granting entitlements.
2. **Don't auto-finish** — Keep \`autoFinishTransactions: false\` (default) in production. Finish transactions only after server validation.
3. **Handle cancellation** — \`user_cancelled\` is not an error; don't show error UI for it.
4. **Consumable vs non-consumable** — Pass \`isConsumable: true\` to \`finishTransaction()\` for items that can be repurchased.
5. **Call endConnection()** — The \`useIAP\` hook handles this automatically on unmount. If using flat functions, call \`endConnection()\` when done.
6. **Offer tokens (Android)** — Google Play Billing v6+ may require an \`offerToken\` for subscription purchases. Get it from the subscription's offer details.
7. **Restore purchases** — Always provide a "Restore Purchases" button. Apple requires this for App Store review.
8. **Error handling** — Always wrap purchase calls in try/catch. Use the \`error.code\` to distinguish between user cancellation and actual errors.
`,
};
