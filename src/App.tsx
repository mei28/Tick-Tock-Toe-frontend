import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider, Container } from '@yamada-ui/react'; // Import Container for centralized layout
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

function App() {
  return (
    <UIProvider>
      <Container maxW="container.md" centerContent> {/* コンテンツ全体を中央に配置 */}
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

