import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider } from '@yamada-ui/react'; // Import UIProvider from yamadaui
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

function App() {
  return (
    <UIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/game/:gameId" element={<GameScreen />} />
        </Routes>
      </Router>
    </UIProvider>
  );
}

export default App;

