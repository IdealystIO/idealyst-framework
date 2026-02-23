// ============================================================================
// Native Live Activity Implementation
// Bridges to the IdealystLiveActivity TurboModule (iOS: ActivityKit, Android: ProgressStyle).
// ============================================================================

import { NativeEventEmitter, Platform } from 'react-native';
import type {
  LiveActivityEventHandler,
  LiveActivityEvent,
} from '../types';
import { createLiveActivityError, normalizeLiveActivityError } from '../errors';
import { LIVE_ACTIVITY_EVENT } from '../constants';
import NativeLiveActivity from '../NativeLiveActivitySpec';

function assertNativeModule(): void {
  if (!NativeLiveActivity) {
    throw createLiveActivityError(
      'not_available',
      '@idealyst/live-activity native module is not linked. Ensure the package is installed and your project is rebuilt.',
    );
  }
}

// ============================================================================
// Availability
// ============================================================================

export async function checkAvailability(): Promise<{
  supported: boolean;
  enabled: boolean;
}> {
  if (!NativeLiveActivity) {
    return { supported: false, enabled: false };
  }

  try {
    const supported = NativeLiveActivity.isSupported();
    const enabled = supported ? await NativeLiveActivity.isEnabled() : false;
    return { supported, enabled };
  } catch {
    return { supported: false, enabled: false };
  }
}

// ============================================================================
// Lifecycle
// ============================================================================

export async function start(
  templateType: string,
  attributesJson: string,
  contentStateJson: string,
  optionsJson: string,
): Promise<string> {
  assertNativeModule();

  try {
    return await NativeLiveActivity.startActivity(
      templateType,
      attributesJson,
      contentStateJson,
      optionsJson,
    );
  } catch (error) {
    throw normalizeLiveActivityError(error);
  }
}

export async function update(
  activityId: string,
  contentStateJson: string,
  alertConfigJson: string | null,
): Promise<void> {
  assertNativeModule();

  try {
    await NativeLiveActivity.updateActivity(
      activityId,
      contentStateJson,
      alertConfigJson,
    );
  } catch (error) {
    throw normalizeLiveActivityError(error);
  }
}

export async function end(
  activityId: string,
  finalContentStateJson: string | null,
  dismissalPolicy: string,
  dismissAfter: number | null,
): Promise<void> {
  assertNativeModule();

  try {
    await NativeLiveActivity.endActivity(
      activityId,
      finalContentStateJson,
      dismissalPolicy,
      // TurboModule codegen requires non-optional number — use -1 as sentinel
      dismissAfter ?? -1,
    );
  } catch (error) {
    throw normalizeLiveActivityError(error);
  }
}

export async function endAll(
  dismissalPolicy: string,
  dismissAfter: number | null,
): Promise<void> {
  assertNativeModule();

  try {
    await NativeLiveActivity.endAllActivities(
      dismissalPolicy,
      dismissAfter ?? -1,
    );
  } catch (error) {
    throw normalizeLiveActivityError(error);
  }
}

// ============================================================================
// Queries
// ============================================================================

export async function getActivity(
  activityId: string,
): Promise<string | null> {
  assertNativeModule();

  try {
    return await NativeLiveActivity.getActivity(activityId);
  } catch {
    return null;
  }
}

export async function listActivities(): Promise<string> {
  assertNativeModule();

  try {
    return await NativeLiveActivity.listActivities();
  } catch {
    return '[]';
  }
}

export async function getPushToken(
  activityId: string,
): Promise<string | null> {
  assertNativeModule();

  try {
    return await NativeLiveActivity.getPushToken(activityId);
  } catch {
    return null;
  }
}

// ============================================================================
// Events
// ============================================================================

let emitter: NativeEventEmitter | null = null;

function getEmitter(): NativeEventEmitter {
  if (!emitter) {
    emitter = new NativeEventEmitter(NativeLiveActivity as any);
  }
  return emitter;
}

export function addEventListener(
  handler: LiveActivityEventHandler,
): () => void {
  if (!NativeLiveActivity) {
    return () => {};
  }

  const subscription = getEmitter().addListener(
    LIVE_ACTIVITY_EVENT,
    (rawEvent: unknown) => {
      try {
        const event =
          typeof rawEvent === 'string'
            ? (JSON.parse(rawEvent) as LiveActivityEvent)
            : (rawEvent as LiveActivityEvent);
        handler(event);
      } catch {
        // Malformed event — ignore
      }
    },
  );

  return () => subscription.remove();
}
