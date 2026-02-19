/**
 * Supervisor Evaluation Criteria
 *
 * Extensible criterion definitions for the supervisor agent.
 * Adding a new criterion = appending to DEFAULT_CRITERIA.
 * The supervisor prompt, DB storage, and reports all adapt automatically.
 */

export interface SupervisorCriterion {
  /** Unique ID used in JSON responses and DB storage */
  id: string;
  /** Human-readable label for reports */
  label: string;
  /** Weight for computing qualitative score (must sum to 1.0 across all criteria) */
  weight: number;
  /** How severely a failure impacts the score */
  failSeverity: "huge" | "medium" | "proportional";
  /** Brief description shown to the supervisor */
  description: string;
  /** Detailed scoring guidance for the supervisor */
  evalGuidance: string;
}

export const DEFAULT_CRITERIA: SupervisorCriterion[] = [
  {
    id: "idealyst_usage",
    label: "Idealyst Usage",
    weight: 0.15,
    failSeverity: "proportional",
    description:
      "Did the agent use Idealyst components, utilities, and APIs properly?",
    evalGuidance: `Score based on how correctly the agent used @idealyst/* packages.
- 90-100: All imports correct, APIs used as documented, proper component composition
- 60-89: Mostly correct usage with minor mistakes (wrong prop names, missing optional props)
- 30-59: Mixed usage — some correct, some hallucinated or misused APIs
- 0-29: Mostly incorrect or didn't use Idealyst at all`,
  },
  {
    id: "navigation_understanding",
    label: "Navigation Understanding",
    weight: 0.1,
    failSeverity: "proportional",
    description:
      "Did the agent understand the @idealyst/navigation system?",
    evalGuidance: `Score based on correct use of the Idealyst navigation system.
- 90-100: Correctly uses Router, Screen, TabNavigator, StackNavigator, Link, etc.
- 60-89: Mostly correct but minor issues (e.g., wrong navigator nesting)
- 30-59: Mixed React Navigation and Idealyst navigation, or significant errors
- 0-29: Used React Navigation directly instead of @idealyst/navigation, or no navigation
- N/A: If the task didn't require navigation, score 100 (not applicable)`,
  },
  {
    id: "no_raw_primitives",
    label: "No Raw Primitives",
    weight: 0.2,
    failSeverity: "huge",
    description:
      "Did the agent avoid using raw React/React Native primitives instead of Idealyst components?",
    evalGuidance: `This is a HUGE FAIL if violated. Score 0 if the agent used raw primitives.
- 100: All UI uses @idealyst/components (Text, View, Button, etc. from the package)
- 60-80: Mostly Idealyst components but used 1-2 raw primitives (e.g., <div>, <span>)
- 0-30: Used React Native View/Text/TouchableOpacity or HTML div/span/button directly
Note: Importing { View, Text } from '@idealyst/components' is CORRECT.
Importing { View, Text } from 'react-native' is a HUGE FAILURE.
Using <div>, <span>, <button> etc. HTML elements is also a HUGE FAILURE.`,
  },
  {
    id: "valid_props",
    label: "Valid Props",
    weight: 0.15,
    failSeverity: "medium",
    description:
      "Did the agent pass valid props to Idealyst components?",
    evalGuidance: `Score based on whether component props match the actual TypeScript interfaces.
- 90-100: All props are valid, correct types, no fabricated props
- 60-89: Mostly valid but 1-3 props are wrong or don't exist on the component
- 30-59: Many invalid props, suggesting the agent didn't check types
- 0-29: Majority of props are fabricated or wrong types
Cross-reference with TypeScript compilation results if available.`,
  },
  {
    id: "self_correction",
    label: "Self-Correction",
    weight: 0.15,
    failSeverity: "huge",
    description:
      "When the agent discovered wrong props/APIs (via MCP tools or errors), did it correct itself?",
    evalGuidance: `This is a HUGE FAIL if the agent saw evidence of mistakes but didn't fix them.
- 100: Agent corrected all mistakes after discovering them, or made no mistakes
- 70-90: Agent corrected most mistakes but missed 1-2
- 30-60: Agent saw errors but only partially corrected them
- 0-29: Agent saw clear evidence of wrong usage (from tool responses or types) and ignored it
If the agent never made mistakes, score 100. Focus on the response to discovered errors.`,
  },
  {
    id: "package_awareness",
    label: "Package Awareness",
    weight: 0.1,
    failSeverity: "proportional",
    description:
      "Did the agent know to use specific @idealyst packages for specific functions?",
    evalGuidance: `Score based on whether the agent discovered and used the right @idealyst/* packages.
- 90-100: Used correct packages for each capability (e.g., @idealyst/microphone for recording)
- 60-89: Found some packages but missed others, or used generic solutions for things Idealyst provides
- 30-59: Largely unaware of available packages, used third-party alternatives for things Idealyst covers
- 0-29: Didn't explore packages at all
Consider: @idealyst/storage for persistence, @idealyst/translate for i18n, @idealyst/camera for photos, etc.`,
  },
  {
    id: "cross_platform_custom",
    label: "Cross-Platform Custom",
    weight: 0.05,
    failSeverity: "proportional",
    description:
      "When Idealyst doesn't provide something, did the agent implement it in a cross-platform way?",
    evalGuidance: `Score based on custom implementations being properly cross-platform.
- 90-100: Created .web.tsx/.native.tsx variants or used platform-agnostic code when needed
- 60-89: Mostly cross-platform but some platform-specific code without variants
- 30-59: Mixed approach, some platform-aware and some not
- 0-29: Wrote platform-specific code without platform variants
- N/A: If the task didn't require custom implementations, score 100`,
  },
  {
    id: "true_cross_platform",
    label: "True Cross-Platform",
    weight: 0.1,
    failSeverity: "proportional",
    description:
      "Is the code truly cross-platform, avoiding hacks like 'typeof window !== undefined'?",
    evalGuidance: `Score based on code being genuinely cross-platform without jank.
- 90-100: Clean cross-platform code, no runtime platform checks for rendering
- 60-89: Minor platform-specific workarounds that are acceptable (e.g., platform-specific styles)
- 30-59: Uses typeof window !== 'undefined' or Platform.OS checks for component rendering
- 0-29: Heavy use of platform detection hacks, not truly cross-platform
Note: Using Platform.OS for minor style adjustments is acceptable. Using it to conditionally render entirely different component trees is a failure.`,
  },
];

/**
 * Get a criterion by ID. Throws if not found.
 */
export function getCriterionById(id: string): SupervisorCriterion {
  const criterion = DEFAULT_CRITERIA.find((c) => c.id === id);
  if (!criterion) {
    throw new Error(`Unknown criterion ID: ${id}`);
  }
  return criterion;
}
