import type {
  PermissionResult,
  AndroidChannel,
  NotificationImportance,
} from './types';

// ============================================================================
// Default States
// ============================================================================

export const DEFAULT_PERMISSION_RESULT: PermissionResult = {
  status: 'undetermined',
  canNotify: false,
};

// ============================================================================
// Default Android Channel
// ============================================================================

export const DEFAULT_CHANNEL_ID = 'default';

export const DEFAULT_CHANNEL: AndroidChannel = {
  id: DEFAULT_CHANNEL_ID,
  name: 'Default',
  description: 'Default notification channel',
  importance: 'high',
  vibration: true,
  badge: true,
  visibility: 'private',
};

// ============================================================================
// Channel Presets
// ============================================================================

export const CHANNEL_PRESETS = {
  alerts: {
    id: 'alerts',
    name: 'Alerts',
    description: 'Important alerts and messages',
    importance: 'high' as NotificationImportance,
    vibration: true,
    lights: true,
    badge: true,
    visibility: 'private' as const,
  },

  silent: {
    id: 'silent',
    name: 'Silent Updates',
    description: 'Background updates without sound or vibration',
    importance: 'low' as NotificationImportance,
    vibration: false,
    lights: false,
    badge: false,
    visibility: 'private' as const,
  },

  marketing: {
    id: 'marketing',
    name: 'Promotions',
    description: 'Promotional offers and updates',
    importance: 'default' as NotificationImportance,
    vibration: false,
    badge: true,
    visibility: 'public' as const,
  },

  chat: {
    id: 'chat',
    name: 'Messages',
    description: 'Chat messages and conversations',
    importance: 'high' as NotificationImportance,
    vibration: true,
    lights: true,
    badge: true,
    sound: 'default',
    visibility: 'private' as const,
  },
} as const satisfies Record<string, AndroidChannel>;

// ============================================================================
// Web Push Defaults
// ============================================================================

export const DEFAULT_SERVICE_WORKER_PATH = '/sw.js';
