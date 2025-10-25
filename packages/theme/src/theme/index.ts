import { AllColorTypes, Color, ColorValue } from "./color";
import { Intent, IntentValue } from "./intent";
import { AllComponentSizes, SizeValue } from "./size";
import { AllShadowTypes } from "./shadow";

export type Theme = {
    intents: Record<Intent, IntentValue>;
    colors: AllColorTypes;
    sizes: AllComponentSizes;
    shadows: AllShadowTypes;
};

export * from "./intent";
export * from "./size";
export * from "./color";
export * from "./shadow";
