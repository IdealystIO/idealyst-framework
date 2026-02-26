import type { ComponentScenario } from "../types.js";

export const multiScreenAppScenario: ComponentScenario = {
  type: "component",
  id: "multi-screen-app",
  name: "Multi-Screen Contacts App",
  description:
    "Tests whether the agent can build a multi-screen app with navigation, staying organized across many files without redundant API lookups",
  systemPrompt: `You are a React developer building a cross-platform app with the Idealyst framework.
You have access to MCP tools that provide framework documentation. Use them as needed.
Write your component code as real files using the Write tool to the workspace path provided.`,
  taskPrompt: `Build a 4-screen contacts mini-app with navigation. Create separate files for each screen:

**File 1: AppRouter.ts** (navigation setup)
- Tab navigation with "Contacts" and "Add Contact" tabs
- Stack navigation inside the Contacts tab for list -> detail flow
- Appropriate tab icons

**File 2: screens/ContactListScreen.tsx** (contacts list)
- A search/filter text input at the top
- A scrollable list of contacts showing Avatar + name + phone number
- Filter the list as the user types in the search input
- Tap a contact to navigate to the detail screen, passing the contact data

**File 3: screens/ContactDetailScreen.tsx** (contact detail)
- Display contact info in a Card: avatar, full name, phone, email
- A "Call" button and an "Email" button with appropriate icons
- A back navigation option

**File 4: screens/AddContactScreen.tsx** (add contact form)
- Text inputs for: first name, last name, phone number, email
- Form validation (require at least name and phone)
- A "Save Contact" button that shows a success state
- Clear the form after successful save

Include sample contact data (at least 6 contacts) and define a Contact TypeScript interface.`,
  expectedToolUsage: [
    "get_navigation_types",
    "get_component_types",
    "search_icons",
  ],
  expectedOutputPatterns: [
    /import.*from\s+['"]@idealyst\/navigation['"]/,
    /import.*from\s+['"]@idealyst\/components['"]/,
    /List|map\(/,
    /Avatar/,
    /TextInput/,
    /Button/,
    /Card/,
    /navigate\(/,
    /useNavigator/,
    /filter|search|Search/i,
  ],
  expectedFiles: {
    "AppRouter.ts":
      "Navigation configuration with tab and stack navigation",
    "screens/ContactListScreen.tsx":
      "Contact list with search filter and navigation to detail",
    "screens/ContactDetailScreen.tsx":
      "Contact detail card with call/email actions",
    "screens/AddContactScreen.tsx":
      "Add contact form with validation",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["navigation", "multi-screen", "forms", "components", "efficiency"],
};
