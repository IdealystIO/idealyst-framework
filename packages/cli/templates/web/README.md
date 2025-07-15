# {{projectName}}

{{description}}

## Getting Started

This is a React web application built with the Idealyst Framework and Vite.

### Prerequisites

- Node.js 18+
- Yarn

### Installation

Install dependencies:
```bash
yarn install
```

### Development

Start the development server:
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the app:
```bash
yarn build
```

Preview the production build:
```bash
yarn preview
```

### Project Structure

```
{{projectName}}/
├── src/
│   ├── App.tsx        # Main app component
│   └── main.tsx       # App entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

### Features

- **Idealyst Components**: Cross-platform UI components
- **Idealyst Navigation**: Consistent navigation system
- **Idealyst Theme**: Unified theming across platforms
- **React 19.1**: Latest React version
- **Vite**: Fast build tool and dev server
- **TypeScript**: Full type safety
- **React Native Web**: Use React Native components on the web

### Development

The app uses the Idealyst Framework for consistent UI and navigation that works across web and mobile platforms.

Edit `src/App.tsx` to start building your application.

### Styling

The app uses Unistyles for cross-platform styling. You can create styles that work on both web and mobile:

```tsx
import { createStyleSheet } from 'react-native-unistyles';

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

### Learn More

- [Idealyst Framework Documentation](https://github.com/your-username/idealyst-framework)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/) 