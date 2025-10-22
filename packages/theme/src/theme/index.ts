import { Color, ColorValue } from "./colors";
import { Intent, IntentValue } from "./intent";
import { AllComponentSizes, SizeValue } from "./size";

export type Theme = {
    intents: Record<Intent, IntentValue>;
    colors: Record<Color, ColorValue>;
    sizes: AllComponentSizes
};

export * from "./intent";
export * from "./size";
export * from "./colors";