# mobile

React Native app built with Idealyst Framework

## Getting Started

This is a React Native application built with the Idealyst Framework.

### Prerequisites

- Node.js 18+
- Yarn
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

Install dependencies:
```bash
yarn install
```

### Running the App

Start the Metro bundler:
```bash
yarn start
```

Run on Android:
```bash
yarn android
```

Run on iOS:
```bash
yarn ios
```

### Project Structure

```
mobile/
├── src/
│   └── App.tsx        # Main app component
├── android/           # Android-specific code
├── ios/               # iOS-specific code
├── babel.config.js    # Babel configuration
├── metro.config.js    # Metro configuration
└── tsconfig.json      # TypeScript configuration
```

### Features

- **Idealyst Components**: Pre-built UI components
- **Idealyst Navigation**: Cross-platform navigation
- **Idealyst Theme**: Consistent theming system
- **TypeScript**: Full type safety
- **React Native 0.80.1**: Latest stable version

### Development

The app uses the Idealyst Framework for consistent UI and navigation across platforms.

Edit `src/App.tsx` to start building your application.

### Building for Production

Build Android APK:
```bash
yarn build:android
```

### Testing

Run tests:
```bash
yarn test
```

### Learn More

- [Idealyst Framework Documentation](https://github.com/your-username/idealyst-framework)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/) 