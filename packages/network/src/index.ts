// Default entry — re-exports types.
// Platform-specific entry points (index.native.ts, index.web.ts) provide real implementations.

export * from './types';
export {
  getNetworkState,
  addNetworkStateListener,
  fetchWithTimeout,
  retry,
  waitForNetwork,
} from './network.web';
export { useNetwork } from './useNetwork.web';
