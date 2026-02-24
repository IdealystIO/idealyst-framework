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
 * Keyword synonyms for recipe search.
 * When a user searches for a term on the left, also match terms on the right.
 */
const searchSynonyms: Record<string, string[]> = {
  profile: ['settings', 'account', 'user', 'avatar', 'edit'],
  account: ['profile', 'settings', 'user'],
  user: ['profile', 'account', 'avatar'],
  preferences: ['settings'],
  dark: ['theme', 'appearance'],
  light: ['theme', 'appearance'],
  appearance: ['theme'],
  register: ['signup', 'sign-up'],
  signin: ['login', 'sign-in'],
  'sign-in': ['login'],
  'sign-up': ['signup'],
  modal: ['overlay', 'dialog', 'sheet'],
  popup: ['modal', 'dialog', 'overlay'],
  table: ['datagrid', 'data', 'list'],
  grid: ['datagrid', 'data', 'list'],
  upload: ['file', 'image', 'media'],
  picker: ['file', 'image', 'select'],
  loading: ['skeleton'],
  spinner: ['loading', 'skeleton'],
  api: ['trpc', 'backend', 'router', 'server'],
  backend: ['trpc', 'api', 'router', 'server'],
  server: ['api', 'backend', 'trpc'],
  router: ['trpc', 'api'],
  database: ['prisma', 'trpc', 'data'],
  prisma: ['database', 'trpc'],
  crud: ['trpc', 'data', 'list'],
  todo: ['trpc', 'data'],
  layout: ['sidebar', 'web-layout', 'navigation', 'outlet', 'dashboard'],
  sidebar: ['layout', 'web-layout', 'navigation', 'drawer', 'collapsible'],
  outlet: ['layout', 'web-layout', 'navigation', 'sidebar'],
  dashboard: ['layout', 'sidebar', 'web-layout', 'admin'],
  'web-layout': ['layout', 'sidebar', 'outlet', 'navigation'],
  collapsible: ['sidebar', 'layout', 'web-layout', 'drawer'],
};

/**
 * Search recipes by query.
 * Matches against recipe ID (slug), name, description, packages, and category.
 * Also supports multi-word queries and synonym expansion.
 */
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

  // Expand query with synonyms
  const expandedWords = new Set(queryWords);
  for (const word of queryWords) {
    const syns = searchSynonyms[word];
    if (syns) {
      for (const syn of syns) expandedWords.add(syn);
    }
  }

  return Object.entries(recipes)
    .filter(([id, r]) => {
      const searchText = `${id} ${r.name} ${r.description} ${r.packages.join(' ')} ${r.category} ${(r.relatedRecipes || []).join(' ')}`.toLowerCase();

      // Exact substring match
      if (searchText.includes(lowerQuery)) return true;

      // All words match (supports "navigation tabs" matching "tab-navigation")
      if (queryWords.length > 1 && queryWords.every(w => searchText.includes(w))) return true;

      // Synonym-expanded match: any expanded word matches
      for (const word of expandedWords) {
        if (searchText.includes(word)) return true;
      }

      return false;
    })
    .map(([_, r]) => r);
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
