import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODELS = [
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash' },
    { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
    { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Light' },
    { id: 'gemma-4', label: 'Gemma 4' },
];

function createGeminiClient(apiKey) {
    return new GoogleGenAI({
        apiKey,
        httpOptions: {
            retryOptions: { attempts: 1 },
        },
    });
}

export function getGeminiErrorMessage(error) {
    if (error?.status === 429) {
        let apiMessage = '';

        try {
            apiMessage = JSON.parse(error.message)?.error?.message ?? '';
        } catch {
            apiMessage = error.message ?? '';
        }

        const retryDelay = apiMessage.match(
            /retry in (\d+\s*(?:s|sec(?:ond)?s?|m|min(?:ute)?s?))/i
        )?.[1];

        return retryDelay
            ? `Gemini rate limit reached. Please try again in ${retryDelay}.`
            : 'Gemini rate limit reached. Please wait before trying again.';
    }

    if (error?.status === 503) {
        return 'Gemini is temporarily unavailable. Please try again shortly.';
    }

    return null;
}

export async function validateApiKey(apiKey) {
    const key = apiKey.trim();

    if (!key) {
        throw new Error('Please enter your Gemini API key.');
    }

    const ai = createGeminiClient(key);

    await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: 'Reply with OK.',
    });

    return true;
}

export async function sendMessage(
    prompt,
    previousInteractionId,
    apiKey,
    modelId = GEMINI_MODELS[0].id,
    image = null
) {
    const key = apiKey?.trim();

    if (!key) {
        throw new Error('Missing Gemini API key.');
    }

    const ai = createGeminiClient(key);

    const input = image
        ? [
            { type: 'text', text: prompt },
            {
                type: 'image',
                data: image.data,
                mime_type: image.mimeType,
            },
        ]
        : prompt;

    const response = await ai.interactions.create({
        model: modelId,
        input,
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