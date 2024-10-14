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

  const handleNewGame = async () => {
    try {
      const shortGameId = await request('/new', 'POST');
      navigate(`/game/${shortGameId.slice(0, 5)}`);
    } catch (error) {
      // エラーは useApi フック内で処理済み
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

      <Button onClick={handleNewGame} colorScheme="teal" size="lg" width="60%" maxW="300px" mt={4}>
        Start New Game
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

