export const initialChatState = {
    chatHistory: [],
    interactionId: null,
    activeSessionId: null,
    isLoading: false,
    chatSessions: [],
};

export function chatReducer(state, action) {
    switch (action.type) {
        case 'NEW_CHAT':
            return {
                ...state,
                chatHistory: [],
                interactionId: null,
                activeSessionId: null,
            };

        case 'SELECT_SESSION':
            return {
                ...state,
                chatHistory: action.session.history,
                activeSessionId: action.session.id,
                interactionId: action.session.interactionId ?? null,
            };
        
        case 'SESSION_ACTIVATED':
            return {
                ...state,
                activeSessionId: action.sessionId,
            };
        
        case 'MESSAGE_SENT':
            return {
                ...state,
                chatHistory: [
                    ...state.chatHistory,
                    action.message,
                ],
                isLoading: true,
            };

        case 'MESSAGE_RECEIVED':
            return {
                ...state,
                chatHistory: [
                    ...state.chatHistory,
                    action.message,
                ],
                interactionId: action.interactionId,
                isLoading: false,
            };

        case 'MESSAGE_FAILED':
            return {
                ...state,
                chatHistory: [
                    ...state.chatHistory,
                    {
                        role: 'model',
                        text: action.error,
                    },
                ],
                isLoading: false,
            };
        
        case 'SESSIONS_UPDATED':
            return {
                ...state,
                chatSessions: action.chatSessions,
            };

        default:
            return state;
    }
}