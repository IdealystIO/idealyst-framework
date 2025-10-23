import { AllColorTypes, Color, ColorValue } from "./colors";
import { Intent, IntentValue } from "./intent";
import { Surface, SurfaceValue } from "./surface";
import { AllComponentSizes, SizeValue } from "./size";

export type Theme = {
    intents: Record<Intent, IntentValue>;
    colors: AllColorTypes;
    sizes: AllComponentSizes
};

export * from "./intent";
export * from "./size";
export * from "./colors";