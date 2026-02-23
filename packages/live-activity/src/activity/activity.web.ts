// ============================================================================
// Web Stub Implementation
// Live Activities are not supported on web — all functions return graceful defaults.
// ============================================================================

import type {
  LiveActivityEventHandler,
  LiveActivityEvent,
} from '../types';
import { createLiveActivityError } from '../errors';

const NOT_SUPPORTED_ERROR = createLiveActivityError(
  'not_supported',
  'Live Activities are not supported on web',
);

export async function checkAvailability(): Promise<{
  supported: boolean;
  enabled: boolean;
}> {
  return { supported: false, enabled: false };
}

export async function start(
  _templateType: string,
  _attributesJson: string,
  _contentStateJson: string,
  _optionsJson: string,
): Promise<string> {
  throw NOT_SUPPORTED_ERROR;
}

export async function update(
  _activityId: string,
  _contentStateJson: string,
  _alertConfigJson: string | null,
): Promise<void> {
  throw NOT_SUPPORTED_ERROR;
}

export async function end(
  _activityId: string,
  _finalContentStateJson: string | null,
  _dismissalPolicy: string,
  _dismissAfter: number | null,
): Promise<void> {
  throw NOT_SUPPORTED_ERROR;
}

export async function endAll(
  _dismissalPolicy: string,
  _dismissAfter: number | null,
): Promise<void> {
  throw NOT_SUPPORTED_ERROR;
}

export async function getActivity(
  _activityId: string,
): Promise<string | null> {
  return null;
}

export async function listActivities(): Promise<string> {
  return '[]';
}

export async function getPushToken(
  _activityId: string,
): Promise<string | null> {
  return null;
}

export function addEventListener(
  _handler: LiveActivityEventHandler,
): () => void {
  // No-op on web
  return () => {};
}
