export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'b' | 'w';

export interface Piece {
  type: PieceSymbol;
  color: PieceColor;
}

export type Square = string;

export interface Move {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
}

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export type BoardThemeName = 'Esmeralda' | 'Madeira' | 'Gelo';
export type PieceStyleName = 'Padrão' | 'Clássico' | 'Moderno';
export type BackgroundThemeName = 'Escuro' | 'Claro';
