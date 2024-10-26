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
    <Box as="label" width="100%"> {/* Ensuring full width for uniformity */}
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
        width="100%"  // Match width for all CustomRadio buttons
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
    <VStack align="center" justify="center" h="100vh" gap={{ base: 2, md: 4 }} p={{ base: 4, md: 6 }}>
      <Heading size={{ base: "md", md: "lg" }} color="teal.500" textAlign="center">
        AI Game Settings
      </Heading>

      <VStack width={{ base: "80%", sm: "60%", md: "50%" }} maxW="300px" mt={6}>
        <Text textAlign="left" width="100%">First Player:</Text>
        <HStack {...getFirstPlayerContainerProps()} width="100%">
          <CustomRadio {...getFirstPlayerRadioProps({ value: "Player" })}>Player</CustomRadio>
          <CustomRadio {...getFirstPlayerRadioProps({ value: "AI" })}>AI</CustomRadio>
        </HStack>
      </VStack>

      <VStack width={{ base: "80%", sm: "60%", md: "50%" }} maxW="300px" mt={4}>
        <Text textAlign="left" width="100%">AI Difficulty:</Text>
        <HStack {...getAILevelContainerProps()} width="100%">
          <CustomRadio {...getAILevelRadioProps({ value: "easy" })}>Easy</CustomRadio>
          <CustomRadio {...getAILevelRadioProps({ value: "medium" })}>Medium</CustomRadio>
          <CustomRadio {...getAILevelRadioProps({ value: "hard" })}>Hard</CustomRadio>
        </HStack>
      </VStack>

      <Button
        onClick={handleStartGame}
        colorScheme="teal"
        size={{ base: "md", md: "lg" }}
        width={{ base: "80%", sm: "60%", md: "50%" }}
        maxW="300px"
        mt={6}
      >
        Start Game
      </Button>
    </VStack>
  );
};

export default AISettingsScreen;

