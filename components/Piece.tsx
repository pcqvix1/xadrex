import React from 'react';
import { Piece as PieceType, PieceStyleName } from '../types';
import { PIECE_STYLES } from '../themes';

interface PieceProps {
  piece: PieceType;
  pieceStyle: PieceStyleName;
}

const Piece: React.FC<PieceProps> = ({ piece, pieceStyle }) => {
  if (!piece) {
    return null;
  }
  
  const pieceSVG = PIECE_STYLES[pieceStyle] || PIECE_STYLES['Padrão'];
  const svgUrl = pieceSVG[piece.color][piece.type];

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-grab"
      style={{
        backgroundImage: `url(${svgUrl})`,
        backgroundSize: '85%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      draggable={false} // Prevents native image drag
    />
  );
};

export default Piece;
