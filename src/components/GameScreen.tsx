import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  VStack,
  Button,
  Box,
  Heading,
  Grid,
  IconButton,
  HStack,
  Text,
  Tooltip,
  Container,
} from '@yamada-ui/react';
import { FaHome, FaClipboard } from 'react-icons/fa';
import { useApi } from '../hooks/useApi';
import Cell from './Cell';
import { playerColors, Player } from '../constants/theme';

const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { request } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [board, setBoard] = useState<(string | null)[][]>(Array.from({ length: 3 }, () => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<[[number, number], [number, number], [number, number]] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false); // AI thinking state

  const isAIMode = new URLSearchParams(location.search).get('aiLevel') !== null;

  useEffect(() => {
    if (gameId) {
      const interval = setInterval(() => {
        fetchBoard(true); // Fetch board with auto-update
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameId]);

  // Function to fetch the board state
  const fetchBoard = async (autoUpdate = false) => {
    try {
      const data = await request(`/board/${gameId}`, 'GET', undefined, autoUpdate);
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setWinningLine(data.winning_line);
      setIsAiThinking(data.isThinking);
    } catch (error) {
      console.error("Failed to fetch board:", error);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (winner || !gameId || isAiThinking) return;

    try {
      const data = await request(`/move/${gameId}`, 'POST', [row, col]);
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setWinningLine(data.winning_line);
      setIsAiThinking(data.isThinking);

      // If AI is thinking, wait a moment and re-fetch
      if (data.isThinking) {
        setTimeout(fetchBoard, 1000);
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const handleReset = async () => {
    try {
      await request(`/reset/${gameId}`, 'POST');
      setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
      setCurrentPlayer('X');
      setWinner(null);
      setWinningLine(null);
      setIsAiThinking(false); // Reset AI thinking state
    } catch (error) {
      console.error("Failed to reset the game:", error);
    }
  };

  return (
    <Container
      maxW="container.md"
      centerContent
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <VStack align="center" width="100%">
        <HStack justifyContent="center" width="100%" mb={4}>
          <IconButton
            aria-label="Go back to home"
            icon={<FaHome />}
            onClick={() => navigate('/')}
            size="lg"
            colorScheme="teal"
          />
          {/* Room number and copy button only visible when not in AI mode */}
          {!isAIMode && (
            <HStack>
              <Text fontSize="md" color="gray.500">{`Game ID: ${gameId}`}</Text>
              <Tooltip label="Copy to clipboard">
                <IconButton
                  aria-label="Copy game ID"
                  icon={<FaClipboard />}
                  onClick={() => navigator.clipboard.writeText(gameId!)}
                  size="md"
                  colorScheme="teal"
                />
              </Tooltip>
            </HStack>
          )}
        </HStack>

        {isAiThinking && (
          <Text fontSize="lg" color="orange.500" fontWeight="bold">
            AI is thinking...
          </Text>
        )}

        <Box marginY="4" textAlign="center">
          <Heading size="lg" color={winner ? playerColors[winner].color : playerColors[currentPlayer].color}>
            {winner ? `Winner: ${winner}` : `Current Turn: ${currentPlayer}`}
          </Heading>
        </Box>

        <Box position="relative" width="300px" height="300px">
          <Grid templateColumns="repeat(3, 1fr)" gap="4" width="100%" height="100%" zIndex={1}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell || ""}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  isWinning={winningLine?.some(([winRow, winCol]) => winRow === rowIndex && winCol === colIndex) || false}
                  winner={winner}
                />
              ))
            )}
          </Grid>
        </Box>

        <Button onClick={handleReset} marginTop="4" colorScheme="teal">
          Reset Game
        </Button>
      </VStack>
    </Container>
  );
};

export default GameScreen;

