import React, { useState } from 'react';
import { VStack, Button, Input, Heading, Box } from '@yamada-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const HomeScreen: React.FC = () => {
  const [gameId, setGameId] = useState<string>('');
  const navigate = useNavigate();

  const handleNewGame = async () => {
    try {
      const response = await axios.post(`${API_URL}/new`);
      const shortGameId = response.data.slice(0, 5);  // Shorten to 5 characters
      navigate(`/game/${shortGameId}`);  // Navigate to the game screen
    } catch (error) {
      console.error("Failed to start a new game:", error);
    }
  };

  const handleJoinGame = () => {
    if (gameId.length === 5) {
      navigate(`/game/${gameId}`);
    } else {
      alert('Please enter a valid 5-character game ID.');
    }
  };

  return (
    <VStack>
      <Heading>Welcome to Tick-Tock-Toe</Heading>
      <Button onClick={handleNewGame} colorScheme="teal" marginY="4">
        Start New Game
      </Button>
      <Box>
        <Input
          placeholder="Enter game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          maxLength={5}
        />
        <Button onClick={handleJoinGame} colorScheme="teal" marginY="4">
          Join Game
        </Button>
      </Box>
    </VStack>
  );
};

export default HomeScreen;
