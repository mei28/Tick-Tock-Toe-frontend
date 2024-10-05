import React from 'react';
import { Box } from '@yamada-ui/react';

interface WinningLineOverlayProps {
  winningLine: [[number, number], [number, number], [number, number]] | null;
  winner: string | null;
}

const WinningLineOverlay: React.FC<WinningLineOverlayProps> = ({ winningLine, winner }) => {
  if (!winningLine || !winner) return null;

  // 勝利ラインの位置をCSSスタイルに変換する
  const getLineStyle = () => {
    const [start, , end] = winningLine;
    const color = winner === "X" ? "blue.500" : "red.500"; // 勝利プレイヤーに基づく色

    if (start[0] === end[0]) {
      // 横一列
      return {
        top: `${start[0] * 100 + 50 - 2.5}px`,
        left: '0',
        width: '100%',
        height: '5px',
        backgroundColor: color,
      };
    } else if (start[1] === end[1]) {
      // 縦一列
      return {
        top: '0',
        left: `${start[1] * 100 + 50 - 2.5}px`,
        width: '5px',
        height: '100%',
        backgroundColor: color,
      };
    } else if (start[0] === 0 && start[1] === 0 && end[0] === 2 && end[1] === 2) {
      // 斜め左上から右下
      return {
        top: '0',
        left: '0',
        width: '100%',
        height: '5px',
        backgroundColor: color,
        transform: 'rotate(45deg)',
        transformOrigin: 'top left',
      };
    } else if (start[0] === 0 && start[1] === 2 && end[0] === 2 && end[1] === 0) {
      // 斜め右上から左下
      return {
        top: '0',
        left: '0',
        width: '100%',
        height: '5px',
        backgroundColor: color,
        transform: 'rotate(-45deg)',
        transformOrigin: 'top left',
      };
    }
    return {};
  };

  return <Box position="absolute" style={getLineStyle()} zIndex={0} />;
};

export default WinningLineOverlay;

