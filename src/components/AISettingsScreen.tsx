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

const CustomRadio: FC<any> = (props) => {
  const { getInputProps, getIconProps } = useRadio(props);

  return (
    <Box as="label">
      <input {...getInputProps()} style={{ display: 'none' }} />
      <Box
        {...getIconProps()}
        cursor="pointer"
        borderWidth="1px"
        py="xs"
        px="sm"
        rounded="md"
        textAlign="center"
        _checked={{
          bg: "teal.500",
          color: "white",
          borderColor: "teal.700",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const AISettingsScreen: React.FC = () => {
  const [aiLevel, setAILevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedFirstPlayer, setSelectedFirstPlayer] = useState<'Player' | 'AI'>('Player');
  const { request } = useApi();
  const navigate = useNavigate();
  const notice = useNotice();

  const { getContainerProps: getFirstPlayerContainerProps, getRadioProps: getFirstPlayerRadioProps } = useRadioGroup<'Player' | 'AI'>({
    defaultValue: "Player",
    onChange: (value) => setSelectedFirstPlayer(value),
  });

  const { getContainerProps: getAILevelContainerProps, getRadioProps: getAILevelRadioProps } = useRadioGroup<'easy' | 'medium' | 'hard'>({
    defaultValue: "medium",
    onChange: (value) => setAILevel(value),
  });

  const handleStartGame = async () => {
    try {
      const url = `/new?ai=true&firstPlayer=${selectedFirstPlayer}&aiLevel=${aiLevel}`;
      const shortGameId = await request(url, 'POST');
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
    <VStack align="center" justify="center" h="100vh" gap={4} p={4}>
      <Heading size="lg" color="teal.500">
        AI Game Settings
      </Heading>

      <HStack gap={4} width="60%" maxW="300px" mt={6} {...getFirstPlayerContainerProps()}>
        <Text>First Player:</Text>
        <CustomRadio {...getFirstPlayerRadioProps({ value: "Player" })}>Player</CustomRadio>
        <CustomRadio {...getFirstPlayerRadioProps({ value: "AI" })}>AI</CustomRadio>
      </HStack>

      <HStack gap={4} width="60%" maxW="300px" mt={4} {...getAILevelContainerProps()}>
        <Text>AI Difficulty:</Text>
        <CustomRadio {...getAILevelRadioProps({ value: "easy" })}>Easy</CustomRadio>
        <CustomRadio {...getAILevelRadioProps({ value: "medium" })}>Medium</CustomRadio>
        <CustomRadio {...getAILevelRadioProps({ value: "hard" })}>Hard</CustomRadio>
      </HStack>

      <Button onClick={handleStartGame} colorScheme="teal" size="lg" width="60%" maxW="300px" mt={6}>
        Start Game
      </Button>
    </VStack>
  );
};

export default AISettingsScreen;

