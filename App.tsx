import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Chessboard from './components/Chessboard';
import { getAiMove } from './services/geminiService';
import { Difficulty, Piece as PieceType, Square as SquareType, BoardThemeName, PieceStyleName, BackgroundThemeName } from './types';
import { BOARD_THEMES, PIECE_STYLES, BACKGROUND_THEMES } from './themes';

declare var Chess: any;

// FIX: Moved ControlButton outside the App component to prevent it from being recreated on every render.
// This resolves TypeScript errors related to the 'key' prop and is a React best practice.
// It now accepts 'backgroundTheme' as a prop.
const ControlButton = ({ label, onClick, isActive, backgroundTheme }: { label: string, onClick: () => void, isActive: boolean, backgroundTheme: BackgroundThemeName }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive
                ? 'bg-emerald-500 text-white shadow-md'
                : `${backgroundTheme === 'Escuro' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-400`
        }`}
    >
        {label}
    </button>
);

const App: React.FC = () => {
    const game = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState(game.fen());
    const [board, setBoard] = useState<(PieceType | null)[][]>(game.board());
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [legalMoves, setLegalMoves] = useState<SquareType[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('Médio');
    const [gameOver, setGameOver] = useState<string | null>(null);
    const [kingInCheckSquare, setKingInCheckSquare] = useState<string | null>(null);

    // Customization State
    const [boardTheme, setBoardTheme] = useState<BoardThemeName>(() => (localStorage.getItem('chessBoardTheme') as BoardThemeName) || 'Esmeralda');
    const [pieceStyle, setPieceStyle] = useState<PieceStyleName>(() => (localStorage.getItem('chessPieceStyle') as PieceStyleName) || 'Padrão');
    const [backgroundTheme, setBackgroundTheme] = useState<BackgroundThemeName>(() => (localStorage.getItem('chessBackgroundTheme') as BackgroundThemeName) || 'Escuro');

    // Save preferences to localStorage
    useEffect(() => { localStorage.setItem('chessBoardTheme', boardTheme); }, [boardTheme]);
    useEffect(() => { localStorage.setItem('chessPieceStyle', pieceStyle); }, [pieceStyle]);
    useEffect(() => { localStorage.setItem('chessBackgroundTheme', backgroundTheme); }, [backgroundTheme]);
    
    const currentTheme = BACKGROUND_THEMES[backgroundTheme];

    const updateGameState = useCallback(() => {
        setFen(game.fen());
        setBoard(game.board());

        if (game.game_over()) {
            if (game.in_checkmate()) {
                const winner = game.turn() === 'w' ? 'Pretas' : 'Brancas';
                setGameOver(`${winner} Venceram!`);
            }
            else if (game.in_draw()) setGameOver('Empate!');
            else if (game.in_stalemate()) setGameOver('Empate por afogamento!');
            else setGameOver('Fim de jogo!');
        } else {
            setGameOver(null);
        }

        if(game.in_check()){
            const kingsSquare = [].concat(...game.board()).map((p, index) => {
                if (p !== null && p.type === 'k' && p.color === game.turn()) {
                    const row = '87654321'[Math.floor(index/8)];
                    const col = 'abcdefgh'[index%8];
                    return col+row;
                }
                return null;
            }).filter(Boolean)[0];
            setKingInCheckSquare(kingsSquare);
        } else {
            setKingInCheckSquare(null);
        }
    }, [game]);

    const makeAiMove = useCallback(async () => {
        if (game.game_over() || game.turn() !== 'b') return;

        setIsAiThinking(true);
        const aiMoveUci = await getAiMove(game.fen(), difficulty, game.history());
        
        if (aiMoveUci) {
            const move = game.move(aiMoveUci, { sloppy: true });
            if (move === null) {
                console.error("Gemini proposed an illegal move:", aiMoveUci);
                setGameOver("A IA propôs um movimento ilegal. Você venceu!");
            }
        } else {
             setGameOver("A IA não conseguiu encontrar um movimento. Você venceu!");
        }

        updateGameState();
        setIsAiThinking(false);
    }, [game, difficulty, updateGameState]);

    useEffect(() => {
        if (game.turn() === 'b' && !game.game_over()) {
            setTimeout(makeAiMove, 500);
        }
    }, [fen, makeAiMove]);

    const handleSquareClick = (square: SquareType) => {
        if (isAiThinking || gameOver || game.turn() !== 'w') return;

        if (selectedSquare) {
            const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
            if (move) updateGameState();
            setSelectedSquare(null);
            setLegalMoves([]);
        } else {
            const piece = game.get(square);
            if (piece && piece.color === 'w') {
                setSelectedSquare(square);
                const moves = game.moves({ square: square, verbose: true });
                setLegalMoves(moves.map((m: any) => m.to));
            }
        }
    };

    const handleNewGame = () => {
        game.reset();
        updateGameState();
        setSelectedSquare(null);
        setLegalMoves([]);
    };
    
    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <header className="text-center mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 tracking-tight">Gemini Chess</h1>
                    <p className={`${currentTheme.subText} mt-1`}>Desafie a IA. Jogue com as brancas.</p>
                </header>

                <main className="w-full flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 lg:gap-8 mt-4">
                    <div className="w-full max-w-lg md:max-w-xl lg:w-auto lg:flex-1">
                        <Chessboard
                            board={board}
                            onSquareClick={handleSquareClick}
                            selectedSquare={selectedSquare}
                            legalMoves={legalMoves}
                            kingInCheckSquare={kingInCheckSquare}
                            boardTheme={boardTheme}
                            pieceStyle={pieceStyle}
                        />
                    </div>
                    
                    <div className={`${currentTheme.card} p-6 rounded-lg shadow-2xl w-full max-w-md lg:w-80 flex flex-col gap-5`}>
                         <div>
                            <h2 className={`text-lg font-semibold ${currentTheme.cardText} mb-2`}>Status</h2>
                            <div className={`${backgroundTheme === 'Escuro' ? 'bg-gray-900' : 'bg-gray-100'} p-3 rounded-md text-center h-12 flex items-center justify-center`}>
                                {gameOver ? (
                                    <p className="text-xl font-bold text-yellow-400">{gameOver}</p>
                                ) : isAiThinking ? (
                                    <p className="text-lg text-blue-400 animate-pulse">Gemini está pensando...</p>
                                ) : kingInCheckSquare ? (
                                    <p className="text-lg font-semibold text-orange-400">Rei {game.turn() === 'w' ? 'Branco' : 'Preto'} em Check!</p>
                                ) : (
                                    <p className={`text-lg ${currentTheme.subText}`}>Turno das {game.turn() === 'w' ? 'Brancas' : 'Pretas'}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <h2 className={`text-lg font-semibold ${currentTheme.cardText} mb-2`}>Dificuldade da IA</h2>
                            <div className="flex justify-between gap-2">
                                {(['Fácil', 'Médio', 'Difícil'] as Difficulty[]).map(level => 
                                    <ControlButton key={level} label={level} onClick={() => setDifficulty(level)} isActive={difficulty === level} backgroundTheme={backgroundTheme} />
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className={`text-lg font-semibold ${currentTheme.cardText} mb-3`}>Personalizar</h2>
                             <div className="space-y-3">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-sm font-medium">Tabuleiro</span>
                                    <div className="flex-1 flex justify-between gap-1 p-1 rounded-lg bg-black/20">
                                       {(Object.keys(BOARD_THEMES) as BoardThemeName[]).map(theme => 
                                            <ControlButton key={theme} label={theme} onClick={() => setBoardTheme(theme)} isActive={boardTheme === theme} backgroundTheme={backgroundTheme} />
                                       )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                     <span className="text-sm font-medium">Peças</span>
                                     <div className="flex-1 flex justify-between gap-1 p-1 rounded-lg bg-black/20">
                                       {(Object.keys(PIECE_STYLES) as PieceStyleName[]).map(style => 
                                            <ControlButton key={style} label={style} onClick={() => setPieceStyle(style)} isActive={pieceStyle === style} backgroundTheme={backgroundTheme} />
                                       )}
                                    </div>
                                </div>
                                 <div className="flex justify-between items-center gap-2">
                                     <span className="text-sm font-medium">Fundo</span>
                                     <div className="flex-1 flex justify-between gap-1 p-1 rounded-lg bg-black/20">
                                        {(Object.keys(BACKGROUND_THEMES) as BackgroundThemeName[]).map(theme => 
                                            <ControlButton key={theme} label={theme} onClick={() => setBackgroundTheme(theme)} isActive={backgroundTheme === theme} backgroundTheme={backgroundTheme} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNewGame}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg mt-2"
                        >
                            Novo Jogo
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;