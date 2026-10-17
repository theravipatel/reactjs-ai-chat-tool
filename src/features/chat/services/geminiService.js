import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export async function sendMessage(prompt, previousInteractionId) {
    const response = await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: prompt,
        previous_interaction_id: previousInteractionId || undefined,
    });

    return {
        text: response.output_text,
        interactionId: response.id,
    };
}