export const networkGuides: Record<string, string> = {
  "idealyst://network/overview": `# @idealyst/network Overview

Cross-platform network connectivity and utilities for React and React Native. Know when the user has network, what kind, and react to changes in real time.

## Features

- **useNetwork Hook** — Real-time network state with isConnected, connection type, effective speed
- **Network State Listener** — Subscribe to connectivity changes outside React
- **Connection Details** — WiFi, cellular (2G/3G/4G/5G), ethernet, bluetooth, VPN detection
- **Effective Connection Type** — slow-2g, 2g, 3g, 4g speed categories
- **Internet Reachability** — Distinguish "connected to network" from "can reach internet"
- **fetchWithTimeout** — Fetch wrapper with configurable timeout and auto-abort
- **retry** — Exponential backoff retry with optional network-aware gating
- **waitForNetwork** — Promise that resolves when the device comes back online
- **Data Saver Detection** — Detect if user has enabled data-saving mode (web)
- **Cross-Platform** — navigator.onLine + Network Information API (web), @react-native-community/netinfo (native)
- **TypeScript** — Full type safety and IntelliSense

## Installation

\`\`\`bash
yarn add @idealyst/network

# React Native also needs:
yarn add @react-native-community/netinfo
cd ios && pod install
\`\`\`

## Quick Start

\`\`\`tsx
import { useNetwork } from '@idealyst/network';

function App() {
  const { isConnected, type, effectiveType } = useNetwork();

  if (!isConnected) {
    return <Text>You are offline</Text>;
  }

  return (
    <Text>
      Connected via {type} ({effectiveType})
    </Text>
  );
}
\`\`\`

## Platform Details

- **Web**: Uses \`navigator.onLine\`, \`online\`/\`offline\` events, and the Network Information API (\`navigator.connection\`) for connection type, downlink speed, RTT, and data saver detection
- **React Native**: Uses \`@react-native-community/netinfo\` for connection type, cellular generation, internet reachability, and real-time state changes
- **SSR**: Safe for server-side rendering — returns sensible defaults when \`navigator\` is unavailable
`,

  "idealyst://network/api": `# Network API Reference

Complete API reference for @idealyst/network.

## useNetwork

React hook for monitoring network connectivity. Returns reactive state that updates automatically.

\`\`\`tsx
const {
  state,              // NetworkState — full state object
  isConnected,        // boolean — device has active network
  isInternetReachable,// boolean | null — can reach internet (null = unknown)
  type,               // NetworkConnectionType — 'wifi' | 'cellular' | 'ethernet' | ...
  effectiveType,      // EffectiveConnectionType — 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  refresh,            // () => Promise<NetworkState> — manually refresh state
} = useNetwork(options?: UseNetworkOptions);
\`\`\`

### UseNetworkOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fetchOnMount | boolean | true | Fetch initial state on mount |
| reachabilityUrl | string | (google 204) | URL for reachability pings (web only) |
| reachabilityPollInterval | number | 0 | Polling interval in ms for reachability checks (web only). 0 = disabled |

---

## getNetworkState

Get a one-time snapshot of the current network state.

\`\`\`tsx
// Web (synchronous)
import { getNetworkState } from '@idealyst/network';
const state: NetworkState = getNetworkState();

// Native (async — requires NetInfo fetch)
import { getNetworkState } from '@idealyst/network';
const state: NetworkState = await getNetworkState();
\`\`\`

**Note:** On web, \`getNetworkState()\` is synchronous. On native, it returns a Promise.

---

## addNetworkStateListener

Subscribe to network state changes outside of React.

\`\`\`tsx
import { addNetworkStateListener } from '@idealyst/network';

const unsubscribe = addNetworkStateListener((state) => {
  console.log('Network changed:', state.isConnected, state.type);
});

// Later:
unsubscribe();
\`\`\`

---

## fetchWithTimeout

Fetch wrapper that automatically aborts if the request exceeds a timeout.

\`\`\`tsx
import { fetchWithTimeout } from '@idealyst/network';

const response = await fetchWithTimeout('https://api.example.com/data', {
  timeout: 5000,    // 5 seconds (default: 10000)
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' },
});
\`\`\`

### FetchWithTimeoutOptions

Extends standard \`RequestInit\` with:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| timeout | number | 10000 | Timeout in milliseconds |

---

## retry

Retry a function with exponential backoff. Optionally waits for network before retrying.

\`\`\`tsx
import { retry } from '@idealyst/network';

const data = await retry(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    retryOnlyWhenConnected: true,
  },
);
\`\`\`

### RetryOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| maxRetries | number | 3 | Maximum retry attempts |
| baseDelay | number | 1000 | Base delay in ms (doubles each attempt) |
| maxDelay | number | 30000 | Maximum delay cap in ms |
| retryOnlyWhenConnected | boolean | true | Wait for network before retrying |

---

## waitForNetwork

Returns a promise that resolves when the device comes back online.

\`\`\`tsx
import { waitForNetwork } from '@idealyst/network';

// Wait up to 30 seconds for connectivity
await waitForNetwork({ timeout: 30000 });
console.log('Back online!');
\`\`\`

If already online, resolves immediately. Rejects with an error if the timeout is exceeded.

### WaitForNetworkOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| timeout | number | 30000 | Max wait time in ms before rejecting |

---

## NetworkState

Full network state object returned by the hook and listeners.

\`\`\`tsx
interface NetworkState {
  isConnected: boolean;                    // Device has active network
  isInternetReachable: boolean | null;     // Internet reachable (null = unknown)
  type: NetworkConnectionType;             // 'wifi' | 'cellular' | 'ethernet' | ...
  effectiveType: EffectiveConnectionType;  // 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  cellularGeneration: CellularGeneration;  // '2g' | '3g' | '4g' | '5g' | null (native only)
  downlink: number | null;                 // Mbps (web only, from Network Info API)
  rtt: number | null;                      // Round-trip time ms (web only)
  isDataSaving: boolean | null;            // Data saver enabled (web only)
}
\`\`\`

## Type Aliases

\`\`\`tsx
type NetworkConnectionType = 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'vpn' | 'other' | 'none' | 'unknown';
type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
type CellularGeneration = '2g' | '3g' | '4g' | '5g' | null;
\`\`\`
`,

  "idealyst://network/examples": `# Network Examples

Complete code examples for common @idealyst/network patterns.

## Offline Banner

\`\`\`tsx
import { useNetwork } from '@idealyst/network';
import { View, Text } from '@idealyst/components';

function OfflineBanner() {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={{ backgroundColor: '#f44336', padding: 8 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        No internet connection
      </Text>
    </View>
  );
}
\`\`\`

## Adaptive Quality Based on Connection

\`\`\`tsx
import { useNetwork } from '@idealyst/network';

function MediaPlayer({ videoId }: { videoId: string }) {
  const { effectiveType, isDataSaving } = useNetwork().state;

  const quality = (() => {
    if (isDataSaving) return 'low';
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'high';
    }
  })();

  return <VideoPlayer videoId={videoId} quality={quality} />;
}
\`\`\`

## Retry API Calls

\`\`\`tsx
import { retry, fetchWithTimeout } from '@idealyst/network';

async function fetchUserProfile(userId: string) {
  const response = await retry(
    () => fetchWithTimeout(\`https://api.example.com/users/\${userId}\`, {
      timeout: 5000,
    }),
    { maxRetries: 3, baseDelay: 1000 },
  );

  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.status}\`);
  }

  return response.json();
}
\`\`\`

## Wait for Network Before Action

\`\`\`tsx
import { waitForNetwork } from '@idealyst/network';

async function syncData() {
  // If offline, wait up to 60 seconds for connectivity
  await waitForNetwork({ timeout: 60000 });

  // Now we're online — sync
  const response = await fetch('https://api.example.com/sync', {
    method: 'POST',
    body: JSON.stringify(pendingChanges),
  });

  return response.json();
}
\`\`\`

## Network State Listener (Outside React)

\`\`\`tsx
import { addNetworkStateListener } from '@idealyst/network';

// Subscribe to changes (e.g., in a service or module)
const unsubscribe = addNetworkStateListener((state) => {
  if (!state.isConnected) {
    queueManager.pause();
  } else {
    queueManager.resume();
  }
});

// Cleanup when done
unsubscribe();
\`\`\`

## Connection Type Display

\`\`\`tsx
import { useNetwork } from '@idealyst/network';
import { View, Text } from '@idealyst/components';

function NetworkInfo() {
  const { state } = useNetwork();

  return (
    <View>
      <Text>Status: {state.isConnected ? 'Online' : 'Offline'}</Text>
      <Text>Type: {state.type}</Text>
      <Text>Speed: {state.effectiveType}</Text>
      {state.cellularGeneration && (
        <Text>Cellular: {state.cellularGeneration}</Text>
      )}
      {state.downlink != null && (
        <Text>Downlink: {state.downlink} Mbps</Text>
      )}
      {state.rtt != null && (
        <Text>RTT: {state.rtt} ms</Text>
      )}
      {state.isDataSaving != null && (
        <Text>Data Saver: {state.isDataSaving ? 'On' : 'Off'}</Text>
      )}
    </View>
  );
}
\`\`\`

## Fetch with Timeout

\`\`\`tsx
import { fetchWithTimeout } from '@idealyst/network';

async function quickHealthCheck() {
  try {
    const response = await fetchWithTimeout('https://api.example.com/health', {
      timeout: 3000,
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}
\`\`\`

## Best Practices

1. **Use \`useNetwork\` for UI** — The hook handles subscriptions and cleanup automatically
2. **Use \`addNetworkStateListener\` for services** — For non-React code (queue managers, sync services)
3. **Combine retry + fetchWithTimeout** — For resilient API calls
4. **Check \`isInternetReachable\`** — Being "connected" to WiFi doesn't mean you have internet
5. **Respect data saver** — Reduce payload sizes and avoid autoplay when \`isDataSaving\` is true
6. **Don't poll too aggressively** — If using \`reachabilityPollInterval\`, keep it >= 15000ms
7. **Use \`waitForNetwork\` for offline-first** — Queue operations and wait for connectivity to sync
`,
};
