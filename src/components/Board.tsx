import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { VStack, Grid, Button, Box, Heading, Input, HStack, Text } from '@yamada-ui/react';
import axios from 'axios';
import { playerColors, Player } from '../constants/theme';

const API_URL = import.meta.env.VITE_API_URL;  // Use environment variable

type WinningLine = [[number, number], [number, number], [number, number]] | null;

const Board: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(Array.from({ length: 3 }, () => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [inputGameId, setInputGameId] = useState<string>("");

  useEffect(() => {
    if (gameId) {
      fetchBoard();
    }
  }, [gameId]);

  const fetchBoard = async () => {
    try {
      const response = await axios.get(`${API_URL}/board/${gameId}`);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line);
    } catch (error) {
      console.error("Failed to fetch board state:", error);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (winner || !gameId) return;

    try {
      const response = await axios.post(`${API_URL}/move/${gameId}`, [row, col]);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line);
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const handleReset = async () => {
    if (!gameId) return;

    try {
      const response = await axios.post(`${API_URL}/reset/${gameId}`);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(null);
    } catch (error) {
      console.error("Failed to reset the game:", error);
    }
  };

  const handleNewGame = async () => {
    try {
      const response = await axios.post(`${API_URL}/new`);
      setGameId(response.data);
      setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
      setCurrentPlayer("X");
      setWinner(null);
      setWinningLine(null);
    } catch (error) {
      console.error("Failed to start a new game:", error);
    }
  };

  const handleJoinGame = () => {
    setGameId(inputGameId);
    setInputGameId("");
  };

  return (
    <VStack align="center" >
      {gameId && (
        <Text fontSize="lg" color="gray.500">
          {`Game ID: ${gameId}`}
        </Text>
      )}

      {!gameId && (
        <Button onClick={handleNewGame} colorScheme="teal" marginY="4">
          Start New Game
        </Button>
      )}

      {!gameId && (
        <HStack marginY="4">
          <Input
            placeholder="Enter Game ID"
            value={inputGameId}
            onChange={(e) => setInputGameId(e.target.value)}
            width="200px"
          />
          <Button onClick={handleJoinGame} colorScheme="teal">
            Join Game
          </Button>
        </HStack>
      )}

      {gameId && (
        <>
          <Heading size="lg" color={winner ? playerColors[winner].color : playerColors[currentPlayer].color}>
            {winner ? `Winner: ${winner}` : `Current Turn: ${currentPlayer}`}
          </Heading>

          <Box position="relative" width="300px" height="300px" marginY="6">
            <Grid templateColumns="repeat(3, 1fr)" gap="4" width="100%" height="100%" zIndex={1}>
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Cell
                    key={`${rowIndex}-${colIndex}`}
                    value={cell || ""}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    isWinning={winningLine?.some(([winRow, winCol]) => winRow === rowIndex && winCol === colIndex) || false}
                  />
                ))
              )}
            </Grid>
          </Box>

          {winner && (
            <Button onClick={handleNewGame} colorScheme="teal" marginTop="4">
              Start New Game
            </Button>
          )}

          {!winner && gameId && (
            <Button onClick={handleReset} colorScheme="teal" marginTop="4">
              Reset Game
            </Button>
          )}
        </>
      )}
    </VStack>
  );
};

export default Board;

