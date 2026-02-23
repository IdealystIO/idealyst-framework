import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseLiveActivityOptions,
  UseLiveActivityResult,
  LiveActivityInfo,
  LiveActivityError,
  LiveActivityToken,
  LiveActivityDeps,
  StartActivityOptions,
  UpdateActivityOptions,
  EndActivityOptions,
  TemplateType,
} from '../types';
import { normalizeLiveActivityError } from '../errors';

/**
 * Factory that creates a useLiveActivity hook bound to platform-specific functions.
 * Each platform entry point calls this with the correct implementations.
 */
export function createUseLiveActivityHook(fns: LiveActivityDeps) {
  return function useLiveActivity(
    options: UseLiveActivityOptions = {},
  ): UseLiveActivityResult {
    const { autoCheckAvailability = false, onEvent } = options;

    const [isSupported, setIsSupported] = useState(false);
    const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
    const [activities, setActivities] = useState<LiveActivityInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LiveActivityError | null>(null);
    const mountedRef = useRef(true);
    const initializedRef = useRef(false);

    const currentActivity = activities.length > 0 ? activities[0] : null;

    const checkAvailability = useCallback(async (): Promise<{
      supported: boolean;
      enabled: boolean;
    }> => {
      try {
        const result = await fns.checkAvailability();
        if (mountedRef.current) {
          setIsSupported(result.supported);
          setIsEnabled(result.enabled);
        }
        return result;
      } catch (err) {
        const liveError = normalizeLiveActivityError(err);
        if (mountedRef.current) setError(liveError);
        return { supported: false, enabled: false };
      }
    }, []);

    const refreshActivities = useCallback(async () => {
      try {
        const json = await fns.listActivities();
        const list: LiveActivityInfo[] = JSON.parse(json);
        if (mountedRef.current) {
          setActivities(list);
        }
      } catch {
        // Best-effort refresh
      }
    }, []);

    const start = useCallback(
      async <T extends TemplateType>(
        opts: StartActivityOptions<T>,
      ): Promise<LiveActivityInfo> => {
        setIsLoading(true);
        setError(null);
        try {
          const resultJson = await fns.start(
            opts.templateType,
            JSON.stringify(opts.attributes),
            JSON.stringify(opts.contentState),
            JSON.stringify({
              enablePushUpdates: opts.enablePushUpdates,
              ios: opts.ios,
              android: opts.android,
            }),
          );
          const info: LiveActivityInfo = JSON.parse(resultJson);
          if (mountedRef.current) {
            setActivities((prev) => [info, ...prev]);
          }
          return info;
        } catch (err) {
          const liveError = normalizeLiveActivityError(err);
          if (mountedRef.current) setError(liveError);
          throw liveError;
        } finally {
          if (mountedRef.current) setIsLoading(false);
        }
      },
      [],
    );

    const update = useCallback(
      async <T extends TemplateType>(
        activityId: string,
        opts: UpdateActivityOptions<T>,
      ): Promise<void> => {
        setError(null);
        try {
          await fns.update(
            activityId,
            JSON.stringify(opts.contentState),
            opts.alert ? JSON.stringify(opts.alert) : null,
          );
          await refreshActivities();
        } catch (err) {
          const liveError = normalizeLiveActivityError(err);
          if (mountedRef.current) setError(liveError);
          throw liveError;
        }
      },
      [refreshActivities],
    );

    const endActivity = useCallback(
      async (activityId: string, opts?: EndActivityOptions): Promise<void> => {
        setError(null);
        try {
          await fns.end(
            activityId,
            opts?.finalContentState
              ? JSON.stringify(opts.finalContentState)
              : null,
            opts?.dismissalPolicy ?? 'default',
            opts?.dismissAfter ?? null,
          );
          if (mountedRef.current) {
            setActivities((prev) =>
              prev.filter((a) => a.id !== activityId),
            );
          }
        } catch (err) {
          const liveError = normalizeLiveActivityError(err);
          if (mountedRef.current) setError(liveError);
          throw liveError;
        }
      },
      [],
    );

    const endAllActivities = useCallback(
      async (opts?: EndActivityOptions): Promise<void> => {
        setError(null);
        try {
          await fns.endAll(
            opts?.dismissalPolicy ?? 'default',
            opts?.dismissAfter ?? null,
          );
          if (mountedRef.current) {
            setActivities([]);
          }
        } catch (err) {
          const liveError = normalizeLiveActivityError(err);
          if (mountedRef.current) setError(liveError);
          throw liveError;
        }
      },
      [],
    );

    const getActivity = useCallback(
      async (activityId: string): Promise<LiveActivityInfo | null> => {
        try {
          const json = await fns.getActivity(activityId);
          if (!json) return null;
          return JSON.parse(json) as LiveActivityInfo;
        } catch {
          return null;
        }
      },
      [],
    );

    const listAllActivities = useCallback(async (): Promise<
      LiveActivityInfo[]
    > => {
      try {
        const json = await fns.listActivities();
        const list: LiveActivityInfo[] = JSON.parse(json);
        if (mountedRef.current) {
          setActivities(list);
        }
        return list;
      } catch {
        return [];
      }
    }, []);

    const getPushToken = useCallback(
      async (activityId: string): Promise<LiveActivityToken | null> => {
        try {
          const json = await fns.getPushToken(activityId);
          if (!json) return null;
          return JSON.parse(json) as LiveActivityToken;
        } catch {
          return null;
        }
      },
      [],
    );

    const clearError = useCallback(() => setError(null), []);

    // Subscribe to native events
    useEffect(() => {
      mountedRef.current = true;

      const unsubscribe = fns.addEventListener((event) => {
        if (!mountedRef.current) return;

        // Update local state based on event
        if (event.type === 'ended') {
          setActivities((prev) =>
            prev.filter((a) => a.id !== event.activityId),
          );
        } else if (event.type === 'stale') {
          setActivities((prev) =>
            prev.map((a) =>
              a.id === event.activityId ? { ...a, state: 'stale' } : a,
            ),
          );
        } else if (event.type === 'error' && event.payload?.error) {
          setError(event.payload.error);
        }

        // Forward to user's handler
        onEvent?.(event);
      });

      // Auto-check availability on mount
      if (autoCheckAvailability && !initializedRef.current) {
        initializedRef.current = true;
        checkAvailability();
        refreshActivities();
      }

      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, [autoCheckAvailability, onEvent, checkAvailability, refreshActivities]);

    return {
      isSupported,
      isEnabled,
      currentActivity,
      activities,
      isLoading,
      error,
      checkAvailability,
      start,
      update,
      end: endActivity,
      endAll: endAllActivities,
      getActivity,
      listActivities: listAllActivities,
      getPushToken,
      clearError,
    };
  };
}
