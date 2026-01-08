import type { TranslateConfig } from '../provider/types';

/**
 * Define a translation configuration with type safety
 */
export function defineConfig(config: TranslateConfig): TranslateConfig {
  return config;
}

export type { TranslateConfig };
