import type {
  NetworkState,
  NetworkConnectionType,
  EffectiveConnectionType,
  NetworkStateListener,
  FetchWithTimeoutOptions,
  RetryOptions,
  WaitForNetworkOptions,
} from './types';

// ============================================================================
// Network Information API type augmentation (not in standard lib)
// ============================================================================

interface NetworkInformation extends EventTarget {
  readonly type?: string;
  readonly effectiveType?: string;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onchange?: EventListener;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

// ============================================================================
// Internal helpers
// ============================================================================

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;
}

function mapConnectionType(type?: string): NetworkConnectionType {
  if (!type) return 'unknown';
  switch (type) {
    case 'wifi':
      return 'wifi';
    case 'cellular':
      return 'cellular';
    case 'ethernet':
      return 'ethernet';
    case 'bluetooth':
      return 'bluetooth';
    case 'none':
      return 'none';
    default:
      return 'other';
  }
}

function mapEffectiveType(effectiveType?: string): EffectiveConnectionType {
  switch (effectiveType) {
    case 'slow-2g':
      return 'slow-2g';
    case '2g':
      return '2g';
    case '3g':
      return '3g';
    case '4g':
      return '4g';
    default:
      return 'unknown';
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get the current network state snapshot.
 */
export function getNetworkState(): NetworkState {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const conn = getConnection();

  return {
    isConnected: isOnline,
    isInternetReachable: isOnline ? null : false,
    type: isOnline ? mapConnectionType(conn?.type) : 'none',
    effectiveType: mapEffectiveType(conn?.effectiveType),
    cellularGeneration: null, // Not available on web
    downlink: conn?.downlink ?? null,
    rtt: conn?.rtt ?? null,
    isDataSaving: conn?.saveData ?? null,
  };
}

/**
 * Subscribe to network state changes.
 * Returns an unsubscribe function.
 */
export function addNetworkStateListener(listener: NetworkStateListener): () => void {
  if (typeof window === 'undefined') return () => {};

  const emit = () => listener(getNetworkState());

  window.addEventListener('online', emit);
  window.addEventListener('offline', emit);

  const conn = getConnection();
  if (conn) {
    conn.addEventListener('change', emit);
  }

  return () => {
    window.removeEventListener('online', emit);
    window.removeEventListener('offline', emit);
    if (conn) {
      conn.removeEventListener('change', emit);
    }
  };
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
        const state = getNetworkState();
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

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('waitForNetwork timed out'));
    }, timeout);

    const onOnline = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', onOnline);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', onOnline);
    }
  });
}
