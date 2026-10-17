import { useEffect, useReducer } from 'react';
import { sendMessage } from '../services/geminiService';
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
    updateChatSession,
} from '../utils/chatUtils';

export function useChat() {
    const [state, dispatch] = useReducer(
        chatReducer,
        initialChatState
    );

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

    const sendChatMessage = async (message) => {
        const userPrompt = message.trim();

        if (!userPrompt || isLoading) return;

        const currentSessionId = state.activeSessionId ?? null;

        const currentInteractionId = interactionId;
        const isFirstMessage = chatHistory.length === 0;

        const sessionTitle = createSessionTitle(userPrompt);

        const userMessage = createMessage(
            'user',
            userPrompt
        );

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
            result = await sendMessage(
                userPrompt,
                currentInteractionId
            );
        } catch (error) {
            console.error('Failed to send chat message:', error);

            dispatch({
                type: 'MESSAGE_FAILED',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unable to send your message. Please try again.',
            });

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

        let nextChatSessions;
        let nextSessionId = currentSessionId;

        if (isFirstMessage || !currentSessionId) {
            nextSessionId = crypto.randomUUID();

            const newSession = createChatSession({
                id: nextSessionId,
                title: sessionTitle,
                history: finalHistory,
                interactionId: nextInteractionId,
            });

            nextChatSessions = [newSession, ...chatSessions];
        } else {
            nextChatSessions = updateChatSession(
                chatSessions,
                currentSessionId,
                finalHistory,
                nextInteractionId
            );
        }

        dispatch({
            type: 'SESSION_ACTIVATED',
            sessionId: nextSessionId ?? currentSessionId,
        });

        dispatch({
            type: 'MESSAGE_RECEIVED',
            interactionId: nextInteractionId,
            message: modelMessage,
        });

        dispatch({
            type: 'SESSIONS_UPDATED',
            chatSessions: nextChatSessions,
        });

        try {
            saveChatSessions(nextChatSessions);
        } catch (error) {
            console.error(
                'Failed to save chat sessions:',
                error
            );
        }
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