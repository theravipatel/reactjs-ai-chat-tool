import { useEffect, useReducer, useRef } from 'react';
import {
    getGeminiErrorMessage,
    sendMessage,
} from '../services/geminiService';
import {
    getChatSessions,
    saveChatSessions,
} from '../repositories/chatRepository';
import {
    chatReducer,
    initialChatState,
} from '../reducers/chatReducer';
import {
    createMessage,
    createSessionTitle,
    appendMessage,
    createChatSession,
    saveSessionToList,
} from '../utils/chatUtils';

export function useChat() {
    const [state, dispatch] = useReducer(
        chatReducer,
        initialChatState
    );

    const requestInProgressRef = useRef(false);

    const {
        chatHistory,
        interactionId,
        activeSessionId,
        isLoading,
        chatSessions,
    } = state;

    useEffect(() => {
        dispatch({
            type: 'SESSIONS_UPDATED',
            chatSessions: getChatSessions(),
        });
    }, []);

    const handleNewChat = () => {
        if (isLoading) return;

        dispatch({ type: 'NEW_CHAT' });
    };

    const handleSelectSession = (session) => {
        if (isLoading) return;

        dispatch({
            type: 'SELECT_SESSION',
            session,
        });
    };

    const saveConversation = ({
        history,
        interactionId: nextInteractionId,
        currentSessionId,
        isFirstMessage,
        sessionTitle,
    }) => {
        const sessionId =
            isFirstMessage || !currentSessionId
                ? crypto.randomUUID()
                : currentSessionId;

        const session = createChatSession({
            id: sessionId,
            title: sessionTitle,
            history,
            interactionId: nextInteractionId,
        });

        const nextChatSessions = saveSessionToList(
            chatSessions,
            session
        );

        dispatch({
            type: 'SESSIONS_UPDATED',
            chatSessions: nextChatSessions,
        });

        dispatch({
            type: 'SESSION_ACTIVATED',
            sessionId,
        });

        const wasSaved = saveChatSessions(nextChatSessions);

        if (!wasSaved) {
            console.warn(
                'This conversation is available in the current session, but could not be saved to local storage.'
            );
        }
    };


    const sendChatMessage = async (message, image, modelId) => {
        const userPrompt = message.trim() || (image ? 'Describe this image.' : '');

        if ((!userPrompt && !image) || requestInProgressRef.current) return;

        requestInProgressRef.current = true;

        const currentSessionId = state.activeSessionId ?? null;

        const currentInteractionId = interactionId;
        const isFirstMessage = chatHistory.length === 0;

        const sessionTitle = createSessionTitle(userPrompt);

        const userMessage = createMessage('user', userPrompt, image);

        const updatedHistory = appendMessage(
            chatHistory,
            userMessage
        );

        dispatch({
            type: 'MESSAGE_SENT',
            message: userMessage,
        });

        let result;

        try {
            const apiKey = localStorage.getItem('gemini_api_key');

            if (!apiKey?.trim()) {
                throw new Error('Gemini API key is not configured.');
            }

            result = await sendMessage(
                userPrompt,
                currentInteractionId,
                apiKey,
                modelId,
                image
            );
        } catch (error) {
            console.error(
                'Failed to send chat message:',
                error
            );

            const errorMessage = !localStorage.getItem('gemini_api_key')?.trim()
                ? 'Your Gemini API key is missing. Please refresh the page and complete setup again.'
                : getGeminiErrorMessage(error) ?? 'Sorry, I couldn’t get a response. Please check your API key and try again.';

            const failedMessage = createMessage(
                'model',
                errorMessage
            );

            const failedHistory = appendMessage(
                updatedHistory,
                failedMessage
            );

            dispatch({
                type: 'MESSAGE_FAILED',
                message: failedMessage,
            });

            saveConversation({
                history: failedHistory,
                interactionId: currentInteractionId,
                currentSessionId,
                isFirstMessage,
                sessionTitle,
            });

            requestInProgressRef.current = false;

            return;
        }

        const nextInteractionId = result.interactionId;

        const modelMessage = createMessage(
            'model',
            result.text
        );

        const finalHistory = appendMessage(
            updatedHistory,
            modelMessage
        );

        dispatch({
            type: 'MESSAGE_RECEIVED',
            interactionId: nextInteractionId,
            message: modelMessage,
        });

        saveConversation({
            history: finalHistory,
            interactionId: nextInteractionId,
            currentSessionId,
            isFirstMessage,
            sessionTitle,
        });

        requestInProgressRef.current = false;
    };

    return {
        chatHistory,
        interactionId,
        activeSessionId,
        isLoading,
        chatSessions,
        handleNewChat,
        handleSelectSession,
        sendChatMessage,
    };
}