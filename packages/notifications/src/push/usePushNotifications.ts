import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UsePushNotificationsOptions,
  UsePushNotificationsResult,
  PushToken,
  NotificationError,
  PermissionResult,
  RequestPermissionOptions,
  MessageHandler,
  TokenRefreshHandler,
} from '../types';
import { createNotificationError } from '../errors';

/**
 * Factory that creates a usePushNotifications hook bound to platform-specific functions.
 * Each platform entry point calls this with the correct implementations.
 */
export function createUsePushNotificationsHook(fns: {
  requestPushPermission: (options?: RequestPermissionOptions) => Promise<PermissionResult>;
  getPushToken: () => Promise<PushToken>;
  deletePushToken: () => Promise<void>;
  onForegroundMessage: (handler: MessageHandler) => () => void;
  onNotificationOpened: (handler: MessageHandler) => () => void;
  onTokenRefresh: (handler: TokenRefreshHandler) => () => void;
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeFromTopic: (topic: string) => Promise<void>;
}) {
  return function usePushNotifications(
    options: UsePushNotificationsOptions = {},
  ): UsePushNotificationsResult {
    const { autoRegister = false, onMessage, onNotificationOpened: onOpened, onTokenRefresh } = options;

    const [token, setToken] = useState<PushToken | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<NotificationError | null>(null);
    const mountedRef = useRef(true);
    const initializedRef = useRef(false);

    const register = useCallback(async (): Promise<PushToken> => {
      setIsLoading(true);
      setError(null);
      try {
        await fns.requestPushPermission();
        const pushToken = await fns.getPushToken();
        if (mountedRef.current) {
          setToken(pushToken);
          setIsRegistered(true);
        }
        return pushToken;
      } catch (err) {
        const notifError = err as NotificationError;
        if (mountedRef.current) setError(notifError);
        throw notifError;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    }, []);

    const unregister = useCallback(async (): Promise<void> => {
      setError(null);
      try {
        await fns.deletePushToken();
        if (mountedRef.current) {
          setToken(null);
          setIsRegistered(false);
        }
      } catch (err) {
        const notifError = err as NotificationError;
        if (mountedRef.current) setError(notifError);
        throw notifError;
      }
    }, []);

    const getToken = useCallback(async (): Promise<PushToken | null> => {
      try {
        const pushToken = await fns.getPushToken();
        if (mountedRef.current) setToken(pushToken);
        return pushToken;
      } catch {
        return null;
      }
    }, []);

    const subscribeToTopic = useCallback(async (topic: string): Promise<void> => {
      try {
        await fns.subscribeToTopic(topic);
      } catch (err) {
        const notifError = err as NotificationError;
        if (mountedRef.current) setError(notifError);
        throw notifError;
      }
    }, []);

    const unsubscribeFromTopic = useCallback(async (topic: string): Promise<void> => {
      try {
        await fns.unsubscribeFromTopic(topic);
      } catch (err) {
        const notifError = err as NotificationError;
        if (mountedRef.current) setError(notifError);
        throw notifError;
      }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    useEffect(() => {
      mountedRef.current = true;
      const unsubs: (() => void)[] = [];

      if (onMessage) {
        unsubs.push(fns.onForegroundMessage(onMessage));
      }
      if (onOpened) {
        unsubs.push(fns.onNotificationOpened(onOpened));
      }
      if (onTokenRefresh) {
        unsubs.push(
          fns.onTokenRefresh((newToken) => {
            if (mountedRef.current) setToken(newToken);
            onTokenRefresh(newToken);
          }),
        );
      }

      if (autoRegister && !initializedRef.current) {
        initializedRef.current = true;
        register().catch(() => {
          // Error is captured in state via the register function
        });
      }

      return () => {
        mountedRef.current = false;
        unsubs.forEach((u) => u());
      };
    }, [autoRegister, onMessage, onOpened, onTokenRefresh, register]);

    return {
      token,
      isRegistered,
      isLoading,
      error,
      register,
      unregister,
      getToken,
      subscribeToTopic,
      unsubscribeFromTopic,
      clearError,
    };
  };
}
