/**
 * Idealyst Recipes - Common UI Patterns
 * Ready-to-use code examples for building apps with Idealyst
 *
 * Recipes are organized by category for maintainability.
 */

export { Recipe } from "./types.js";
export { authRecipes } from "./auth.js";
export { settingsRecipes } from "./settings.js";
export { navigationRecipes } from "./navigation.js";
export { dataRecipes } from "./data.js";
export { layoutRecipes } from "./layout.js";
export { formsRecipes } from "./forms.js";
export { mediaRecipes } from "./media.js";

import { Recipe } from "./types.js";
import { authRecipes } from "./auth.js";
import { settingsRecipes } from "./settings.js";
import { navigationRecipes } from "./navigation.js";
import { dataRecipes } from "./data.js";
import { layoutRecipes } from "./layout.js";
import { formsRecipes } from "./forms.js";
import { mediaRecipes } from "./media.js";

/**
 * All recipes combined into a single record
 */
export const recipes: Record<string, Recipe> = {
  ...authRecipes,
  ...settingsRecipes,
  ...navigationRecipes,
  ...dataRecipes,
  ...layoutRecipes,
  ...formsRecipes,
  ...mediaRecipes,
};

/**
 * Get all recipes grouped by category
 */
export function getRecipesByCategory(): Record<string, Recipe[]> {
  const grouped: Record<string, Recipe[]> = {};

  for (const recipe of Object.values(recipes)) {
    if (!grouped[recipe.category]) {
      grouped[recipe.category] = [];
    }
    grouped[recipe.category].push(recipe);
  }

  return grouped;
}

/**
 * Get all recipes for a specific category
 */
export function getRecipesForCategory(category: string): Recipe[] {
  return Object.values(recipes).filter((r) => r.category === category);
}

/**
 * Search recipes by query
 */
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(recipes).filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.packages.some((p: string) => p.toLowerCase().includes(lowerQuery)) ||
      r.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get a summary list of all recipes
 */
export function getRecipeSummary(): Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  packages: string[];
}> {
  return Object.entries(recipes).map(([id, recipe]) => ({
    id,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    packages: recipe.packages,
  }));
}
