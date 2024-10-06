import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import WinningLineOverlay from './WinningLineOverlay';
import { VStack, Grid, Button, Box, Heading } from '@yamada-ui/react';
import axios from 'axios';
import { playerColors, Player } from '../constants/theme';

const API_URL = import.meta.env.VITE_API_URL;  // Use environment variable

type WinningLine = [[number, number], [number, number], [number, number]] | null;

const Board: React.FC = () => {
  // 3x3のボード状態を管理
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  // ボードの状態を取得するための関数
  const fetchBoard = async () => {
    try {
      const response = await axios.get(`${API_URL}/board`);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line);
    } catch (error) {
      console.error("Failed to fetch board state:", error);
    }
  };

  // セルをクリックした際の処理
  const handleCellClick = async (row: number, col: number) => {
    if (winner) {
      console.log("Game has already been won by:", winner);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/move`, [row, col]);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line);
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  // ゲームをリセットするための関数
  const handleReset = async () => {
    try {
      const response = await axios.post(`${API_URL}/reset`);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(null);
    } catch (error) {
      console.error("Failed to reset the game:", error);
    }
  };

  return (
    <VStack spacing="4">
      {winner ? (
        <Box>
          <Heading size="lg" color={playerColors[winner].color}>
            {`Winner: ${winner}`}
          </Heading>
        </Box>
      ) : (
        <Box>
          <Heading size="lg" color={playerColors[currentPlayer].color}>
            {`Current Turn: ${currentPlayer}`}
          </Heading>
        </Box>
      )}
      <Box position="relative" width="300px" height="300px">
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
      <Button onClick={handleReset} marginTop="4" colorScheme="teal">
        Reset Game
      </Button>
    </VStack>
  );
};

export default Board;

