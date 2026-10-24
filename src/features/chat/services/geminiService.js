import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error(
        'Missing API key.'
    );
}

const ai = new GoogleGenAI({ apiKey });

export async function sendMessage(prompt, previousInteractionId) {
    const response = await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: prompt,
        previous_interaction_id: previousInteractionId || undefined,
    });

    if (
        typeof response?.output_text !== 'string' ||
        !response.output_text.trim()
    ) {
        throw new Error('Gemini returned an empty response.');
    }

    if (
        typeof response.id !== 'string' ||
        !response.id
    ) {
        throw new Error('Gemini response is missing its interaction ID.');
    }

    return {
        text: response.output_text,
        interactionId: response.id,
    };
}