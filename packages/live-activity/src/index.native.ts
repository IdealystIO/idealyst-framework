export * from './types';
export {
  TEMPLATE_IDS,
  DEFAULT_CHANNEL_ID,
  DEFAULT_CHANNEL_NAME,
  DEFAULT_CHANNEL_DESCRIPTION,
  DEFAULT_SMALL_ICON,
  MAX_CONCURRENT_ACTIVITIES_IOS,
  MAX_CONCURRENT_ACTIVITIES_ANDROID,
  LIVE_ACTIVITY_EVENT,
} from './constants';
export { createLiveActivityError, normalizeLiveActivityError } from './errors';

// Template presets
export {
  deliveryActivity,
  timerActivity,
  mediaActivity,
  progressActivity,
} from './templates/presets';

// Activity functions — native implementations
export {
  checkAvailability,
  start,
  update,
  end,
  endAll,
  getActivity,
  listActivities,
  getPushToken,
  addEventListener,
} from './activity/activity.native';

// Hook — bound to native implementations
import { createUseLiveActivityHook } from './activity/useLiveActivity';
import {
  checkAvailability,
  start,
  update,
  end,
  endAll,
  getActivity,
  listActivities,
  getPushToken,
  addEventListener,
} from './activity/activity.native';

export const useLiveActivity = createUseLiveActivityHook({
  checkAvailability,
  start,
  update,
  end,
  endAll,
  getActivity,
  listActivities,
  getPushToken,
  addEventListener,
});
