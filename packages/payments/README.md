# @idealyst/payments

Cross-platform In-App Purchase (IAP) wrapper for React Native. Supports StoreKit 2 (iOS) and Google Play Billing (Android) via `react-native-iap`.

## Installation

```bash
yarn add @idealyst/payments

# React Native — required for IAP:
yarn add react-native-iap
cd ios && pod install
```

Follow the [react-native-iap setup guide](https://github.com/dooboolab-community/react-native-iap#installation) for iOS/Android configuration.

### Web

No additional dependencies. Web provides a stub — `initializeIAP()` succeeds but product fetches return empty arrays and purchase actions throw descriptive errors.

## Quick Start

```tsx
import { useIAP } from '@idealyst/payments';

function SubscriptionScreen() {
  const {
    isReady,
    subscriptions,
    isProcessing,
    error,
    purchaseSubscription,
    finishTransaction,
  } = useIAP({
    subscriptionSkus: ['pro_monthly', 'pro_yearly'],
  });

  const handleSubscribe = async (sku: string) => {
    try {
      const purchase = await purchaseSubscription(sku);

      // Validate receipt on your server first, then finish
      await validateReceiptOnServer(purchase.transactionReceipt);
      await finishTransaction(purchase);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
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
```

## Flat Function API

```typescript
import {
  initializeIAP,
  getProducts,
  getSubscriptions,
  purchaseProduct,
  purchaseSubscription,
  finishTransaction,
  restorePurchases,
  endConnection,
} from '@idealyst/payments';

await initializeIAP();
const products = await getProducts(['gem_pack_100', 'gem_pack_500']);
const purchase = await purchaseProduct('gem_pack_100');
await finishTransaction(purchase, true); // consumable
await endConnection(); // cleanup
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Products (one-time) | Yes | Yes | Stub |
| Subscriptions | Yes | Yes | Stub |
| Restore Purchases | Yes | Yes | Stub |
| useIAP hook | Yes | Yes | Stub |
| purchaseProduct | Yes | Yes | Throws |
| purchaseSubscription | Yes | Yes | Throws |
