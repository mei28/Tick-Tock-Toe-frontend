import React, { useState } from 'react';
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
  useNotice,
} from '@yamada-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa";
import { useApi } from '../hooks/useApi';

const HomeScreen: React.FC = () => {
  const [gameId, setGameId] = useState<string>('');
  const { request } = useApi();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notice = useNotice();

  // Updated handleNewGame to accept AI mode
  const handleNewGame = async (isAI: boolean) => {
    try {
      const url = isAI ? '/new?ai=true' : '/new';
      const shortGameId = await request(url, 'POST');
      navigate(`/game/${shortGameId.slice(0, 5)}`);
    } catch (error) {
      console.error("Failed to start a new game:", error);
    }
  };

  const handleJoinGame = () => {
    if (gameId.length === 5) {
      navigate(`/game/${gameId}`);
    } else {
      notice({
        title: 'Invalid Game ID',
        description: 'Please enter a valid 5-character game ID.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="center" justify="center" h="100vh">
      <Heading size="2xl" color="teal.500">Welcome to Tick-Tock-Toe</Heading>

      {/* Two buttons: one for AI game, one for Player vs Player game */}
      <Button onClick={() => navigate('/ai-settings')} colorScheme="teal" size="lg" width="60%" maxW="300px" mt={4}>
        Start AI Game
      </Button>

      <Button onClick={() => handleNewGame(false)} colorScheme="teal" size="lg" width="60%" maxW="300px" mt={4}>
        Start Player vs Player Game
      </Button>

      <Box width="100%" textAlign="center">
        <Text fontSize="lg" color="gray.600">or</Text>
      </Box>

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
          <Button onClick={handleJoinGame} colorScheme="teal" size="lg">Join</Button>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalHeader>How to Play</ModalHeader>
        <ModalBody>
          <Text>
            Tick-Tock-Toe is a fun twist on Tic-Tac-Toe. Each player can place only 3 pieces on the board at a time.
            When a player places a fourth piece, the oldest one disappears.
          </Text>
        </ModalBody>
      </Modal>

      <IconButton
        aria-label="How to Play"
        icon={<FaQuestionCircle />}
        onClick={onOpen}
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

