export type Player = "X" | "O";

export const playerColors: Record<Player, { color: string; borderColor: string }> = {
  X: {
    color: "blue.500",
    borderColor: "blue.300",
  },
  O: {
    color: "red.500",
    borderColor: "red.300",
  },
};

