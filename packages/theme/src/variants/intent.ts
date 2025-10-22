import { Intent, IntentValue, Theme } from "../theme";
import { Styles } from "../styles";

/**
 * Build the intent variants using a builder function
 * @param theme 
 * @param builder 
 * @returns 
 */
export function buildIntentVariants(theme: Theme, builder: (intent: IntentValue) => Styles): Record<Intent, Styles> {
    const variants = {} as Record<Intent, Styles>;
    for (const intent in theme.intents) {
        variants[intent as Intent] = builder(theme.intents[intent as Intent]);
    }
    return variants;
}
