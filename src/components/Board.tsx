import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { VStack, Grid } from '@yamada-ui/react';
import axios from 'axios';

const Board: React.FC = () => {
  // 3x3のボード状態を管理
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");

  useEffect(() => {
    // ページが読み込まれた際にバックエンドからボードの状態を取得
    const fetchBoard = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/board');
        setBoard(response.data.board);
        setCurrentPlayer(response.data.current_player);
      }
      catch (error) {
        console.error("Failed to fetch board state:", error);
        if (error.response) {
          console.log("Error details:", error.response.data);
        } else {
          console.log("Error message:", error.message);
        }
      }
    };

    fetchBoard();
  }, []);

  // セルをクリックした際の処理
  const handleCellClick = async (row: number, col: number) => {
    console.log(`Attempting to place a piece at row: ${row}, col: ${col}`);
    try {
      const response = await axios.post('http://127.0.0.1:8080/move', [row, col]);
      console.log('Move response:', response.data);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
    } catch (error) {
      console.error("Invalid move:", error);
      console.log("Error details:", error.response?.data || error.message);
    }
  };

  return (
    <VStack spacing="4">
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
    </VStack>
  );
};

export default Board;

