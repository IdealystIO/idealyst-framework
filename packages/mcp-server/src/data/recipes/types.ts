/**
 * Recipe type definitions
 */

export interface Recipe {
  name: string;
  description: string;
  category: "forms" | "navigation" | "data" | "layout" | "auth" | "settings" | "media";
  difficulty: "beginner" | "intermediate" | "advanced";
  packages: string[];
  code: string;
  explanation: string;
  tips?: string[];
  relatedRecipes?: string[];
}
