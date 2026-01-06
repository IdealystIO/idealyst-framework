import { RegisteredTheme, IntentValueExtensions } from './extensions';
import { IntentValue as BaseIntentValue } from './structures';

/**
 * All available intent types.
 * Derived from your registered theme's intents.
 */
export type Intent = keyof RegisteredTheme['theme']['intents'];

/**
 * Intent value structure with any extensions.
 */
export type IntentValue = BaseIntentValue & IntentValueExtensions;
