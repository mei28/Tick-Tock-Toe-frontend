import React from 'react';
import { Box, Button } from '@yamada-ui/react';
import { playerColors } from '../constants/theme';

interface CellProps {
  value: string;
  onClick: () => void;
  isWinning: boolean; // 勝利ラインに含まれているかどうか
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning }) => {
  const playerColor = value ? playerColors[value as "X" | "O"] : null;

  // 勝利セルの色をrgbaで定義し、透明度を追加
  const winningBackgroundColor = playerColor
    ? `rgba(${playerColor.color.replace("blue.500", "33, 150, 243").replace("red.500", "244, 67, 54")}, 0.5)`
    : "gray.300";

  return (
    <Box>
      <Button
        onClick={onClick}
        width="80px"
        height="80px"
        bg={isWinning ? winningBackgroundColor : playerColor?.color || "gray.300"} // 勝利セルは背景色を透明に近く
        color="white"
        borderRadius="md"
        borderColor={isWinning ? playerColor?.borderColor : "gray.400"} // 勝利セルのボーダーはプレイヤーの色で強調
        borderWidth={isWinning ? "4px" : "2px"} // 勝利セルは太いボーダー
        variant="solid"
        _hover={{ transform: "scale(1.05)" }} // マウスオーバー時に拡大
        transition="all 0.2s"
      >
        {value}
      </Button>
    </Box>
  );
};

export default Cell;

