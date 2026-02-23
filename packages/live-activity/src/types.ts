// ============================================================================
// Core Types
// ============================================================================

export type LiveActivityState =
  | 'idle'
  | 'starting'
  | 'active'
  | 'updating'
  | 'ending'
  | 'ended'
  | 'stale';

export type LiveActivityDismissalPolicy =
  | 'immediate'
  | 'default'
  | 'afterDate';

export interface LiveActivityToken {
  /** The push token for remote updates (base64 string). */
  token: string;
  /** Platform: 'ios' (APNs) or 'android' (FCM). */
  platform: 'ios' | 'android';
  /** Activity ID this token is associated with. */
  activityId: string;
}

export interface LiveActivityInfo {
  /** Unique activity identifier. */
  id: string;
  /** Current state. */
  state: LiveActivityState;
  /** Push token for remote updates (if available). */
  pushToken?: LiveActivityToken;
  /** Timestamp when activity was started (ms since epoch). */
  startedAt: number;
  /** Template type used. */
  templateType: TemplateType;
  /** Static attributes. */
  attributes: Record<string, unknown>;
  /** Current content state. */
  contentState: Record<string, unknown>;
}

// ============================================================================
// Template Types
// ============================================================================

export type TemplateType =
  | 'delivery'
  | 'timer'
  | 'media'
  | 'progress'
  | 'custom';

export interface DeliveryAttributes {
  /** Starting point label. */
  startLabel: string;
  /** Ending point label. */
  endLabel: string;
  /** Icon name or asset URI. */
  icon?: string;
  /** Accent color (hex). */
  accentColor?: string;
}

export interface DeliveryContentState {
  /** Progress value 0-1. */
  progress: number;
  /** Current status text. */
  status: string;
  /** ETA timestamp (ms since epoch). */
  eta?: number;
  /** Driver/courier name. */
  driverName?: string;
  /** Additional info line. */
  subtitle?: string;
}

export interface TimerAttributes {
  /** Activity title. */
  title: string;
  /** Icon name or asset URI. */
  icon?: string;
  /** Accent color (hex). */
  accentColor?: string;
  /** Whether to show elapsed time instead of countdown. */
  showElapsed?: boolean;
}

export interface TimerContentState {
  /** Target end time (ms since epoch). */
  endTime: number;
  /** Whether timer is paused. */
  isPaused?: boolean;
  /** Subtitle text. */
  subtitle?: string;
}

export interface MediaAttributes {
  /** Album or playlist title. */
  title: string;
  /** Album art URI. */
  artworkUri?: string;
  /** Accent color (hex). */
  accentColor?: string;
}

export interface MediaContentState {
  /** Track title. */
  trackTitle: string;
  /** Artist name. */
  artist?: string;
  /** Is currently playing. */
  isPlaying: boolean;
  /** Progress 0-1. */
  progress?: number;
  /** Total duration in seconds. */
  duration?: number;
  /** Current position in seconds. */
  position?: number;
}

export interface ProgressAttributes {
  /** Activity title. */
  title: string;
  /** Icon name or asset URI. */
  icon?: string;
  /** Accent color (hex). */
  accentColor?: string;
}

export interface ProgressContentState {
  /** Progress value 0-1. */
  progress: number;
  /** Status text. */
  status: string;
  /** Subtitle text. */
  subtitle?: string;
  /** Whether progress is indeterminate. */
  indeterminate?: boolean;
}

/** Maps template type to its static attributes interface. */
export interface TemplateAttributesMap {
  delivery: DeliveryAttributes;
  timer: TimerAttributes;
  media: MediaAttributes;
  progress: ProgressAttributes;
  custom: Record<string, unknown>;
}

/** Maps template type to its content state interface. */
export interface TemplateContentStateMap {
  delivery: DeliveryContentState;
  timer: TimerContentState;
  media: MediaContentState;
  progress: ProgressContentState;
  custom: Record<string, unknown>;
}

// ============================================================================
// Options Types
// ============================================================================

export interface StartActivityOptions<T extends TemplateType = TemplateType> {
  /** Template type to use. */
  templateType: T;
  /** Static attributes (don't change during activity). */
  attributes: TemplateAttributesMap[T];
  /** Initial content state (can be updated). */
  contentState: TemplateContentStateMap[T];
  /** Enable push token generation for remote updates. */
  enablePushUpdates?: boolean;
  /** iOS-specific options. */
  ios?: {
    /** Relevance score 0-100 (affects Dynamic Island priority). */
    relevanceScore?: number;
    /** Stale date (ms since epoch) — system marks activity stale after this. */
    staleDate?: number;
  };
  /** Android-specific options. */
  android?: {
    /** Notification channel ID. */
    channelId?: string;
    /** Notification ID (auto-generated if omitted). */
    notificationId?: number;
    /** Small icon resource name. */
    smallIcon?: string;
    /** Deep link URL when notification is tapped. */
    deepLinkUrl?: string;
  };
}

