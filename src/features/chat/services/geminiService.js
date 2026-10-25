import { GoogleGenAI } from '@google/genai';

export async function validateApiKey(apiKey) {
    const key = apiKey.trim();

    if (!key) {
        throw new Error('Please enter your Gemini API key.');
    }

    const ai = new GoogleGenAI({ apiKey: key });

    await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: 'Reply with OK.',
    });

    return true;
}

export async function sendMessage(
    prompt,
    previousInteractionId,
    apiKey
) {
    const key = apiKey?.trim();

    if (!key) {
        throw new Error('Missing Gemini API key.');
    }

    const ai = new GoogleGenAI({ apiKey: key });

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
        throw new Error(
            'Gemini response is missing its interaction ID.'
        );
    }

    return {
        text: response.output_text,
        interactionId: response.id,
    };
}