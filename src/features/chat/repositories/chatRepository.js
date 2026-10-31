const STORAGE_KEY = 'chat_sessions';
const MAX_IMAGE_BASE64_LENGTH = Math.ceil((2 * 1024 * 1024) / 3) * 4;

function isValidImage(image) {
    return (
        image !== null &&
        typeof image === 'object' &&
        typeof image.name === 'string' &&
        typeof image.data === 'string' &&
        image.data.length <= MAX_IMAGE_BASE64_LENGTH &&
        /^[A-Za-z0-9+/]+={0,2}$/.test(image.data) &&
        ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'].includes(image.mimeType)
    );
}

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
        typeof message.text === 'string' &&
        (message.image === undefined || isValidImage(message.image))
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
