// Import shared unistyles configuration FIRST
// This ensures the theme is registered before any component stylesheets
import '@{{projectName}}/shared';

import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('{{projectName}}', () => App);
