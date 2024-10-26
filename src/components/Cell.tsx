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

  // Define the semi-transparent background for winning cells
  const winningBackgroundColor = playerColor
    ? `rgba(${playerColor.color.replace("blue.500", "33, 150, 243").replace("red.500", "244, 67, 54")}, 0.5)`
    : "gray.300";

  return (
    <Box>
      <Button
        onClick={value ? undefined : onClick} // Disable onClick if cell is occupied
        width="80px"
        height="80px"
        fontSize="5xl"
        bg={isWinning ? winningBackgroundColor : playerColor?.color || "gray.300"} // Use winningBackgroundColor for winning cells
        color="white"
        borderRadius="md"
        borderColor={isWinning ? playerColor?.borderColor : "gray.400"}
        borderWidth={isWinning ? "4px" : "2px"}
        variant="solid"
        _hover={value ? {} : { transform: "scale(1.05)" }} // Disable hover on occupied cells
        transition="all 0.2s"
        cursor={value ? "not-allowed" : "pointer"} // Show not-allowed cursor for occupied cells
        opacity={winner && !isWinning ? 0.4 : 1} // Dim cells not part of the winning line if there's a winner
      >
        {value}
      </Button>
    </Box>
  );
};

export default Cell;
