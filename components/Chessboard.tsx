import React from 'react';
import Square from './Square';
import { Piece as PieceType, BoardThemeName, PieceStyleName } from '../types';

interface ChessboardProps {
  board: (PieceType | null)[][];
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  legalMoves: string[];
  kingInCheckSquare: string | null;
  boardTheme: BoardThemeName;
  pieceStyle: PieceStyleName;
}

const Chessboard: React.FC<ChessboardProps> = ({ board, onSquareClick, selectedSquare, legalMoves, kingInCheckSquare, boardTheme, pieceStyle }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="w-full aspect-square grid grid-cols-8 shadow-2xl border-4 border-gray-700/50">
      {ranks.map((rank, rowIndex) =>
        files.map((file, colIndex) => {
          const isBlack = (rowIndex + colIndex) % 2 !== 0;
          const square = `${file}${rank}`;
          const piece = board[rowIndex][colIndex];
          
          return (
            <Square
              key={square}
              isBlack={isBlack}
              piece={piece}
              isSelected={selectedSquare === square}
              isLegalMove={legalMoves.includes(square)}
              isInCheck={kingInCheckSquare === square}
              onClick={() => onSquareClick(square)}
              boardTheme={boardTheme}
              pieceStyle={pieceStyle}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;
