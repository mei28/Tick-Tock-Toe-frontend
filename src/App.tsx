import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider, Container } from '@yamada-ui/react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

function App() {
  return (
    <UIProvider>
      <Container
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"       // ビューポート全体の高さを確保
        maxW="container.md"
      >
        <Router>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/game/:gameId" element={<GameScreen />} />
          </Routes>
        </Router>
      </Container>
    </UIProvider>
  );
}

export default App;

