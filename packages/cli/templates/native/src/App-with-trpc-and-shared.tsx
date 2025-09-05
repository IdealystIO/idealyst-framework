import React from 'react';

// Import shared components
import { HelloWorld } from '@{{workspaceScope}}/shared';

function App() {
  return (
    <HelloWorld name="{{projectName}} Mobile User" platform="mobile" projectName="{{projectName}}" />
  );
}

export default App;
