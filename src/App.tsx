import React from 'react';
import { UIProvider, Container, Heading } from '@yamada-ui/react';
import Board from './components/Board';

const App: React.FC = () => {
  return (
    <UIProvider>
      <Container centerContent>
        <Heading my="8" color="teal.600">Tick-Tock-Toe</Heading>
        <Board />
      </Container>
    </UIProvider>
  );
};

export default App;

