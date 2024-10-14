import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VStack, Button, Box, Heading, Grid, IconButton, HStack, Text, Tooltip, Container } from '@yamada-ui/react';
import { FaHome, FaClipboard } from 'react-icons/fa';
import { useApi } from '../hooks/useApi';
import Cell from '../components/Cell';
import { playerColors, Player } from '../constants/theme';

const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { request } = useApi();
  const navigate = useNavigate();
  const [board, setBoard] = useState<(string | null)[][]>(Array.from({ length: 3 }, () => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<[[number, number], [number, number], [number, number]] | null>(null);

  useEffect(() => {
    if (gameId) {
      const interval = setInterval(() => {
        fetchBoard();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameId]);

  const fetchBoard = async () => {
    try {
      const data = await request(`/board/${gameId}`);
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setWinningLine(data.winning_line);
    } catch {
      // エラーハンドリングはフックで処理済み
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (winner || !gameId) return;

    try {
      const data = await request(`/move/${gameId}`, 'POST', [row, col]);
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setWinningLine(data.winning_line);
    } catch {
      // エラーハンドリングはフックで処理済み
    }
  };

  const handleReset = async () => {
    try {
      await request(`/reset/${gameId}`, 'POST');
      setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
      setCurrentPlayer('X');
      setWinner(null);
      setWinningLine(null);
    } catch {
      // エラーハンドリングはフックで処理済み
    }
  };

  return (
    <Container maxW="container.md" centerContent minH="100vh" display="flex" flexDirection="column" justifyContent="center">
      <VStack align="center" width="100%">
        <HStack justifyContent="center" width="100%">
          <IconButton aria-label="Go back to home" icon={<FaHome />} onClick={() => navigate('/')} size="lg" colorScheme="teal" />
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
        </HStack>

        <Box marginY="4" textAlign="center">
          <Heading size="lg" color={winner ? playerColors[winner].color : playerColors[currentPlayer].color}>
            {winner ? `Winner: ${winner}` : `Current Turn: ${currentPlayer}`}
          </Heading>
        </Box>

        <Box position="relative" width="300px" height="300px">
          <Grid templateColumns="repeat(3, 1fr)" gap="4" width="100%" height="100%" zIndex={1}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell key={`${rowIndex}-${colIndex}`} value={cell || ""} onClick={() => handleCellClick(rowIndex, colIndex)} isWinning={winningLine?.some(([winRow, winCol]) => winRow === rowIndex && winCol === colIndex) || false} />
              ))
            )}
          </Grid>
        </Box>

        <Button onClick={handleReset} marginTop="4" colorScheme="teal">Reset Game</Button>
      </VStack>
    </Container>
  );
};

export default GameScreen;
