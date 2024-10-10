import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';  // 新規追加

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Service Worker を登録するためのコード
serviceWorkerRegistration.register();  // 新規追加
