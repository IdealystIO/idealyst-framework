import type {
  NetworkState,
  NetworkConnectionType,
  EffectiveConnectionType,
  CellularGeneration,
  NetworkStateListener,
  FetchWithTimeoutOptions,
  RetryOptions,
  WaitForNetworkOptions,
} from './types';

// ============================================================================
// Lazy NetInfo import (optional peer dependency)
// ============================================================================

let NetInfo: typeof import('@react-native-community/netinfo').default | null = null;

function getNetInfo() {
  if (!NetInfo) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      NetInfo = require('@react-native-community/netinfo').default;
    } catch {
      throw new Error(
        '@idealyst/network: @react-native-community/netinfo is required on React Native. ' +
        'Install it with: yarn add @react-native-community/netinfo'
      );
    }
  }
  return NetInfo!;
}

// ============================================================================
// Internal helpers
// ============================================================================

function mapConnectionType(type?: string): NetworkConnectionType {
  if (!type) return 'unknown';
  switch (type.toLowerCase()) {
    case 'wifi':
      return 'wifi';
    case 'cellular':
      return 'cellular';
    case 'ethernet':
      return 'ethernet';
    case 'bluetooth':
      return 'bluetooth';
    case 'vpn':
      return 'vpn';
    case 'none':
      return 'none';
    case 'other':
      return 'other';
    default:
      return 'unknown';
  }
}

function mapCellularGeneration(details: any): CellularGeneration {
  if (!details || !details.cellularGeneration) return null;
  switch (details.cellularGeneration) {
    case '2g':
      return '2g';
    case '3g':
      return '3g';
    case '4g':
      return '4g';
    case '5g':
      return '5g';
    default:
      return null;
  }
}

function mapEffectiveType(details: any, type: string): EffectiveConnectionType {
  // NetInfo doesn't directly expose effectiveType, but we can approximate from cellular generation
  if (type !== 'cellular' || !details?.cellularGeneration) return 'unknown';
  switch (details.cellularGeneration) {
    case '2g':
      return '2g';
    case '3g':
      return '3g';
    case '4g':
    case '5g':
      return '4g';
    default:
      return 'unknown';
  }
}

function toNetworkState(netInfoState: any): NetworkState {
  const type = mapConnectionType(netInfoState.type);
  return {
    isConnected: netInfoState.isConnected ?? false,
    isInternetReachable: netInfoState.isInternetReachable ?? null,
    type,
    effectiveType: mapEffectiveType(netInfoState.details, netInfoState.type),
    cellularGeneration: mapCellularGeneration(netInfoState.details),
    downlink: null, // Not directly available from NetInfo
    rtt: null,
    isDataSaving: null,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get the current network state snapshot.
 */
export async function getNetworkState(): Promise<NetworkState> {
  const ni = getNetInfo();
  const state = await ni.fetch();
  return toNetworkState(state);
}

/**
 * Subscribe to network state changes.
 * Returns an unsubscribe function.
 */
export function addNetworkStateListener(listener: NetworkStateListener): () => void {
  const ni = getNetInfo();
  return ni.addEventListener((state) => {
    listener(toNetworkState(state));
  });
}

/**
 * Fetch with a configurable timeout.
 * Aborts the request if it exceeds the timeout.
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Retry a function with exponential backoff.
 * Optionally waits for network connectivity before retrying.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    retryOnlyWhenConnected = true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      if (retryOnlyWhenConnected) {
        const state = await getNetworkState();
        if (!state.isConnected) {
          await waitForNetwork();
        }
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Returns a promise that resolves when the device comes back online.
 * Rejects if the timeout is exceeded.
 */
export function waitForNetwork(options: WaitForNetworkOptions = {}): Promise<void> {
  const { timeout = 30000 } = options;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error('waitForNetwork timed out'));
    }, timeout);

    const unsubscribe = addNetworkStateListener((state) => {
      if (state.isConnected) {
        clearTimeout(timer);
        unsubscribe();
        resolve();
      }
    });
  });
}
