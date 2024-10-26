// src/components/Cell.tsx
import React from 'react';
import { Box, Button } from '@yamada-ui/react';
import { playerColors } from '../constants/theme';

interface CellProps {
  value: string;
  onClick: () => void;
  isWinning: boolean; // Whether it’s part of the winning line
  winner: string | null; // Indicates if there's a winner
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning, winner }) => {
  const playerColor = value ? playerColors[value as "X" | "O"] : null;

  // Apply opacity to non-winning cells only if there's a winner
  const bgColor = playerColor?.color || "gray.300";
  const opacity = winner && !isWinning ? 0.5 : 1.0; // Dim only non-winning cells if there’s a winner

  return (
    <Box>
      <Button
        onClick={value ? undefined : onClick} // Disable onClick if cell is occupied
        width="80px"
        height="80px"
        fontSize="5xl"
        bg={bgColor}
        color="white"
        borderRadius="md"
        borderColor={isWinning ? playerColor?.borderColor : "gray.400"}
        borderWidth={isWinning ? "4px" : "2px"}
        variant="solid"
        _hover={value || winner ? {} : { transform: "scale(1.05)" }} // Disable hover on occupied or finished game cells
        transition="all 0.2s"
        cursor={value || winner ? "not-allowed" : "pointer"} // Show not-allowed cursor for occupied or finished game cells
        opacity={opacity} // Apply opacity to non-winning cells if there's a winner
      >
        {value}
      </Button>
    </Box>
  );
};

export default Cell;

