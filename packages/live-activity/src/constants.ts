import type { TemplateType } from './types';

// ============================================================================
// Template Identifiers
// ============================================================================

/** Mapping of template types to their native identifiers. */
export const TEMPLATE_IDS: Record<TemplateType, string> = {
  delivery: 'IdealystDeliveryActivity',
  timer: 'IdealystTimerActivity',
  media: 'IdealystMediaActivity',
  progress: 'IdealystProgressActivity',
  custom: 'custom',
};

// ============================================================================
// Android Notification Defaults
// ============================================================================

export const DEFAULT_CHANNEL_ID = 'idealyst_live_activity';
export const DEFAULT_CHANNEL_NAME = 'Live Activities';
export const DEFAULT_CHANNEL_DESCRIPTION = 'Real-time activity updates';
export const DEFAULT_SMALL_ICON = 'ic_notification';

// ============================================================================
// Limits
// ============================================================================

/** iOS allows a maximum of 5 concurrent Live Activities per app. */
export const MAX_CONCURRENT_ACTIVITIES_IOS = 5;

/** Android has no hard limit, but we enforce a reasonable default. */
export const MAX_CONCURRENT_ACTIVITIES_ANDROID = 10;

// ============================================================================
// Event Names
// ============================================================================

export const LIVE_ACTIVITY_EVENT = 'IdealystLiveActivityEvent';
