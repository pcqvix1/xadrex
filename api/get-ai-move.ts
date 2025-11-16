import { GoogleGenAI } from "@google/genai";
import { Difficulty } from '../types';

const getSystemInstruction = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'Fácil':
            return "Você é um jogador de xadrez iniciante. Seu objetivo é jogar, mas você pode cometer alguns erros. Responda APENAS com o seu movimento no formato UCI (por exemplo, e2e4, g1f3, e7e8q). Não inclua nenhuma explicação.";
        case 'Médio':
            return "Você é um jogador de xadrez intermediário e competente. Jogue um jogo sólido e tente vencer. Responda APENAS com o seu movimento no formato UCI (por exemplo, e2e4, g1f3, e7e8q). Não inclua nenhuma explicação.";
        case 'Difícil':
            return "Você é um grande mestre de xadrez de classe mundial. Analise a posição cuidadosamente e jogue o melhor movimento possível. Responda APENAS com o seu movimento no formato UCI (por exemplo, e2e4, g1f3, e7e8q). Não inclua nenhuma explicação.";
    }
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { fen, difficulty, history } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        if (!fen || !difficulty || !history) {
            return res.status(400).json({ error: 'Missing required parameters: fen, difficulty, history' });
        }
        
        if (!process.env.API_KEY) {
            console.error("API key for Gemini is not set on the server.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = getSystemInstruction(difficulty);
        const prompt = `O estado atual do tabuleiro é: ${fen}. O histórico de movimentos é: ${history.join(' ')}. Qual é o seu próximo movimento?`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        const move = response.text.trim();

        if (/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) {
             return res.status(200).json({ move });
        } else {
            console.error("Gemini returned an invalid move format:", move);
            return res.status(500).json({ error: 'AI returned invalid move format.' });
        }
    } catch (error) {
        console.error("Error in get-ai-move function:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
