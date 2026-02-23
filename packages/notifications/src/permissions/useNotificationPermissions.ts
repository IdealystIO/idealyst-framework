import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseNotificationPermissionsOptions,
  UseNotificationPermissionsResult,
  PermissionStatus,
  PermissionResult,
  RequestPermissionOptions,
  NotificationError,
} from '../types';
import { DEFAULT_PERMISSION_RESULT } from '../constants';
import { createNotificationError } from '../errors';

/**
 * Factory that creates a useNotificationPermissions hook bound to platform-specific functions.
 */
export function createUseNotificationPermissionsHook(fns: {
  checkPermission: () => Promise<PermissionResult>;
  requestPermission: (options?: RequestPermissionOptions) => Promise<PermissionResult>;
  openNotificationSettings: () => Promise<void>;
}) {
  return function useNotificationPermissions(
    options: UseNotificationPermissionsOptions = {},
  ): UseNotificationPermissionsResult {
    const { autoCheck = false } = options;

    const [status, setStatus] = useState<PermissionStatus>('undetermined');
    const [permission, setPermission] = useState<PermissionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const initializedRef = useRef(false);
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;

      if (autoCheck && !initializedRef.current) {
        initializedRef.current = true;
        fns.checkPermission().then((result) => {
          if (mountedRef.current) {
            setStatus(result.status);
            setPermission(result);
          }
        }).catch(() => {
          // Silently fail on auto-check
        });
      }

      return () => {
        mountedRef.current = false;
      };
    }, [autoCheck]);

    const checkPermission = useCallback(async (): Promise<PermissionResult> => {
      setIsLoading(true);
      try {
        const result = await fns.checkPermission();
        if (mountedRef.current) {
          setStatus(result.status);
          setPermission(result);
        }
        return result;
      } catch (error) {
        throw createNotificationError(
          'unknown',
          error instanceof Error ? error.message : String(error),
          error,
        );
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    }, []);

    const requestPermission = useCallback(
      async (reqOptions?: RequestPermissionOptions): Promise<PermissionResult> => {
        setIsLoading(true);
        try {
          const result = await fns.requestPermission(reqOptions);
          if (mountedRef.current) {
            setStatus(result.status);
            setPermission(result);
          }
          return result;
        } catch (error) {
          throw createNotificationError(
            'permission_denied',
            error instanceof Error ? error.message : String(error),
            error,
          );
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      [],
    );

    const openSettings = useCallback(async (): Promise<void> => {
      await fns.openNotificationSettings();
    }, []);

    return {
      status,
      permission,
      isLoading,
      checkPermission,
      requestPermission,
      openSettings,
    };
  };
}
