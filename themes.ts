import { BoardThemeName, PieceStyleName, BackgroundThemeName, PieceColor, PieceSymbol } from './types';

export const BOARD_THEMES: Record<BoardThemeName, { light: string; dark: string }> = {
  'Esmeralda': { light: 'bg-emerald-100', dark: 'bg-emerald-700' },
  'Madeira': { light: 'bg-amber-200', dark: 'bg-amber-700' },
  'Gelo': { light: 'bg-sky-100', dark: 'bg-sky-700' },
};

export const BACKGROUND_THEMES: Record<BackgroundThemeName, { bg: string; text: string; card: string; cardText: string; subText: string; }> = {
  'Escuro': { 
    bg: 'bg-gray-900', 
    text: 'text-white', 
    card: 'bg-gray-800', 
    cardText: 'text-gray-200',
    subText: 'text-gray-400',
  },
  'Claro': { 
    bg: 'bg-gray-200', 
    text: 'text-gray-800', 
    card: 'bg-white', 
    cardText: 'text-gray-700',
    subText: 'text-gray-500',
  },
};

const LICHESS_PIECES_BASE_URL = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/';

const buildLichessSet = (style: string): Record<PieceColor, Record<PieceSymbol, string>> => {
    const pieces: { [key in PieceSymbol]: string } = { p: 'p', n: 'n', b: 'b', r: 'r', q: 'q', k: 'k' };
    const colors: { [key in PieceColor]: string } = { w: 'w', b: 'b' };
    const result: any = { w: {}, b: {} };

    for (const colorKey in colors) {
        for (const pieceKey in pieces) {
            result[colorKey][pieceKey] = `${LICHESS_PIECES_BASE_URL}${style}/${colors[colorKey as PieceColor]}${pieces[pieceKey as PieceSymbol].toUpperCase()}.svg`;
        }
    }
    return result;
}

export const PIECE_STYLES: Record<PieceStyleName, Record<PieceColor, Record<PieceSymbol, string>>> = {
  'Padrão': {
    b: {
      p: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
      n: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
      b: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
      r: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
      q: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
      k: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
    },
    w: {
      p: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
      n: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
      b: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
      r: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
      q: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
      k: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    },
  },
  'Clássico': buildLichessSet('merida'),
  'Moderno': buildLichessSet('alpha'),
};
