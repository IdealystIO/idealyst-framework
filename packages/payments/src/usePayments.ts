import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseIAPOptions,
  UseIAPResult,
  IAPProviderStatus,
  IAPConfig,
  IAPError,
  IAPProduct,
  IAPSubscription,
  IAPPurchase,
} from './types';

/**
 * Factory that creates a useIAP hook bound to platform-specific functions.
 * Each platform entry point calls this with the correct implementations.
 */
export function createUseIAPHook(fns: {
  initializeIAP: (config?: IAPConfig) => Promise<void>;
  getProducts: (skus: string[]) => Promise<IAPProduct[]>;
  getSubscriptions: (skus: string[]) => Promise<IAPSubscription[]>;
  purchaseProduct: (sku: string) => Promise<IAPPurchase>;
  purchaseSubscription: (sku: string, offerToken?: string) => Promise<IAPPurchase>;
  finishTransaction: (purchase: IAPPurchase, isConsumable?: boolean) => Promise<void>;
  restorePurchases: () => Promise<IAPPurchase[]>;
  getIAPStatus: () => IAPProviderStatus;
  endConnection: () => Promise<void>;
}) {
  return function useIAP(options: UseIAPOptions = {}): UseIAPResult {
    const { config, productSkus, subscriptionSkus } = options;

    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<IAPError | null>(null);
    const [products, setProducts] = useState<IAPProduct[]>([]);
    const [subscriptions, setSubscriptions] = useState<IAPSubscription[]>([]);
    const [currentPurchase, setCurrentPurchase] = useState<IAPPurchase | null>(null);
    const initializedRef = useRef(false);

    // Auto-initialize and fetch products/subscriptions
    useEffect(() => {
      if (initializedRef.current) return;
      if (config === undefined && !productSkus && !subscriptionSkus) return;
      initializedRef.current = true;

      const init = async () => {
        try {
          await fns.initializeIAP(config);
          const status = fns.getIAPStatus();

          if (status.state === 'ready') {
            setIsReady(true);

            if (productSkus?.length) {
              const prods = await fns.getProducts(productSkus);
              setProducts(prods);
            }
            if (subscriptionSkus?.length) {
              const subs = await fns.getSubscriptions(subscriptionSkus);
              setSubscriptions(subs);
            }
          } else if (status.error) {
            setError(status.error);
          }
        } catch (err) {
          setError(err as IAPError);
        }
      };
      init();

      return () => {
        fns.endConnection();
      };
    }, [config, productSkus, subscriptionSkus]);

    const initialize = useCallback(async (initConfig?: IAPConfig) => {
      setError(null);
      try {
        await fns.initializeIAP(initConfig);
        const status = fns.getIAPStatus();
        setIsReady(status.state === 'ready');
        if (status.error) setError(status.error);
      } catch (err) {
        setError(err as IAPError);
      }
    }, []);

    const getProductsAction = useCallback(async (skus: string[]) => {
      setIsProcessing(true);
      setError(null);
      try {
        const result = await fns.getProducts(skus);
        setProducts(result);
        return result;
      } catch (err) {
        const iapError = err as IAPError;
        setError(iapError);
        throw iapError;
      } finally {
        setIsProcessing(false);
      }
    }, []);

    const getSubscriptionsAction = useCallback(async (skus: string[]) => {
      setIsProcessing(true);
      setError(null);
      try {
        const result = await fns.getSubscriptions(skus);
        setSubscriptions(result);
        return result;
      } catch (err) {
        const iapError = err as IAPError;
        setError(iapError);
        throw iapError;
      } finally {
        setIsProcessing(false);
      }
    }, []);

    const purchaseProductAction = useCallback(async (sku: string) => {
      setIsProcessing(true);
      setError(null);
      try {
        const purchase = await fns.purchaseProduct(sku);
        setCurrentPurchase(purchase);
        return purchase;
      } catch (err) {
        const iapError = err as IAPError;
        setError(iapError);
        throw iapError;
      } finally {
        setIsProcessing(false);
      }
    }, []);

    const purchaseSubscriptionAction = useCallback(
      async (sku: string, offerToken?: string) => {
        setIsProcessing(true);
        setError(null);
        try {
          const purchase = await fns.purchaseSubscription(sku, offerToken);
          setCurrentPurchase(purchase);
          return purchase;
        } catch (err) {
          const iapError = err as IAPError;
          setError(iapError);
          throw iapError;
        } finally {
          setIsProcessing(false);
        }
      },
      [],
    );

    const finishTransactionAction = useCallback(
      async (purchase: IAPPurchase, isConsumable?: boolean) => {
        try {
          await fns.finishTransaction(purchase, isConsumable);
        } catch (err) {
          const iapError = err as IAPError;
          setError(iapError);
          throw iapError;
        }
      },
      [],
    );

    const restorePurchasesAction = useCallback(async () => {
      setIsProcessing(true);
      setError(null);
      try {
        return await fns.restorePurchases();
      } catch (err) {
        const iapError = err as IAPError;
        setError(iapError);
        throw iapError;
      } finally {
        setIsProcessing(false);
      }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
      isReady,
      isProcessing,
      error,
      products,
      subscriptions,
      currentPurchase,

      initialize,
      getProducts: getProductsAction,
      getSubscriptions: getSubscriptionsAction,
      purchaseProduct: purchaseProductAction,
      purchaseSubscription: purchaseSubscriptionAction,
      finishTransaction: finishTransactionAction,
      restorePurchases: restorePurchasesAction,
      clearError,
    };
  };
}
