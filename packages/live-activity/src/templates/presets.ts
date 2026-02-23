import type {
  StartActivityOptions,
  DeliveryAttributes,
  DeliveryContentState,
  TimerAttributes,
  TimerContentState,
  MediaAttributes,
  MediaContentState,
  ProgressAttributes,
  ProgressContentState,
} from '../types';

/**
 * Create a delivery/rideshare Live Activity with sensible defaults.
 */
export function deliveryActivity(
  attributes: DeliveryAttributes,
  contentState: DeliveryContentState,
  options?: Partial<Omit<StartActivityOptions<'delivery'>, 'templateType' | 'attributes' | 'contentState'>>,
): StartActivityOptions<'delivery'> {
  return {
    templateType: 'delivery',
    attributes: {
      accentColor: '#FF5722',
      ...attributes,
    },
    contentState: {
      ...contentState,
      progress: contentState.progress ?? 0,
    },
    ...options,
  };
}

/**
 * Create a timer/countdown Live Activity with sensible defaults.
 */
export function timerActivity(
  attributes: TimerAttributes,
  contentState: TimerContentState,
  options?: Partial<Omit<StartActivityOptions<'timer'>, 'templateType' | 'attributes' | 'contentState'>>,
): StartActivityOptions<'timer'> {
  return {
    templateType: 'timer',
    attributes: {
      showElapsed: false,
      ...attributes,
    },
    contentState,
    ...options,
  };
}

/**
 * Create a media playback Live Activity with sensible defaults.
 */
export function mediaActivity(
  attributes: MediaAttributes,
  contentState: MediaContentState,
  options?: Partial<Omit<StartActivityOptions<'media'>, 'templateType' | 'attributes' | 'contentState'>>,
): StartActivityOptions<'media'> {
  return {
    templateType: 'media',
    attributes,
    contentState: {
      ...contentState,
      isPlaying: contentState.isPlaying ?? false,
    },
    ...options,
  };
}

/**
 * Create a generic progress Live Activity with sensible defaults.
 */
export function progressActivity(
  attributes: ProgressAttributes,
  contentState: ProgressContentState,
  options?: Partial<Omit<StartActivityOptions<'progress'>, 'templateType' | 'attributes' | 'contentState'>>,
): StartActivityOptions<'progress'> {
  return {
    templateType: 'progress',
    attributes,
    contentState: {
      ...contentState,
      progress: contentState.progress ?? 0,
      indeterminate: contentState.indeterminate ?? false,
    },
    ...options,
  };
}
