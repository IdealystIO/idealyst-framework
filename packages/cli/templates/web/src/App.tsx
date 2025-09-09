import { BrowserRouter } from 'react-router-dom';
import { NavigatorProvider } from '@idealyst/navigation';
import AppRouter from './navigation/AppRouter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigatorProvider route={AppRouter} />
      </BrowserRouter>
    </div>
  );  
}

export default App; 