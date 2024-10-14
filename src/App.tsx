import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider, Container } from '@yamada-ui/react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ErrorRoutes from './routes/ErrorRoutes';

function App() {
  return (
    <UIProvider>
      <Container display="flex" justifyContent="center" alignItems="center" minH="100vh" maxW="container.md">
        <Router>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/game/:gameId" element={<GameScreen />} />
            <Route path="*" element={<ErrorRoutes />} />
          </Routes>
        </Router>
      </Container>
    </UIProvider>
  );
}

export default App;

