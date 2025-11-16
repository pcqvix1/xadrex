import { Difficulty } from '../types';

export const getAiMove = async (fen: string, difficulty: Difficulty, history: string[]): Promise<string | null> => {
    try {
        const response = await fetch('/api/get-ai-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fen, difficulty, history }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from AI service:", errorData.error);
            return null;
        }

        const data = await response.json();
        return data.move || null;

    } catch (error) {
        console.error("Error fetching AI move from backend:", error);
        return null;
    }
};
