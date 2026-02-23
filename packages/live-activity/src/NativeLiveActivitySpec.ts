import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Availability
  isSupported(): boolean;
  isEnabled(): Promise<boolean>;

  // Lifecycle
  startActivity(
    templateType: string,
    attributesJson: string,
    contentStateJson: string,
    optionsJson: string,
  ): Promise<string>;

  updateActivity(
    activityId: string,
    contentStateJson: string,
    alertConfigJson: string | null,
  ): Promise<void>;

  endActivity(
    activityId: string,
    finalContentStateJson: string | null,
    dismissalPolicy: string,
    dismissAfter: number,
  ): Promise<void>;

  endAllActivities(
    dismissalPolicy: string,
    dismissAfter: number,
  ): Promise<void>;

  // Queries
  getActivity(activityId: string): Promise<string | null>;
  listActivities(): Promise<string>;

  // Push tokens
  getPushToken(activityId: string): Promise<string | null>;

  // Events
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'IdealystLiveActivity',
);
