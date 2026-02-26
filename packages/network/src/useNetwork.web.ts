import { useState, useEffect, useCallback, useRef } from 'react';
import type { NetworkState, UseNetworkOptions, UseNetworkResult } from './types';
import { getNetworkState, addNetworkStateListener } from './network.web';

/**
 * React hook for monitoring network connectivity on web.
 *
 * Uses `navigator.onLine`, the `online`/`offline` events,
 * and the Network Information API when available.
 */
export function useNetwork(options: UseNetworkOptions = {}): UseNetworkResult {
  const { fetchOnMount = true, reachabilityUrl, reachabilityPollInterval = 0 } = options;
  const mountedRef = useRef(true);

  const [state, setState] = useState<NetworkState>(getNetworkState);

  // Subscribe to network state changes
  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = addNetworkStateListener((newState) => {
      if (mountedRef.current) {
        setState(newState);
      }
    });

    if (fetchOnMount) {
      setState(getNetworkState());
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [fetchOnMount]);

  // Optional reachability polling
  useEffect(() => {
    if (!reachabilityPollInterval || reachabilityPollInterval <= 0) return;

    const url = reachabilityUrl || 'https://clients3.google.com/generate_204';

    const check = async () => {
      if (!mountedRef.current) return;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
        clearTimeout(timer);
        if (mountedRef.current) {
          setState((prev) => ({ ...prev, isInternetReachable: true }));
        }
      } catch {
        if (mountedRef.current) {
          setState((prev) => ({ ...prev, isInternetReachable: false }));
        }
      }
    };

    check();
    const id = setInterval(check, reachabilityPollInterval);
    return () => clearInterval(id);
  }, [reachabilityUrl, reachabilityPollInterval]);

  const refresh = useCallback(async (): Promise<NetworkState> => {
    const newState = getNetworkState();
    if (mountedRef.current) {
      setState(newState);
    }
    return newState;
  }, []);

  return {
    state,
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
    effectiveType: state.effectiveType,
    refresh,
  };
}
