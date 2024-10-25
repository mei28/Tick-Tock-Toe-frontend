import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider, Container } from '@yamada-ui/react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import AISettingsScreen from './components/AISettingsScreen';
import ErrorPage from './components/ErrorPage';
import StatusScreen from './components/StatusScreen';

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
            <Route path ="/ai-settings" element={<AISettingsScreen />} />
            <Route path="/game/:gameId" element={<GameScreen />} />
            <Route path="/status" element={<StatusScreen />} />

            {/* エラーページ */}
            <Route
              path="/403"
              element={
                <ErrorPage
                  code={403}
                  imageSrc="/403 Forbidden.png"
                />
              }
            />
            <Route
              path="/404"
              element={
                <ErrorPage
                  code={404}
                  imageSrc="/404 NotFound.png"
                />
              }
            />
            <Route
              path="/418"
              element={
                <ErrorPage
                  code={418}
                  imageSrc="/418 I'm a teapot.png"
                />
              }
            />
            <Route
              path="/500"
              element={
                <ErrorPage
                  code={500}
                  imageSrc="/500 InternalServerError.png"
                />
              }
            />
            <Route
              path="/503"
              element={
                <ErrorPage
                  code={503}
                  imageSrc="/503 ServiceUnavailable.png"
                />
              }
            />
            <Route
              path="*"
              element={
                <ErrorPage
                  code={404}
                  imageSrc="/404 NotFound.png"
                />
              }
            />
          </Routes>
        </Router>
      </Container>
    </UIProvider>
  );
}

export default App;

