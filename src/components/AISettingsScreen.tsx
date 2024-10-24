import React, { useState, FC } from 'react';
import {
  VStack,
  Button,
  Heading,
  HStack,
  Box,
  useRadio,
  useRadioGroup,
  Text,
  useNotice,
} from '@yamada-ui/react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

// Custom Radio Button Component
const CustomRadio: FC<any> = (props) => {
  const { getInputProps, getIconProps } = useRadio(props);

  return (
    <Box as="label">
      <input {...getInputProps()} style={{ display: 'none' }} /> {/* Hidden input */}
      <Box
        {...getIconProps()}
        cursor="pointer"
        borderWidth="1px"
        py="xs"
        px="sm"
        rounded="md"
        textAlign="center"
        _checked={{
          bg: "teal.500",        // Match the app's teal theme
          color: "white",
          borderColor: "teal.700", // Darker teal for border
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const AISettingsScreen: React.FC = () => {
  const [aiLevel, setAILevel] = useState<'easy' | 'medium' | 'hard'>('medium'); // 型定義を追加
  const [selectedFirstPlayer, setSelectedFirstPlayer] = useState<'Player' | 'AI'>('Player'); // 型定義を追加
  const { request } = useApi();
  const navigate = useNavigate();
  const notice = useNotice();

  // Radio Group for First Player Selection (Player or AI)
  const { getContainerProps: getFirstPlayerContainerProps, getRadioProps: getFirstPlayerRadioProps } = useRadioGroup<'Player' | 'AI'>({
    defaultValue: "Player", // Default to Player first
    onChange: (value: 'Player' | 'AI') => setSelectedFirstPlayer(value), // 型を指定
  });

  // Radio Group for AI Level Selection (Easy, Medium, Hard)
  const { getContainerProps: getAILevelContainerProps, getRadioProps: getAILevelRadioProps } = useRadioGroup<'easy' | 'medium' | 'hard'>({
    defaultValue: "medium", // Default to Medium level
    onChange: (value: 'easy' | 'medium' | 'hard') => setAILevel(value), // 型を指定
  });

  const handleStartGame = async () => {
    try {
      // クエリパラメータにfirstPlayerとaiLevelを含めて送信
      const url = `/new?ai=true&firstPlayer=${selectedFirstPlayer}&aiLevel=${aiLevel}`;
      const shortGameId = await request(url, 'POST');

      // ゲーム画面に移動
      navigate(`/game/${shortGameId.slice(0, 5)}?firstPlayer=${selectedFirstPlayer}&aiLevel=${aiLevel}`);
    } catch (error) {
      notice({
        title: 'Failed to start game',
        description: 'There was an issue starting the AI game. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="center" justify="center" h="100vh">
      <Heading size="lg" color="teal.500">
        AI Game Settings
      </Heading>

      {/* Radio Group for selecting First Player (Player or AI) */}
      <HStack gap={4} width="60%" maxW="300px" mt={6} {...getFirstPlayerContainerProps()}>
        <Text>First Player:</Text>
        <CustomRadio {...getFirstPlayerRadioProps({ value: "Player" })}>Player</CustomRadio>
        <CustomRadio {...getFirstPlayerRadioProps({ value: "AI" })}>AI</CustomRadio>
      </HStack>

      {/* Radio Group for selecting AI Difficulty (Easy, Medium, Hard) */}
      <HStack gap={4} width="60%" maxW="300px" mt={4} {...getAILevelContainerProps()}>
        <Text>AI Difficulty:</Text>
        <CustomRadio {...getAILevelRadioProps({ value: "easy" })}>Easy</CustomRadio>
        <CustomRadio {...getAILevelRadioProps({ value: "medium" })}>Medium</CustomRadio> {/* Default */}
        <CustomRadio {...getAILevelRadioProps({ value: "hard" })}>Hard</CustomRadio>
      </HStack>

      <Button onClick={handleStartGame} colorScheme="teal" size="lg" width="60%" maxW="300px" mt={6}>
        Start Game
      </Button>
    </VStack>
  );
};

export default AISettingsScreen;

