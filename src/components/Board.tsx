import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { VStack, Grid, Button, Box } from '@yamada-ui/react';
import axios from 'axios';

const Board: React.FC = () => {
  // 3x3のボード状態を管理
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  // ボードの状態を取得するための関数
  const fetchBoard = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/board');
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
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
      const response = await axios.post('http://127.0.0.1:8080/move', [row, col]);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  // ゲームをリセットするための関数
  const handleReset = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/reset');
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
    } catch (error) {
      console.error("Failed to reset the game:", error);
    }
  };

  return (
    <VStack spacing="4">
      {winner && (
        <Box>
          <h2>{`Winner: ${winner}`}</h2>
        </Box>
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap="4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell || ""}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </Grid>
      <Button onClick={handleReset} marginTop="4">
        Reset Game
      </Button>
    </VStack>
  );
};

export default Board;

