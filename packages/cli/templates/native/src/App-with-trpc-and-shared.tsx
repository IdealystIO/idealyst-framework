import React from 'react';
import { App } from '@{{workspaceScope}}/shared';

// Main App component using shared App wrapper
function AppWithTrpcAndShared() {
  return (
    <App 
      apiUrl="http://localhost:3000/trpc"
      name="{{projectName}} Mobile User"
      platform="mobile"
      projectName="{{projectName}}"
    />
  );
}

export default AppWithTrpcAndShared;
