import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VStack, Button, Box, Heading, Grid } from '@yamada-ui/react';
import axios from 'axios';
import Cell from './Cell'; // Cellコンポーネントを使用
import { playerColors, Player } from '../constants/theme'; // プレイヤーカラーを適用

const API_URL = import.meta.env.VITE_API_URL;

const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [board, setBoard] = useState<(string | null)[][]>(Array.from({ length: 3 }, () => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<[[number, number], [number, number], [number, number]] | null>(null);

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
      setWinningLine(response.data.winning_line); // 勝利ラインを設定
    } catch (error) {
      console.error('Failed to fetch board state:', error);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (winner || !gameId) return;

    try {
      const response = await axios.post(`${API_URL}/move/${gameId}`, [row, col]);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(response.data.winner);
      setWinningLine(response.data.winning_line); // 勝利ラインを更新
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  const handleReset = async () => {
    if (!gameId) return;

    try {
      const response = await axios.post(`${API_URL}/reset/${gameId}`);
      setBoard(response.data.board);
      setCurrentPlayer(response.data.current_player);
      setWinner(null);
      setWinningLine(null); // 勝利ラインをリセット
    } catch (error) {
      console.error('Failed to reset the game:', error);
    }
  };

  return (
    <VStack>
      <Heading size="lg">Game ID: {gameId}</Heading>
      <Heading size="lg">
        {winner ? `Winner: ${winner}` : `Current Turn: ${currentPlayer}`}
      </Heading>

      <Box position="relative" width="300px" height="300px">
        {/* 盤面を表示 */}
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

      {/* ゲームが終了している場合は新しいゲームを始めるボタン */}
      {winner && (
        <Button onClick={handleReset} marginTop="4" colorScheme="teal">
          Start New Game
        </Button>
      )}

      {/* リセットボタン */}
      {!winner && gameId && (
        <Button onClick={handleReset} marginTop="4" colorScheme="teal">
          Reset Game
        </Button>
      )}
    </VStack>
  );
};

export default GameScreen;

