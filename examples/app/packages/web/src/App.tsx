import { BrowserRouter } from 'react-router-dom';
import { App } from '@test-select-demo/shared';

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
