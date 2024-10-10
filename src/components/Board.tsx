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
  const [gameId, setGameId] = useState<string | null>(null); // 新しいゲームIDの追加
  const [inputGameId, setInputGameId] = useState<string>(""); // 既存のゲームに参加するためのID入力フォーム

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

  // 新しいゲームを開始する関数
  const handleNewGame = async () => {
    try {
      const response = await axios.post(`${API_URL}/new`);
      setGameId(response.data);  // 新しいゲームIDを取得
      setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
      setCurrentPlayer("X");
      setWinner(null);
      setWinningLine(null);
    } catch (error) {
      console.error("Failed to start a new game:", error);
    }
  };

  // 既存のゲームに参加する関数
  const handleJoinGame = () => {
    setGameId(inputGameId); // 入力されたゲームIDで既存のゲームに参加
    setInputGameId(""); // 入力フィールドをクリア
  };

  return (
    <VStack>
      {/* ゲームIDを表示 */}
      {gameId && (
        <Box>
          <Text fontSize="lg" color="gray.500">
            {`Game ID: ${gameId}`}
          </Text>
        </Box>
      )}

      {/* 新しいゲームを始めるボタン */}
      {!gameId && (
        <Button onClick={handleNewGame} colorScheme="teal" marginY="4">
          Start New Game
        </Button>
      )}

      {/* ゲームIDを入力して既存のゲームに参加 */}
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

      {/* ボードを表示するのはゲームが始まっている場合のみ */}
      {gameId && (
        <>
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

          {/* ゲームが終了している場合は、新しいゲームを開始するボタンを表示 */}
          {winner && (
            <Button onClick={handleNewGame} marginTop="4" colorScheme="teal">
              Start New Game
            </Button>
          )}

          {/* ゲーム中はリセットボタンを表示 */}
          {!winner && gameId && (
            <Button onClick={handleReset} marginTop="4" colorScheme="teal">
              Reset Game
            </Button>
          )}
        </>
      )}
    </VStack>
  );
};

export default Board;

