import { BrowserRouter } from 'react-router-dom';
import { App } from '@{{workspaceScope}}/shared';

function WebApp() {
  return (
    <div className="App">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </div>
  );  
}

export default WebApp; 