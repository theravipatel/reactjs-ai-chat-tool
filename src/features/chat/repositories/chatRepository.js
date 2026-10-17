const STORAGE_KEY = 'chat_sessions';

export function getChatSessions() {
    const savedChatSessions = localStorage.getItem(STORAGE_KEY);

    if (!savedChatSessions) {
        return [];
    }

    try {
        const parsedChatSessions = JSON.parse(savedChatSessions);

        return Array.isArray(parsedChatSessions) ? parsedChatSessions : [];
    } catch (error) {
        console.error('Failed to load chat sessions:', error);
        return [];
    }
}

export function saveChatSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}