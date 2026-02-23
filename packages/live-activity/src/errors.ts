import type { LiveActivityError, LiveActivityErrorCode } from './types';

export function createLiveActivityError(
  code: LiveActivityErrorCode,
  message: string,
  originalError?: unknown,
): LiveActivityError {
  return { code, message, originalError };
}

/**
 * Normalize an unknown error into a LiveActivityError.
 */
export function normalizeLiveActivityError(error: unknown): LiveActivityError {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  ) {
    const typed = error as { code?: string; message?: string };
    const code = isLiveActivityErrorCode(typed.code)
      ? typed.code
      : 'unknown';
    return createLiveActivityError(
      code,
      typed.message || 'An unknown Live Activity error occurred',
      error,
    );
  }

  if (error instanceof Error) {
    return createLiveActivityError('unknown', error.message, error);
  }

  return createLiveActivityError('unknown', String(error), error);
}

const VALID_CODES: LiveActivityErrorCode[] = [
  'not_available',
  'not_supported',
  'permission_denied',
  'start_failed',
  'update_failed',
  'end_failed',
  'activity_not_found',
  'template_not_found',
  'invalid_attributes',
  'too_many_activities',
  'unknown',
];

function isLiveActivityErrorCode(
  value: unknown,
): value is LiveActivityErrorCode {
  return typeof value === 'string' && VALID_CODES.includes(value as LiveActivityErrorCode);
}
