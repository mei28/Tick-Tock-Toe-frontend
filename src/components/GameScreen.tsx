import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VStack, Button, Box, Heading, Grid, IconButton, HStack } from '@yamada-ui/react';
import { FaHome } from "react-icons/fa";
import { Icon } from "@yamada-ui/react"
import axios from 'axios';
import Cell from './Cell';
import { playerColors, Player } from '../constants/theme'; // プレイヤーカラー

const API_URL = import.meta.env.VITE_API_URL;

const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate(); // ホームに戻るためのナビゲート関数
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
      setWinningLine(response.data.winning_line);
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
      setWinningLine(response.data.winning_line);
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
      setWinningLine(null);
    } catch (error) {
      console.error('Failed to reset the game:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/'); // ホームに戻る
  };

  return (
    <VStack>
      {/* 上部に戻るボタンとゲームIDの表示 */}
      <HStack justifyContent="space-between" width="100%">
        <IconButton
          aria-label="Go back to home"
          icon={<Icon as={FaHome} />}
          onClick={handleBackToHome}
          size="lg"
          colorScheme="teal"
        />
        <Heading size="md" color="gray.500">
          {`Game ID: ${gameId}`}
        </Heading>
        <Box width="48px" /> {/* ボタン分のスペースを確保 */}
      </HStack>

      {/* プレイヤー情報の表示 */}
      <Box marginY="4">
        {winner ? (
          <Heading size="lg" color={playerColors[winner].color}>
            {`Winner: ${winner}`}
          </Heading>
        ) : (
          <Heading size="lg" color={playerColors[currentPlayer].color}>
            {`Current Turn: ${currentPlayer}`}
          </Heading>
        )}
      </Box>

      {/* ボードの表示 */}
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

      {/* ゲーム終了時にリセットボタン */}
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

