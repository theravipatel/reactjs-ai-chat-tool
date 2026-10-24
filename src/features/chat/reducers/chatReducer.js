import { saveSessionToList } from '../utils/chatUtils';

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
                isLoading: false,
            };

        case 'SELECT_SESSION':
            return {
                ...state,
                chatHistory: action.session.history,
                activeSessionId: action.session.id,
                interactionId: action.session.interactionId ?? null,
                isLoading: false,
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
                    action.message,
                ],
                isLoading: false,
            };

        case 'SESSIONS_UPDATED':
            return {
                ...state,
                chatSessions: action.chatSessions,
            };

        case 'SESSION_SAVED':
            return {
                ...state,
                activeSessionId: action.session.id,
                chatSessions: saveSessionToList(
                    state.chatSessions,
                    action.session
                ),
            };

        default:
            return state;
    }
}