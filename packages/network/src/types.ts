// ============================================================================
// Network State Types
// ============================================================================

/** The type of network connection currently active. */
export type NetworkConnectionType =
  | 'wifi'
  | 'cellular'
  | 'ethernet'
  | 'bluetooth'
  | 'vpn'
  | 'other'
  | 'none'
  | 'unknown';

/** Effective connection type (based on Network Information API / netinfo). */
export type EffectiveConnectionType =
  | 'slow-2g'
  | '2g'
  | '3g'
  | '4g'
  | 'unknown';

/** Cellular generation (native only). */
export type CellularGeneration =
  | '2g'
  | '3g'
  | '4g'
  | '5g'
  | null;

/** Full network state snapshot. */
export interface NetworkState {
  /** Whether the device has an active network connection. */
  isConnected: boolean;
  /** Whether internet is actually reachable (not just LAN). Null if unknown. */
  isInternetReachable: boolean | null;
  /** The type of the current network connection. */
  type: NetworkConnectionType;
  /** Effective connection speed category. */
  effectiveType: EffectiveConnectionType;
  /** Cellular generation if on cellular (native only). Null otherwise. */
  cellularGeneration: CellularGeneration;
  /** Estimated downlink speed in Mbps. Null if unavailable. */
  downlink: number | null;
  /** Estimated round-trip time in ms. Null if unavailable. */
  rtt: number | null;
  /** Whether the user has opted into data-saving mode. Null if unavailable. */
  isDataSaving: boolean | null;
}

// ============================================================================
// Hook Types
// ============================================================================

/** Options for the useNetwork hook. */
export interface UseNetworkOptions {
  /**
   * Whether to fetch the initial state on mount.
   * @default true
   */
  fetchOnMount?: boolean;

  /**
   * URL to ping for internet reachability checks (web only).
   * Defaults to a lightweight HEAD request.
   */
  reachabilityUrl?: string;

  /**
   * Interval in ms for periodic reachability checks (web only).
   * Set to 0 to disable. Default: 0 (disabled).
   */
  reachabilityPollInterval?: number;
}

/** Return value of the useNetwork hook. */
export interface UseNetworkResult {
  /** Current network state. */
  state: NetworkState;
  /** Whether the device has an active network connection. */
  isConnected: boolean;
  /** Whether internet is reachable. Null if unknown. */
  isInternetReachable: boolean | null;
  /** The current connection type. */
  type: NetworkConnectionType;
  /** Effective connection speed category. */
  effectiveType: EffectiveConnectionType;
  /** Manually refresh the network state. */
  refresh: () => Promise<NetworkState>;
}

// ============================================================================
// Listener Types
// ============================================================================

/** Callback for network state changes. */
export type NetworkStateListener = (state: NetworkState) => void;

// ============================================================================
// Utility Types
// ============================================================================

/** Options for the fetch-with-timeout utility. */
export interface FetchWithTimeoutOptions extends RequestInit {
  /** Timeout in milliseconds. Default: 10000 (10s). */
  timeout?: number;
}

/** Options for the retry wrapper. */
export interface RetryOptions {
  /** Maximum number of retry attempts. Default: 3. */
  maxRetries?: number;
  /** Base delay in ms between retries (doubles each attempt). Default: 1000. */
  baseDelay?: number;
  /** Maximum delay in ms. Default: 30000. */
  maxDelay?: number;
  /** Whether to only retry when the device is connected. Default: true. */
  retryOnlyWhenConnected?: boolean;
}

/** Options for waitForNetwork. */
export interface WaitForNetworkOptions {
  /** Timeout in ms to wait before rejecting. Default: 30000. */
  timeout?: number;
}