export interface UpdateActivityOptions<T extends TemplateType = TemplateType> {
  /** New content state (partial — merged with existing). */
  contentState: Partial<TemplateContentStateMap[T]>;
  /** iOS: alert configuration for this update. */
  alert?: {
    title?: string;
    body?: string;
    sound?: boolean;
  };
}

export interface EndActivityOptions {
  /** Final content state to display before dismissal. */
  finalContentState?: Record<string, unknown>;
  /** Dismissal policy. Default: 'default'. */
  dismissalPolicy?: LiveActivityDismissalPolicy;
  /** For 'afterDate' policy: timestamp when to dismiss (ms since epoch). */
  dismissAfter?: number;
}

// ============================================================================
// Event Types
// ============================================================================

export type LiveActivityEventType =
  | 'started'
  | 'updated'
  | 'ended'
  | 'tokenUpdated'
  | 'stale'
  | 'error';

export interface LiveActivityEvent {
  /** Event type. */
  type: LiveActivityEventType;
  /** Activity this event relates to. */
  activityId: string;
  /** Timestamp of the event (ms since epoch). */
  timestamp: number;
  /** Event-specific payload. */
  payload?: {
    state?: LiveActivityState;
    token?: LiveActivityToken;
    error?: LiveActivityError;
  };
}

export type LiveActivityEventHandler = (event: LiveActivityEvent) => void;

// ============================================================================
// Error Types
// ============================================================================

export type LiveActivityErrorCode =
  | 'not_available'
  | 'not_supported'
  | 'permission_denied'
  | 'start_failed'
  | 'update_failed'
  | 'end_failed'
  | 'activity_not_found'
  | 'template_not_found'
  | 'invalid_attributes'
  | 'too_many_activities'
  | 'unknown';

export interface LiveActivityError {
  code: LiveActivityErrorCode;
  message: string;
  originalError?: unknown;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseLiveActivityOptions {
  /** Auto-check availability on mount. */
  autoCheckAvailability?: boolean;
  /** Event handler for activity state changes. */
  onEvent?: LiveActivityEventHandler;
}

export interface UseLiveActivityResult {
  /** Whether Live Activities are supported on this device. */
  isSupported: boolean;
  /** Whether Live Activities are enabled by the user (iOS settings). */
  isEnabled: boolean | null;
  /** Currently active activity info (most recent). */
  currentActivity: LiveActivityInfo | null;
  /** All active activities. */
  activities: LiveActivityInfo[];
  /** Loading state. */
  isLoading: boolean;
  /** Current error. */
  error: LiveActivityError | null;

  /** Check if Live Activities are available. */
  checkAvailability: () => Promise<{ supported: boolean; enabled: boolean }>;
  /** Start a new Live Activity. */
  start: <T extends TemplateType>(options: StartActivityOptions<T>) => Promise<LiveActivityInfo>;
  /** Update an existing activity. */
  update: <T extends TemplateType>(activityId: string, options: UpdateActivityOptions<T>) => Promise<void>;
  /** End an activity. */
  end: (activityId: string, options?: EndActivityOptions) => Promise<void>;
  /** End all activities. */
  endAll: (options?: EndActivityOptions) => Promise<void>;
  /** Get activity by ID. */
  getActivity: (activityId: string) => Promise<LiveActivityInfo | null>;
  /** List all current activities. */
  listActivities: () => Promise<LiveActivityInfo[]>;
  /** Get push token for an activity. */
  getPushToken: (activityId: string) => Promise<LiveActivityToken | null>;
  /** Clear error state. */
  clearError: () => void;
}

// ============================================================================
// Internal: Platform Implementation Dependencies
// ============================================================================

export interface LiveActivityDeps {
  checkAvailability: () => Promise<{ supported: boolean; enabled: boolean }>;
  start: (
    templateType: string,
    attributesJson: string,
    contentStateJson: string,
    optionsJson: string,
  ) => Promise<string>;
  update: (
    activityId: string,
    contentStateJson: string,
    alertConfigJson: string | null,
  ) => Promise<void>;
  end: (
    activityId: string,
    finalContentStateJson: string | null,
    dismissalPolicy: string,
    dismissAfter: number | null,
  ) => Promise<void>;
  endAll: (
    dismissalPolicy: string,
    dismissAfter: number | null,
  ) => Promise<void>;
  getActivity: (activityId: string) => Promise<string | null>;
  listActivities: () => Promise<string>;
  getPushToken: (activityId: string) => Promise<string | null>;
  addEventListener: (handler: LiveActivityEventHandler) => () => void;
}
