const STORAGE_KEY = 'chat_sessions';

function normalizeMessage(message) {
    return {
        ...message,
        id:
            typeof message.id === 'string' && message.id
                ? message.id
                : crypto.randomUUID(),
    };
}

function isValidMessage(message) {
    return (
        message !== null &&
        typeof message === 'object' &&
        ['user', 'model'].includes(message.role) &&
        typeof message.text === 'string'
    );
}

function isValidSession(session) {
    return (
        session !== null &&
        typeof session === 'object' &&
        typeof session.id === 'string' &&
        typeof session.title === 'string' &&
        Array.isArray(session.history) &&
        session.history.every(isValidMessage) &&
        (
            session.interactionId === null ||
            typeof session.interactionId === 'string' ||
            session.interactionId === undefined
        )
    );
}

export function getChatSessions() {
    try {
        const savedSessions = localStorage.getItem(STORAGE_KEY);

        if (!savedSessions) {
            return [];
        }

        const parsedSessions = JSON.parse(savedSessions);

        if (!Array.isArray(parsedSessions)) {
            console.warn('Saved chat sessions are not an array.');
            return [];
        }

        return parsedSessions.filter(isValidSession).map((session) => ({
            ...session,
            history: session.history.map(normalizeMessage),
        }));
    } catch (error) {
        console.error('Failed to load chat sessions:', error);
        return [];
    }
}

export function saveChatSessions(sessions) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sessions)
        );

        return true;
    } catch (error) {
        console.error('Failed to save chat sessions:', error);
        return false;
    }
}
