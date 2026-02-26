import { useState, useEffect, useCallback, useRef } from 'react';
import type { NetworkState, UseNetworkOptions, UseNetworkResult } from './types';
import { getNetworkState, addNetworkStateListener } from './network.native';

const DEFAULT_STATE: NetworkState = {
  isConnected: true,
  isInternetReachable: null,
  type: 'unknown',
  effectiveType: 'unknown',
  cellularGeneration: null,
  downlink: null,
  rtt: null,
  isDataSaving: null,
};

/**
 * React hook for monitoring network connectivity on React Native.
 *
 * Uses @react-native-community/netinfo under the hood.
 */
export function useNetwork(options: UseNetworkOptions = {}): UseNetworkResult {
  const { fetchOnMount = true } = options;
  const mountedRef = useRef(true);

  const [state, setState] = useState<NetworkState>(DEFAULT_STATE);

  // Subscribe to network state changes
  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = addNetworkStateListener((newState) => {
      if (mountedRef.current) {
        setState(newState);
      }
    });

    if (fetchOnMount) {
      getNetworkState().then((s) => {
        if (mountedRef.current) {
          setState(s);
        }
      });
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [fetchOnMount]);

  const refresh = useCallback(async (): Promise<NetworkState> => {
    const newState = await getNetworkState();
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
