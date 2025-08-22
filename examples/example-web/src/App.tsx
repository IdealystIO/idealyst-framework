import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';
import { DataGridShowcase } from './DataGridShowcase';
import { View, Button } from '@idealyst/components';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  return (
    <View spacing="lg" style={{ padding: 20 }}>
      <Button onPress={() => navigate('/components')}>
        Component Examples
      </Button>
      <Button onPress={() => navigate('/datagrid')}>
        DataGrid Showcase
      </Button>
    </View>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/components/*" element={<NavigatorProvider route={ExampleStackRouter} />} />
          <Route path="/datagrid" element={<DataGridShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );  
}

export default App; 