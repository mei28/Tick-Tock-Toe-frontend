import React, { useState } from 'react';
import { VStack, Button, Input, Heading, Box, HStack, Text } from '@yamada-ui/react';
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
    <VStack align="center" justify="center" h="100vh">
      <Heading size="2xl" color="teal.500">
        Welcome to Tick-Tock-Toe
      </Heading>

      {/* 新しいゲームを開始するボタン */}
      <Button
        onClick={handleNewGame}
        colorScheme="teal"
        size="lg"
        width="60%"
        maxW="300px"
      >
        Start New Game
      </Button>

      <Box width="100%" textAlign="center">
        <Text fontSize="lg" color="gray.600">
          or
        </Text>
      </Box>

      {/* 既存のゲームに参加するための入力フォームとボタン */}
      <VStack width="100%" align="center">
        <HStack width="60%" maxW="300px">
          <Input
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            maxLength={5}
            size="lg"
            variant="filled"
          />
          <Button onClick={handleJoinGame} colorScheme="teal" size="lg">
            Join
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default HomeScreen;

