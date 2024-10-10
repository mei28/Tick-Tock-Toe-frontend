import React from 'react';
import {
  VStack,
  Button,
  Input,
  Heading,
  Box,
  HStack,
  Text,
  IconButton,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@yamada-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const HomeScreen: React.FC = () => {
  const [gameId, setGameId] = React.useState<string>('');
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state

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

      {/* New game button */}
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

      {/* Join existing game */}
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

      {/* Modal for instructions */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalHeader>How to Play</ModalHeader>
        <ModalBody>
          <Text>
            Tick-Tock-Toe is a fun twist on Tic-Tac-Toe. Each player can place only 3 pieces on the board at a time. When a player places a fourth piece, the oldest one disappears.
          </Text>
          <Text marginTop="4">
            The goal is to align three pieces in a row—horizontally, vertically, or diagonally—to win the game.
          </Text>
        </ModalBody>
      </Modal>

      {/* Small question mark button at the bottom right */}
      <IconButton
        aria-label="How to Play"
        icon={<FaQuestionCircle />}
        onClick={onOpen} // Open the modal when clicked
        size="lg"
        color="gray.500"
        variant="ghost"
        position="fixed"
        bottom="2"
        right="2"
      />
    </VStack>
  );
};

export default HomeScreen;

