import React from 'react';
import { Box, Button } from '@yamada-ui/react';

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <Box>
      <Button onClick={onClick} width="60px" height="60px">
        {value}
      </Button>
    </Box>
  );
};

export default Cell;

