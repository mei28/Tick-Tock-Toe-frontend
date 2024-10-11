import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIProvider, Container } from '@yamada-ui/react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ErrorPage from './components/ErrorPage';

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

            {/* エラーページのルート設定 */}
            <Route
              path="/403"
              element={
                <ErrorPage
                  code={403}
                  message="Forbidden: You don't have access to this page."
                  imageSrc="/403 Forbidden.png"
                />
              }
            />
            <Route
              path="/404"
              element={
                <ErrorPage
                  code={404}
                  message="Page Not Found."
                  imageSrc="/404 NotFound.png"
                />
              }
            />
            <Route
              path="/418"
              element={
                <ErrorPage
                  code={418}
                  message="I'm a teapot! This is a fun error."
                  imageSrc="/418 I'm a teapot.png"
                />
              }
            />
            <Route
              path="/500"
              element={
                <ErrorPage
                  code={500}
                  message="Internal Server Error."
                  imageSrc="/500 InternalServerError.png"
                />
              }
            />
            <Route
              path="/503"
              element={
                <ErrorPage
                  code={503}
                  message="Service Unavailable."
                  imageSrc="/503 ServiceUnavailable.png"
                />
              }
            />
            {/* 未知のページにアクセスした場合の404エラー */}
            <Route
              path="*"
              element={
                <ErrorPage
                  code={404}
                  message="Page Not Found."
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

