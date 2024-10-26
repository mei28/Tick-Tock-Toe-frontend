import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { VStack, Grid, Button, Box, Heading, Input, HStack, Text } from '@yamada-ui/react';
import axios from 'axios';
import { playerColors, Player } from '../constants/theme';

const API_URL = import.meta.env.VITE_API_URL;

type WinningLine = [[number, number], [number, number], [number, number]] | null;

const Board: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(Array.from({ length: 3 }, () => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [inputGameId, setInputGameId] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false); // AI's thinking state

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
      setIsAiThinking(response.data.isThinking); // Update AI's thinking state
    } catch (error) {
      console.error("Failed to fetch board state:", error);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    // Disable click if AI is thinking, there’s a winner, or the cell is occupied
    if (winner || !gameId || isAiThinking || board[row][col]) return;

    try {
      const response = await axios.post(`${API_URL}/move/${gameId}`, [row, col]);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line);
      setIsAiThinking(response.data.isThinking);

      // If AI is thinking, fetch board state after a delay
      if (response.data.isThinking) {
        setTimeout(fetchBoard, 1000);
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  // (Other existing functions remain unchanged)

  return (
    <VStack align="center">
      {gameId && (
        <Text fontSize="lg" color="gray.500">
          {`Game ID: ${gameId}`}
        </Text>
      )}

      {isAiThinking && (
        <Text fontSize="lg" color="orange.500" fontWeight="bold">
          AI is thinking...
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

