import React from 'react';
import Piece from './Piece';
import { Piece as PieceType, BoardThemeName, PieceStyleName } from '../types';
import { BOARD_THEMES } from '../themes';

interface SquareProps {
  isBlack: boolean;
  piece: PieceType | null;
  isSelected: boolean;
  isLegalMove: boolean;
  isInCheck: boolean;
  onClick: () => void;
  boardTheme: BoardThemeName;
  pieceStyle: PieceStyleName;
}

const Square: React.FC<SquareProps> = ({ isBlack, piece, isSelected, isLegalMove, isInCheck, onClick, boardTheme, pieceStyle }) => {
  const theme = BOARD_THEMES[boardTheme] || BOARD_THEMES['Esmeralda'];
  const bgClass = isBlack ? theme.dark : theme.light;
  
  let overlayClass = '';
  if (isSelected) {
    overlayClass = 'bg-yellow-400/50';
  } else if (isInCheck) {
    overlayClass = 'bg-red-500/70';
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center relative ${bgClass}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${overlayClass} transition-colors duration-200`}></div>
      {piece && <Piece piece={piece} pieceStyle={pieceStyle} />}
      {isLegalMove && (
        <div className="absolute w-1/3 h-1/3 bg-green-500/70 rounded-full"></div>
      )}
    </div>
  );
};

export default Square;
